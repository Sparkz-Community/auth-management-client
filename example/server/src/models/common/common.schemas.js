// Generic mongoose model definitions to be used in other models
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const lget = require('lodash.get');

const uuid = () => {
  let dt = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

const mongoose = require('mongoose');
const {Schema} = mongoose;

const HSLA = new Schema({
  h: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  s: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  l: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
}, {_id: false});

const HSVA = new Schema({
  h: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  s: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  l: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
}, {_id: false});

const RGBA = new Schema({
  h: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  s: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  l: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  a: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
}, {_id: false});

const Color = new Schema({
  hue: {type: mongoose.Types.Decimal128, required: false, min: 0, max: 1},
  alpha: {type: mongoose.Types.Decimal128, required: false},
  hex: {type: String, required: false, match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  hexa: {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  hsla: {HSLA},
  hsva: {HSVA},
  rgba: {RGBA},
}, {_id: false});

const UniquePhone = new Schema({
  phoneType: {type: String, required: false},
  number: {
    input: {type: String, required: false},
    international: {type: String, required: false},
    national: {type: String, required: false},
    e164: {type: String, required: true, unique: true},
    rfc3966: {type: String, required: false},
    significant: {type: String, required: false},
  },
  regionCode: {type: String, required: false},
  valid: {type: Boolean, required: false},
  possible: {type: Boolean, required: false},
  possibility: {type: String, required: false},
  isValid: {type: Boolean, required: false},
  country: {
    name: {type: String, required: false},
    iso2: {type: String, required: false},
    dialCode: {type: String, required: false},
    priority: {type: Number, required: false},
    areaCodes: {type: String, required: false},
  },
  canBeInternationallyDialled: {type: Boolean, required: false},
  type: {type: String, required: false},
});

const Phone = new Schema({
  phoneType: {type: String, required: false},
  number: {
    input: {type: String, required: false},
    international: {type: String, required: false},
    national: {type: String, required: false},
    e164: {type: String, required: false},
    rfc3966: {type: String, required: false},
    significant: {type: String, required: false},
  },
  regionCode: {type: String, required: false},
  valid: {type: Boolean, required: false},
  possible: {type: Boolean, required: false},
  possibility: {type: String, required: false},
  isValid: {type: Boolean, required: false},
  country: {
    name: {type: String, required: false},
    iso2: {type: String, required: false},
    dialCode: {type: String, required: false},
    priority: {type: Number, required: false},
    areaCodes: {type: String, required: false},
  },
  canBeInternationallyDialled: {type: Boolean, required: false},
  type: {type: String, required: false},
});

// // eslint-disable-next-line no-unused-vars
// const newPhone = new Schema({
//   phoneType: {type: String, required: false},
//   number: {type: String, required: false},
//   formatted: {type: String, required: false},
//   nationalNumber: {type: String, required: false},
//   valid: {type: Boolean, required: false},
//   countryCode: {type: String, required: false},
//   countryCallingCode: {type: String, required: false},
//   country: {
//     name: {type: String, required: false},
//     iso2: {type: String, required: false},
//     dialCode: {type: String, required: false},
//     priority: {type: Number, required: false},
//     areaCodes: {type: String, required: false},
//   },
// });
//
// // eslint-disable-next-line no-unused-vars
// const PhoneNumber = new Schema({
//   phoneType: {type: String, required: false},
//   phoneNumber: {type: String, required: false},
//   nationalNumber: {type: String, required: false},
//   formatNational: {type: String, required: false},
//   formattedNumber: {type: String, required: false},
//   e164: {type: String, required: false},
//   formatInternational: {type: String, required: false},
//   uri: {type: String, required: false},
//   isValid: {type: Boolean, required: false},
//   countryCode: {type: String, required: false},
//   countryCallingCode: {type: String, required: false},
//   type: {type: String, required: false},
// });

const Images = new Schema({
  raw: {
    _id: { type: Schema.Types.ObjectId, required: false, ref: 'file-uploader' },
    file: { type: String, required: false }
  }
}, { _id: false, timestamps: false });

const Files = new Schema({
  createdAt: Date,
  file: String,
  fileId: String,
  info: {},
  name: String,
  originalName: String,
  storage: String,
  updatedAt: Date,
  uploadChannel: String,
}, {_id: false});

const Address = new Schema({
  address1: {type: String, required: true},
  city: {type: String, required: true},
  country: {type: String, required: true},
  formatted: {type: String, required: false},
  latitude: {type: Number, required: true},
  longitude: {type: Number, required: true},
  name: {type: String, required: false},
  postal: {type: String, required: true},
  region: {type: String, required: false},
  googleAddress: {type: Object, required: false},
  tags: {type: Object, required: false},
  type: {type: Object, required: false},
});

const Theme = new Schema({
  darkMode: {type: Boolean, default: false},
  '--q-color-primary': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-secondary': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-accent': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-dark': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},

  '--q-color-positive': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-negative': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-info': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
  '--q-color-warning': {type: String, required: false, match: /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/},
}, {_id: false});

const RRULE = new Schema({
  //https://icalendar.org/rrule-tool.html
  FREQ: {type: String, enum: ['YEARLY', 'WEEKLY', 'MONTHLY', 'DAILY', 'HOURLY', 'MINUTELY', null, '']},
  INTERVAL: Number,
  UNTIL: Date,
  COUNT: Number,
  BYMONTH: [{type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}], //month of an annual recurrance
  BYMINUTE: [Number],
  BYHOUR: [Number],
  BYDAY: [String], //ex [TU,TH] first & last sunday [1SU, -1SU]
  BYMONTHDAY: [{type: Number, min: 1, max: 31}],
  BYYEARDAY: [{type: Number, min: 1, max: 365}],
  BYWEEKNO: [{type: Number, min: 1, max: 52}],
  BYSTEPPOS: Number, //The third instance into the month of one of Tuesday, Wednesday, or Thursday, for the next 3 months:
  WKST: String, //day of the week to start weekly recurrance
}, {_id: false});

const Settings = new Schema({
  groups: {},
  todos: {},
  users: {},
}, {_id: false});

const commonFieldsFn = (
  {
    audited = false,
    createdBySourceIdPath = 'external.createdBySourceId',
    updatedBySourceIdPath = 'external.updatedBySourceId',
  } = {}) => {
  return new Schema({
    applicationID: {type: Schema.Types.ObjectId, ref: 'applications'},
    external: {
      type: Object,
      contains: {
        createdBySourceId: {
          type: String,
          required() {
            return audited && this.applicationID;
          },
        },
        createdBySourceModel: {
          type: String,
          required() {
            return lget(this, createdBySourceIdPath) || (audited && this.applicationID);
          },
        },
        updatedBySourceId: {
          type: String,
          required() {
            return audited && this.applicationID;
          },
        },
        updatedBySourceModel: {
          type: String,
          required() {
            return lget(this, updatedBySourceIdPath) || (audited && this.applicationID);
          },
        },
        updatedBySourceHistory: [{
          updatedBySourceId: {type: String},
          updatedBySourceModel: {type: String},
          updatedAt: {type: Date},
        }],
      },
    },

    createdBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedBy: {type: Schema.Types.ObjectId, ref: 'users'},
    updatedByHistory: [{
      updatedBy: {type: Schema.Types.ObjectId, ref: 'users'},
      updatedAt: {type: Date},
    }],
    deleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
  }, {_id: false});
};


module.exports = {
  uuid,
  Color,
  UniquePhone,
  Phone,
  Images,
  Files,
  Address,
  Theme,
  RRULE,
  Settings,
  commonFieldsFn,
};

