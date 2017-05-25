/**
 * Created by cuppi on 2016/12/7.
 */
'use strict'
import NetworkTrade from '../network/JNetworkTrade.js';
let instance = null;

/**
 * 交易管理类
 * @alias util/TradeManager
 */
class TradeManager {
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }


  /**
   * 获取单例实例
   * @returns {TradeManager}
   */
  static defaultManager() {
    return new TradeManager();
  }

  /**
   * 获取交易商务参数（与座位无关的）
   * @param platform 平台类型
   * @param platformData 平台数据
   * @param filmId 电影Id
   * @param filmName 电影名称
   * @param cinemaId 影院Id
   * @param cinemaName 影院名称
   * @returns {*} 商务参数
   */
  static tradeParasFromPlatform(platform, platformData, filmId, filmName, cinemaId, cinemaName) {
    if (platform === 'wangpiao') {
      return {
        jbzFilmId: filmId,
        filmId: platformData.filmId,
        showId: platformData.showIndex,
        cinemaName: cinemaName,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      };
    }

    if (platform === 'spider') {
      return {
        jbzFilmId: filmId,
        filmId: platformData.filmId,
        showId: platformData.showId,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      }
    }

    if (platform === 'maizuo') {
      return {
        jbzFilmId: filmId,
        filmId: platformData.filmId,
        showId: platformData.foretellId,
        filmName: filmName,
        cinemaName: cinemaName,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      };
    }

    if (platform === 'danche') {
      return {
        jbzFilmId: filmId,
        filmId: platformData.filmId,
        showId: platformData.id,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      };
    }

    if (platform === 'maoyan' || platform === 'meituan' || platform === 'dazhong') {
      return {
        jbzFilmId: filmId,
        filmId: platformData.filmId,
        showId: platformData.showId,
        cinemaName: cinemaName,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      };
    }
    if (platform === 'baidu') {
      return {
        showId: platformData.seqid,
        platformCinemaId: platformData.cinemaId,
        cinemaId
      };
    }


  }

  /**
   * 获取锁座处理者
   * @param type 平台类型
   * @param paras 参数
   * @returns {*} 返回请求promise
   */
  lockSeatHandlerFrom(type, paras) {
    return NetworkTrade.tradeLockSeatNeedLogin(type, paras);
  }

  /**
   * 获取下订单处理者
   * @param type 平台类型
   * @param paras 参数
   * @returns {{terminate, then}|*} 返回请求promise
   */
  confirmOrderHandlerFrom(type, paras) {
    return NetworkTrade.tradeConfirmOrderNeedLogin(type, paras);
  }

  /**
   * 获取锁座时需要的座位参数
   * @param type 平台类型
   * @param seatList 座位列表（需要购买的）
   * @param mobile 手机号码
   * @param openId 身份标识符（目前跟手机号码一样）
   * @returns {*} 返回参数对象
   */
  seatInforParas(type, seatList, mobile) {
    // 网票
    if (type === 'wangpiao') {
      let seatInfos = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        seatInfos.push(seat.seatModel.SeatIndex);
        seatNumberInfos.push(seat.rowNumber + ':' + seat.colNumber);
      }
      return {
        seatIds: seatInfos.join('|'),
        count: seatInfos.length,
        seatNumberInfos: seatNumberInfos.join('|'),
        mobile,
        openId
      }
    }
    // 蜘蛛
    if (type === 'spider') {
      let seatInfos = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        seatInfos.push(seat.seatModel.rowId + ':' + seat.seatModel.columnId);
        seatNumberInfos.push(seat.rowNumber + ':' + seat.colNumber);
      }
      return {
        seatIds: seatInfos.join('|'),
        count: seatInfos.length,
        seatNumberInfos: seatNumberInfos.join('|'),
        mobile,
        openId
      }
    }
    // 卖座
    if (type === 'maizuo') {
      let seatInfos = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        seatInfos.push(seat.seatModel.rowId + ':' + seat.seatModel.columnId);
        seatNumberInfos.push(seat.rowNumber + ':' + seat.colNumber);
      }
      return {
        seatIds: seatInfos.join('|'),
        count: seatInfos.length,
        seatNumberInfos: seatNumberInfos.join('|'),
        mobile,
        openId
      }
    }
    // 单车
    if (type === 'danche') {
      let seatInfos = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        seatInfos.push(seat.seatModel.rowId + ':' + seat.seatModel.columnId);
        seatNumberInfos.push(seat.rowNumber + ':' + seat.colNumber);
      }
      return {
        seatIds: seatInfos.join('|'),
        count: seatInfos.length,
        seatNumberInfos: seatNumberInfos.join('|'),
        mobile,
        openId
      }
    }
    // 猫眼
    if (type === 'maoyan' || type === 'meituan' || type === 'dazhong') {
      let seatInfos = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        if (!seat.seatModel || true) {
          console.log(seat);
        }
        console.log(seat.seatModel);
        seatInfos.push({
          sectionId: seat.seatModel.sectionId,
          columnId: seat.seatModel.columnId,
          rowId: seat.seatModel.rowId,
          seatNo: seat.seatModel.seatNo
        });
        seatNumberInfos.push(seat.rowNumber + ':' + seat.colNumber);
      }
      return {
        seatIds: JSON.stringify({
          count: seatList.length,
          list: seatInfos
        }),
        seatNumberInfos: seatNumberInfos.join('|'),
        mobile,
        openId
      }
    }

    // 百度
    if (type === 'baidu') {
      let seatIds = [];
      let seatNumberInfos = [];
      for (let seat of seatList) {
        seatIds.push(seat.seatModel.seatNo);
        seatNumberInfos.push(seat.seatModel.rowId + ':' + seat.seatModel.columnId);
      }
      return {
        count: seatIds.length,
        //  后台设置特意反过来的
        seatIds: seatNumberInfos.join('|'),
        seatNumberInfos: seatIds.join('|'),
        mobile,
        openId
      }
    }
  }

  /**
   * 购票（执行锁座 下订单 的事务）
   * @param type 平台类型
   * @param tradeParas 商务参数（与座位无关的参数集合）
   * @param seatList 座位列表
   * @param mobile 手机号码
   * @param openId 身份标识符（同上）
   * @returns {*} 返回请求promise
   */
  buyTicket(type, tradeParas, seatList, mobile) {
    let paras = {...tradeParas, ...this.seatInforParas(type, seatList, mobile)};
    let bridgeSelf = this;
    return {
      next: function (lockSeatCallback) {
        return {
          next: function (confirmOrderCallback) {
            bridgeSelf.lockSeatHandlerFrom(type, {...paras, cinemaId: paras.platformCinemaId}).then(data => {
              lockSeatCallback(null, data);
              let orderId = data.orderId;
              let {cinemaId, jbzFilmId, filmId, showId} = paras;
              let cityId = store.getState().location.locationCity.id;
              let cityName = store.getState().location.locationCity.name;
              bridgeSelf.confirmOrderHandlerFrom(type, {
                orderId,
                cinemaId,
                jbzFilmId,
                filmId,
                showId,
                cityId,
                cityName
              }).then(data => {
                confirmOrderCallback(null, data);
              }, error => {
                confirmOrderCallback(error, null);
              });
            }, error => {
              lockSeatCallback(error, null);
            });
          }
        }
      }
    }
  }

  /**
   * 锁座
   * @param type 平台类型
   * @param tradeParas 商务参数（与座位无关的参数集合）
   * @param seatList 座位列表
   * @param mobile 手机号码
   * @returns {Promise} 返回请求promise
   */
  lockSeat(type, tradeParas, seatList, mobile) {
    let paras = {...tradeParas, ...this.seatInforParas(type, seatList, mobile)};
    return new Promise((resolve, reject) => {
      this.lockSeatHandlerFrom(type, {...paras, cinemaId: paras.platformCinemaId}).then(data => {
        let orderId = data.orderId;
        let amount = data.originalAmount;
        let {cinemaId, jbzFilmId, filmId, showId} = paras;
        // 下面两个
        let cityId = store.getState().location.locationCity.id;
        let cityName = store.getState().location.locationCity.name;
        resolve({
          orderId,
          amount,
          cinemaId,
          jbzFilmId,
          filmId,
          showId,
          cityId,
          cityName
        });
      }, error => {
        reject(error);
      });
    })
  }

  /**
   * 确认订单
   * @param type 平台类型
   * @param lockSeatResultData 锁座成功返回的数据
   * @returns {Promise}
   */
  applyOrder(type, lockSeatResultData) {
    return new Promise((resolve, reject) => {
      this.confirmOrderHandlerFrom(type, lockSeatResultData).then(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

}

export default TradeManager;
