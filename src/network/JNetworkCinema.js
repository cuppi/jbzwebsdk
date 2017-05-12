/**
 * Created by cuppi on 2016/11/29.
 */
'use strict';
import NetworkManager from './JNetwork.js';
import {cinemaUrl} from '../constant/JUrlList';
import ObjectTool from '../tool/JToolObject';
import DateTool from '../tool/JToolDate';
import SeatManager from '../util/JManagerSeat';

class NetworkCinemaManager {
  /**
   * 获取影院详情
   * @param cinemaId 影院ID
   * @returns {*}
   */
  static cinemaDetail(cinemaId) {
    return new Promise((resolve, reject) => {
      NetworkManager.POST(cinemaUrl.jbzDetail, {cinemaId}).then(data => {
        data.cinema.phone = data.phone;
        ObjectTool.deleteProperty(data.cinema, 'tails');
        resolve(data.cinema);
      }, error => {
        reject(error);
      });
    });
  }


  /**
   * 影院列表
   * @param location
   * @param cinemaFilter
   * @returns {Promise}
   */
  static cinemaList(location, cinemaFilter) {
    return new Promise((resolve, reject) => {
      let {filmId, feature, region, sort, limit} = cinemaFilter ? cinemaFilter : {};
      NetworkManager.POST(cinemaUrl.jbzList, {
        ...location,
        filmId,
        feature,
        regionName: region,
        orderType: sort,
        limit
      }).then(data => {
        resolve(data.cinemalist);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 影院列表
   * @param cinemaFilter 影片筛选条件
   * @returns {{terminate, then}|*}
   */
  static cinemaListNeedLocation(cinemaFilter) {
    let location = NetworkManager.locationParas();
    return NetworkCinemaManager.cinemaList(location, cinemaFilter)
  }

  /**
   * 获取指定影院排片
   * @param cinemaId 影院Id
   * @returns {{terminate, then}|*}
   */
  static cinemaScreeningFilmList(cinemaId) {
    let loginParas = NetworkManager.loginParas();
    let account = {};
    if (loginParas.hasAccount) {
      account = {openId: loginParas.openId, sessionId: loginParas.sessionId};
    }
    return new Promise((resolve, reject) => {
      return NetworkManager.POST(cinemaUrl.jbzScreeningFilmList, {
        cinemaId
      }, account).then(data => {
        resolve(data.films.map(film => {
          ObjectTool.deleteProperty(film, 'tails');
          return film;
        }));
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 获取指定影院排片日期安排
   * @param cinemaId 影院Id
   * @param filmId 影片Id
   * @returns {{terminate, then}|*}
   */
  static cinemaScreeningDateList(cinemaId, filmId) {
    return new Promise((resolve, reject) => {
      NetworkManager.POST(cinemaUrl.jbzScreeningDateList, {cinemaId, filmId}).then(data => {
        resolve(data.filmShowDates.map(date => {
          return DateTool.timeIntervalFromDate(date);
        }));
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 获取指定影院排片放映厅安排
   * @param cinemaId 影院Id
   * @param filmId 影片Id
   * @param date 日期（时间戳标示）
   * @returns {{terminate, then}|*}
   */
  static cinemaScreeningItems(cinemaId, filmId, date) {
    return new Promise((resolve, reject) => {
      date = DateTool.dateFromTimeInterval(date, 'yyyy-MM-dd');
      NetworkManager.POST(cinemaUrl.jbzScreeningItems, {cinemaId, filmId, date}).then(data => {
        resolve(data.filmShows);
      }, error => {
        reject(error);
      });
    });
  };

  /**
   * 实时座位图
   * @param type 平台类型 （必须）
   * @param paras （根据不同平台变化）
   * @returns {*}
   */
  static cinemaSeats(type, paras) {
    if (type === 'meituan' || type === 'dazhong') {
      type = 'maoyan';
    }
    return new Promise((resolve, reject) => {
      NetworkManager.POST(cinemaUrl.jbzRealtimeSeat, {type, ...paras}).then(data => {
        resolve(data.realTimeSeats);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 智能实时座位图
   * @param type 平台类型 （必须）
   * @param paras （根据不同平台变化）
   * @returns {*}
   */
  static cinemaSmartSeats(type, paras) {
    if (type === 'meituan' || type === 'dazhong') {
      type = 'maoyan';
    }
    return new Promise((resolve, reject) => {
      NetworkManager.POST(cinemaUrl.jbzRealtimeSeat, {type, ...paras}).then(data => {
        let smartSeatList = SeatManager.defaultManager().smartSeatsFromSeats(type, data.realTimeSeats);
        resolve(smartSeatList);
      }, error => {
        reject(error);
      });
    });
  }

  /**
   * 收藏影院
   * @param cinemaId 影院Id
   * @param cinemaName 影院名字
   * @returns {{terminate, then}|*}
   */
  static cinemaFavoriteCinemaNeedLogin(cinemaId, cinemaName) {
    let loginParas = NetworkManager.loginParas();
    if (!loginParas.hasAccount) {
      return NetworkManager.failedAuthorizationNetwork();
    }
    return NetworkManager.POST(cinemaUrl.jbzCollectcinema, {
      openId: loginParas.openId,
      cinemaId: cinemaId,
      cinemaName: cinemaName
    }, {
      'sessionId': loginParas.sessionId
    });
  }

  /**
   * 取消收藏影院
   * @param cinemaId 影院Id
   * @returns {{terminate, then}|*}
   */
  static cinemaCancelFavoriteCinemaNeedLogin(cinemaId) {
    let loginParas = NetworkManager.loginParas();
    if (!loginParas.hasAccount) {
      return NetworkManager.failedAuthorizationNetwork();
    }
    return NetworkManager.POST(cinemaUrl.jbzCancelcollectcinema, {
      openId: loginParas.openId,
      cinemaId: cinemaId
    }, {
      'sessionId': loginParas.sessionId
    });
  }
}

export default NetworkCinemaManager;
