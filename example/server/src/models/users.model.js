// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
const Common = require('./common/common.schemas');

module.exports = function (app) {
  const modelName = 'users';
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const schema = new Schema({

    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true },
    name: { type: String },
    phone: { type: Common.Phone },
    theme: { type: Common.Theme },
    roles: [{type: Schema.Types.ObjectId, required: false, ref: 'ir-roles-roles'}],
    addresses: [{type: Common.Address}],
    auth0Id: {type: String},
    googleId: {type: String},
    facebookId: {type: String},
    twitterId: {type: String},
    githubId: {type: String},
    socialLinks: [{type: Object, required: false}],
    avatar: {type: Common.Images},
    phones: [{type: Object, required: false}],
    wallet: { type: Schema.Types.ObjectId, ref: 'wallets', required: false },

    verifiers: [{type: Schema.Types.ObjectId, ref: 'users'}],
    isVerified: {type: Boolean, required: false},
    resetToken: {type: String, required: false},
    verifyChanges: {type: Object, required: false},
    verifyToken: {type: String, required: false},
    verifyExpires: {type: Date, required: false},
    verifyShortToken: {type: String, required: false},
    resetShortToken: {type: String, required: false},
    resetExpires: {type: Date, required: false},

    deleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
  }, {
    timestamps: true,
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);

};
