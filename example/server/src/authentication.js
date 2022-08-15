const { AuthenticationService, JWTStrategy, AuthenticationBaseStrategy } = require('@feathersjs/authentication');
const axios = require('axios');
const { LocalStrategy } = require('@feathersjs/authentication-local');
const { expressOauth, OAuthStrategy } = require('@feathersjs/authentication-oauth');

const session = require('express-session');

const { utils } = require('@iy4u/common-server-lib');
const logger = utils.logger;
logger.level = process.env.NODE_ENV === 'production' ? 'info' : 'debug';


// eslint-disable-next-line no-unused-vars
class AnonymousStrategy extends AuthenticationBaseStrategy {
  // eslint-disable-next-line no-unused-vars
  async authenticate(authentication, params) {
    return {
      anonymous: true
    };
  }
}

// eslint-disable-next-line no-unused-vars
const { NotAuthenticated } = require('@feathersjs/errors');
// const axios = require('axios');

const lget = require('lodash.get');
const lomit = require('lodash.omit');
const lpick = require('lodash.pick');


class GoogleStrategy extends OAuthStrategy {
  async getEntityData(profile) {

    // this will set 'googleId'
    const baseData = await super.getEntityData(profile);

    // this will grab the picture and email address of the Google profile
    return {
      ...baseData,
      avatar: { small: { file: lget(profile, 'picture') } },
      email: profile.email,
      name: profile.name
    };
  }
  setup(app) {
    this.app = app;
  }

  async findEntity(profile) {
    const existing = await this.app.service('users').find({
      query: { email: profile.email }
    });
    return lget(existing, 'data[0]');
  }
  async updateEntity(entity, profile){
    let change = false;
    if(!entity.isVerified){
      change = true;
      entity.isVerified = true;
    }
    if(!entity.email){
      entity.email = profile.email;
    }
    if(!entity.name) entity.name = profile.name;
    if(!lget(entity, 'avatar.large.file') && profile.picture){
      entity.avatar = { large: { file: profile.picture }};
    }
    if(change){
      return await this.app.service('users').patch(entity._id, entity);
    } else return entity;
  }
}


class FacebookStrategy extends OAuthStrategy {
  async getProfile(authResult) {
    // This is the OAuth access token that can be used
    // for Facebook API requests as the Bearer token
    const accessToken = authResult.access_token;

    const { data } = await axios.get('https://graph.facebook.com/me', {
      headers: {
        authorization: `Bearer ${accessToken}`
      },
      params: {
        // There are
        fields: 'id,name,email,picture'
      }
    });

    return data;
  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      avatar: { large: { file: lget(profile, 'picture') } },
      name: profile.name,
      email: profile.email
    };
  }
  setup(app) {
    this.app = app;
  }

  async findEntity(profile) {
    const existing = await this.app.service('users').find({
      query: { email: profile.email }
    });
    return lget(existing, 'data[0]');
  }

  async updateEntity(entity, profile){
    let change = false;
    if(!entity.isVerified){
      change = true;
      entity.isVerified = true;
    }
    if(!entity.email) entity.email = profile.email;
    if(!entity.name) entity.name = profile.name;
    if(!lget(entity, 'avatar.large.file') && profile.picture){
      entity.avatar = { large: { file: profile.picture }};
    }
    if(change){
      return await this.app.service('users').patch(entity._id, entity);
    } else return entity;
  }
}


