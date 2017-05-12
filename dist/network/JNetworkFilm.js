
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _JNetwork = require('./JNetwork.js');

var _JNetwork2 = _interopRequireDefault(_JNetwork);

var _JUrlList = require('../constant/JUrlList');

var _JToolObject = require('../tool/JToolObject');

var _JToolObject2 = _interopRequireDefault(_JToolObject);

var _JToolDate = require('../tool/JToolDate');

var _JToolDate2 = _interopRequireDefault(_JToolDate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NetworkFilmManager = function () {
  function NetworkFilmManager() {
    (0, _classCallCheck3.default)(this, NetworkFilmManager);
  }

  (0, _createClass3.default)(NetworkFilmManager, null, [{
    key: 'filmHotfilms',
    value: function filmHotfilms(page) {
      if (!page) {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzHotFilms).then(function (data) {
            resolve(data.hotFilms);
          }, function (error) {
            reject(error);
          });
        });
      } else {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzHotFilmsPage, { page: page.index, size: page.size }).then(function (data) {
            resolve(data.hotFilms);
          }, function (error) {
            reject(error);
          });
        });
      }
    }
  }, {
    key: 'filmHotfilmsSimple',
    value: function filmHotfilmsSimple() {
      return new _promise2.default(function (resolve, reject) {
        _JNetwork2.default.POST(_JUrlList.filmUrl.jbzHotFilmsSimple).then(function (data) {
          resolve(data.hotFilms.map(function (film) {
            _JToolObject2.default.deleteProperty(film, 'tails');
            return film;
          }));
        }, function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'filmWaitfilms',
    value: function filmWaitfilms(page) {
      if (!page) {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzWaitFilms).then(function (data) {
            resolve(data.filmsList);
          }, function (error) {
            reject(error);
          });
        });
      } else {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzWaitFilmsPage, { page: page.index, size: page.size }).then(function (data) {
            resolve(data.filmsList);
          }, function (error) {
            reject(error);
          });
        });
      }
    }
  }, {
    key: 'filmDetail',
    value: function filmDetail(filmId) {
      var platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (platform && platform !== 'jbz') {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzFilmDetailByPartner, { platformFilmId: filmId, platform: platform }).then(function (data) {
            _JToolObject2.default.deleteProperty(data.film, 'tails');
            resolve(data.film);
          }, function (error) {
            reject(error);
          });
        });
      } else {
        return new _promise2.default(function (resolve, reject) {
          _JNetwork2.default.POST(_JUrlList.filmUrl.jbzFilmDetail, { filmId: filmId }).then(function (data) {
            _JToolObject2.default.deleteProperty(data.film, 'tails');
            resolve(data.film);
          }, function (error) {
            reject(error);
          });
        });
      }
    }
  }, {
    key: 'filmDateList',
    value: function filmDateList(filmId, cityId) {
      return new _promise2.default(function (resolve, reject) {
        _JNetwork2.default.POST(_JUrlList.filmUrl.jbzFilmDate, { filmId: filmId, cityId: cityId }).then(function (data) {
          resolve(data.filmDate.map(function (dateString) {
            return _JToolDate2.default.timeIntervalFromDate(dateString);
          }));
        }, function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'filmDateListNeedCity',
    value: function filmDateListNeedCity(filmId) {
      console.log(_JNetwork2.default.locationParas().cityId);
      return JNetworkFilm.filmDateList(filmId, _JNetwork2.default.locationParas().cityId);
    }
  }]);
  return NetworkFilmManager;
}();

exports.default = NetworkFilmManager;