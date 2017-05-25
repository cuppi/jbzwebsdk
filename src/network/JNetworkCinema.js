/**
 * Created by cuppi on 2016/11/29.
 */
'use strict';
import NetworkManager from './JNetwork.js';
import {cinemaUrl} from '../unify/JUrlList';
import DateTool from '../tool/JToolDate';
import _ from '../unify/JDataUnify';
import SeatManager from '../util/JManagerSeat';

/**
 * 影院接口
 * @alias network/JNetworkCinema
 */
class JNetworkCinema {
  /**
   * 获取影院详情
   * @param cinemaId 影院ID
   * @returns {*}
   */
  static cinemaDetail(cinemaId) {
    return new Promise((resolve, reject) => {
      NetworkManager.POST(cinemaUrl.jbzDetail, {cinemaId}).then(data => {
        resolve(_('cinemaUrl.jbzDetail', data));
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
        resolve(_('cinemaUrl.jbzList', data));
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
        resolve(_('cinemaUrl.jbzScreeningFilmList', data));
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
        resolve(_('cinemaUrl.jbzScreeningDateList', data));
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
      date = DateTool.dateStringFromTimeInterval(date, 'yyyy-MM-dd');
      NetworkManager.POST(cinemaUrl.jbzScreeningItems, {cinemaId, filmId, date}).then(data => {
        resolve(_('cinemaUrl.jbzScreeningItems', data));
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
        resolve(_('cinemaUrl.jbzRealtimeSeat', data));
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
        resolve(SeatManager.defaultManager().smartSeatsFromSeats(type, _('cinemaUrl.jbzRealtimeSmartSeat', data)));
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

export default JNetworkCinema;