class LinkedinStrategy extends OAuthStrategy {
  async getProfile(authResult) {
    // This is the OAuth access token that can be used
    const accessToken = authResult.access_token;

    const profile = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      params: {
        // There are
        projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
      }
    })
      .catch(err => {
        console.log('linkedin get profile error', err);
      });

    const { firstName, lastName, profilePicture } = profile.data;

    const linkedinEmail = await axios.get('https://api.linkedin.com/v2/emailAddress', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      params: {
        // There are
        q: 'members',
        projection: '(elements*(handle~))'
      }
    })
      .catch(err => {
        console.log('linkedin get email error', err);
      });


    let data = {
      name: lget(firstName, 'localized.en_US') + ' ' + lget(lastName, 'localized.en_US'),
      avatar: { large: { file: lget(profilePicture, 'displayImage') } },
      email: lget(linkedinEmail, ['data', 'elements', 0, 'handle~', 'emailAddress'])
    };

    return data;
  }

  async getEntityData(profile) {
    // `profile` is the data returned by getProfile
    const baseData = await super.getEntityData(profile);

    return {
      ...baseData,
      avatar: profile.avatar,
      name: profile.name,
      email: profile.email
    };
  }

  setup(app) {
    this.app = app;
  }

  async findEntity(profile) {
    const existing = await this.app.service('users').find({
      query: { email: profile.email }
    });
    return lget(existing, 'data[0]');
  }
  async updateEntity(entity){
    if(!entity.isVerified){
      entity.isVerified = true;
      return await this.app.service('users').patch(entity._id, entity);
    } else return entity;
  }
}


module.exports = app => {

  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('google', new GoogleStrategy());
  authentication.register('facebook', new FacebookStrategy());
  authentication.register('linkedin', new LinkedinStrategy());

  app.use('/authentication', authentication);

  app.set('trust proxy', 1);
  if(process.env.NODE_ENV === 'production' || lget(app.get('redis'), 'on', false)) {
    const redisConnect = require('./redis');
    app.configure(redisConnect);
    app.configure(expressOauth({
      expressSession: session({
        store: app.get('redisSessionStore'),
        secret: app.get('sessionSecret'),
        resave: false,
        saveUninitialized: true,
        // cookie: {
        //   secure: false, // if true only transmit cookie over https
        //   httpOnly: false, // if true prevent client side JS from reading the cookie
        //   maxAge: 1000 * 60 * 10 // session max age in miliseconds
        // }
      })
    }));
  } else {
    app.configure(expressOauth());
  }


  // const beforeHook = context => {
  //   if (process.env.DEBUG) {
  //     logger.info('authentication.js => beforeHook => context.params:' + JSON.stringify(context.params));
  //     logger.info('authentication.js => beforeHook => context.arguments:' + JSON.stringify(context.arguments));
  //     logger.info('authentication.js => beforeHook => context.data:' + JSON.stringify(context.data));
  //   }
  // };
  //
  // const afterHook = context => {
  //   if (process.env.DEBUG) {
  //     logger.info('authentication.js => afterHook => context.params:' + JSON.stringify(context.params));
  //     logger.info('authentication.js => afterHook => context.arguments:' + JSON.stringify(context.arguments));
  //     logger.info('authentication.js => afterHook => context.data:' + JSON.stringify(context.data));
  //   }
  // };
  //
  //
  // const errorHook = context => {
  //   logger.error('FATAL: authentication.js => errorHook => context.error:' + JSON.stringify(context.error));
  // };


  app.service('authentication').hooks({
    before: {
      create: [
        // beforeHook
      ]
    },
    after: {
      create: [
        // afterHook,
        context => {
          const { user } = context.result;
          if (!user.isVerified) {
            throw new NotAuthenticated('User Account is not yet verified.');
          }

          const authenticationConfig = context.app.get('authentication');
          const defaultWhitelist = ['_id', 'createdAt', 'updatedAt'];
          let _user;
          let enforceWhitelist = lget(authenticationConfig, 'enforceWhitelist', true);
          let whitelistUserFields = lget(authenticationConfig, 'whitelistUserFields', []);
          if (enforceWhitelist || whitelistUserFields.length) _user = lpick(user, whitelistUserFields.concat(defaultWhitelist));

          let blacklistUserFields = lget(authenticationConfig, 'blacklistUserFields', []);
          _user = lomit(_user, blacklistUserFields);

          context.dispatch = Object.assign({}, context.result, { user: _user });
          return context;
        },
      ]
    },
    error: {
      create: [
        // errorHook
      ]
    }
  });
};


