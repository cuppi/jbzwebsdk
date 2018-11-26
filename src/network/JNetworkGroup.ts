import JRequester from "./JRequester";
import CancelPromiseFactory, {JPromise} from "../factory/CancelPromiseFactory";
import {AxiosResponse} from "axios";
import {jgetGlobalValue} from './JNetworkFunc';
import JNetworkDelegate from "../delegate/JNetworkDelegate";
import JNetworkError from './JNetworkError';
import JRequestEngine from '../util/JRequestEngine';
let GROUP_COUNT = 0

/**
 * @private
 */
export default class JNetworkGroup {
    readonly baseUrl: string;
    readonly carryData: object;
    readonly timeout: number;
    readonly delegate: JNetworkDelegate;
    readonly groupId: number;
    readonly isSync: boolean;

    private readonly freezeParas:Array<string|object>;
    private readonly freezeHeaders:Array<string|object>;
    private readonly requestEngine:JRequestEngine = new JRequestEngine();
    otherParas: Array<string|object> = [];
    otherHeaders: Array<string|object> = [];

    useParas(...paras: Array<string|object>): JNetworkGroup {
        this.otherParas = paras;
        return this;
    }

    useHeaders(...headers: Array<string|object>): JNetworkGroup {
        this.otherHeaders = headers;
        return this;
    }

    constructor(baseUrl: string, carryData: object, timeout: number, delegate: JNetworkDelegate, options?:any){
        this.baseUrl = baseUrl;
        this.carryData = carryData;
        this.timeout = timeout;
        this.delegate = delegate;
        this.groupId = ++GROUP_COUNT;
        if (options){
            this.freezeParas = options.freezeParas || {};
            this.freezeHeaders = options.freezeHeaders || {};
            this.isSync = options.isSync;
        }
    }

    /**
     * 发送请求
     * @param method 方法类型
     * @param baseUrl 基地址
     * @param url 相对地址
     * @param parameters 参数
     * @param headers 头参数
     * @param otherObject 其他相关设置
     * @returns {CancelPromiseFactory<any>}
     */
    fetchRequest(method: string, baseUrl: string, url: string, parameters: object, headers: object, otherObject: any): JPromise<AxiosResponse|JNetworkError> {
        let otherParas = [...this.freezeParas, ...this.otherParas];
        let otherHeaders = [...this.freezeHeaders, ...this.otherHeaders];
        this.otherParas = [];
        this.otherHeaders = [];
        const delegate = this.delegate;
        headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }, headers);

        let globalOtherParas = {};
        otherParas.forEach(key => {
            if (typeof key == "object"){
                globalOtherParas = {...globalOtherParas, ...key};
                return;
            }
            if (!delegate) return;
            globalOtherParas = {...jgetGlobalValue(key, delegate.globalParas)}
        });
        let globalOtherHeaders = {};
        otherHeaders.forEach(key => {
            if (typeof key == "object"){
                globalOtherHeaders = {...globalOtherHeaders, ...key};
                return;
            }
            if (!delegate) return;
            globalOtherHeaders = {...jgetGlobalValue(key, delegate.globalHeaders)}
        });
        let request: JRequester = JRequester.create(
            method,
            baseUrl,
            url,
            {...parameters, ...globalOtherParas},
            {...headers, ...globalOtherHeaders},
            {timeout: this.timeout, ...otherObject},
            delegate
        );
        if (this.isSync){
            return this.requestEngine.addRequest(request);
        } else {
            return CancelPromiseFactory.createJPromise((resolve, reject) => {
                request.request().then((response: AxiosResponse) => {
                    if (response.status === 200) {
                        resolve(response);
                    } else {
                        reject(new JNetworkError(response.statusText, response.status));
                    }
                }).catch(error => {
                    reject(error);
                });
            })
        }
    }

    freedomPOST(baseUrl: string, url?: string, parameters?: object, headers?: object, otherObject?: object): JPromise<AxiosResponse|JNetworkError> {
        return this.fetchRequest('post', baseUrl, url || '', parameters || {}, headers || {}, otherObject || {});
    }

    freedomGET(baseUrl: string, url?: string, parameters?: object, headers?: object, otherObject?: object): JPromise<AxiosResponse|JNetworkError> {
        return this.fetchRequest('get', baseUrl, url || '', parameters || {}, headers || {}, otherObject || {});
    }

    POST(url: string, parameters?: object, headers?: object, otherObject?: object): JPromise<AxiosResponse|JNetworkError> {
        return this.freedomPOST(this.baseUrl, url, {
            ...this.carryData,
            ...parameters
        }, headers, {timeout: this.timeout, ...otherObject})
    }

    GET(url: string, parameters?: object, headers?: object, otherObject?: object): JPromise<AxiosResponse|JNetworkError> {
        return this.freedomGET(this.baseUrl, url, {
            ...this.carryData,
            ...parameters
        }, headers, {timeout: this.timeout, ...otherObject})
    }
}