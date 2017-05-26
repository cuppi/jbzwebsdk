'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.otherUrl = exports.tradeUrl = exports.accountUrl = exports.mineUrl = exports.filmUrl = exports.cinemaUrl = exports.cityUrl = undefined;
exports.UseConfig = UseConfig;

var _icbcUrl = require('../differentiation/icbc.url.config');

var _icbcUrl2 = _interopRequireDefault(_icbcUrl);

var _shanghaiUrl = require('../differentiation/shanghai.url.config');

var _shanghaiUrl2 = _interopRequireDefault(_shanghaiUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cityUrl = exports.cityUrl = {};
var cinemaUrl = exports.cinemaUrl = {};
var filmUrl = exports.filmUrl = {};
var mineUrl = exports.mineUrl = {};
var accountUrl = exports.accountUrl = {};
var tradeUrl = exports.tradeUrl = {};
var otherUrl = exports.otherUrl = {};

var sdkApi = {
  cityUrl: {
    jbzCities: '',
    jbzCityByCoordinate: '',
    jbzCityById: '',
    jbzDistricts: '',
    jbzHotCities: ''
  },
  cinemaUrl: {
    jbzList: '',
    jbzDetail: '',
    jbzScreeningFilmList: '',
    jbzScreeningDateList: '',
    jbzScreeningItems: '',
    jbzRealtimeSeat: ''
  },
  filmUrl: {
    jbzHotFilms: '',
    jbzHotFilmsPage: '',
    jbzHotFilmsSimple: '',
    jbzWaitFilms: '',
    jbzWaitFilmsPage: '',

    jbzFilmDetailByPartner: '',
    jbzFilmDetail: '',
    jbzFilmDate: ''

  },
  mineUrl: {},
  accountUrl: {
    jbzLogin: '',
    jbzLogout: '',
    jbzVerifycode: '',
    jbzRegister: '',
    jbzUpdatepass: ''
  },
  tradeUrl: {
    jbzLockSeat: '',
    jbzWebAtAppApplyTicket: '',

    jbzCancelOrder: '',
    jbzAppPrepay: '',
    jbzWebPrepay: ''
  },
  otherUrl: {
    jbzBanners: '',
    jbzSearch: ''
  }
};

var _inType = '';
var _VISIBLE_TYPE = ['ICBC-APP', 'SHANGHAI-APP'];

function UseConfig(inType) {
  if (_VISIBLE_TYPE.indexOf(inType) === -1) {
    console.log('ERROR: the inType value is non-existent, please look inType at config. \n the inType value is one of ( ' + _VISIBLE_TYPE.join(', ') + ' )');
    return;
  }
  _inType = inType;
  exports.cityUrl = cityUrl = _chunk('cityUrl');
  exports.cinemaUrl = cinemaUrl = _chunk('cinemaUrl');
  exports.filmUrl = filmUrl = _chunk('filmUrl');
  exports.mineUrl = mineUrl = _chunk('mineUrl');
  exports.accountUrl = accountUrl = _chunk('accountUrl');
  exports.tradeUrl = tradeUrl = _chunk('tradeUrl');
  exports.otherUrl = otherUrl = _chunk('otherUrl');
}

function _chunk(chunk) {
  var map = {};
  for (var title in sdkApi[chunk]) {
    map[title] = _(chunk, title);
  }
  return map;
}

function _(chunk, title) {
  var map = {};
  var UseUrl = null;
  if (_inType === 'ICBC-APP') {
    UseUrl = _icbcUrl2.default;
  }
  if (_inType === 'SHANGHAI-APP') {
    UseUrl = _shanghaiUrl2.default;
  }
  if (UseUrl && UseUrl.hasOwnProperty(chunk) && UseUrl[chunk].hasOwnProperty(title)) {
    return UseUrl[chunk][title];
  } else {
    console.log('Didn\'t find the method at ( ' + chunk + ',' + title + ' ), please contact the Author , cuppi');
  }
  return '';
}