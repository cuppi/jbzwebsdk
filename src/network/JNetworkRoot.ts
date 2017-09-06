/**
 * Created by cuppi on 2017/9/6.
 */

let instance = null;
class JNetworkRoot{
  otherParas: Array<string|object> = [];
  otherHeaders: Array<string|object> = [];

  static useParas(...paras: Array<string|object>) {
    let instance = this.instance();
    instance.otherParas = paras;
    return instance;
  }

  static useHeaders(...headers: Array<string|object>) {
    let instance = this.instance();
    instance.otherHeaders = headers;
    return instance;
  }

  static instance(): any {
    if (!instance) {
      instance = new this();
    }
    return instance;
  }
}

export default JNetworkRoot;
