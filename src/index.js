/**
 * @file main entry
 * @author ielgnaw <wuji0223@gmail.com>
 */

import 'babel-polyfill';
import Debug from 'debug';
import Chromy from 'chromy';
// import chainProxy from 'async-chain-proxy';

import {mergeDeep} from './util';

const debug = Debug('rubik');

/**
 * 获取 type 为 page 的 target，可理解为获取所访问页面的那个 tab，为了之后和这个 tab 通过 ws 通信
 *
 * @param {Array} targets all targets
 *
 * @return {Object} target info
 */
function defaultTargetFunction(targets) {
    return targets.filter(t => t.type === 'page').shift();
}

const defaultOpts = {
    host: 'localhost',
    port: 9222,
    launchBrowser: true,
    chromeFlags: [],
    chromePath: null,
    activateOnStartUp: true,
    waitTimeout: 30000,
    gotoTimeout: 30000,
    loadTimeout: 30000,
    evaluateTimeout: 30000,
    waitFunctionPollingInterval: 100,
    typeInterval: 20,
    target: defaultTargetFunction,
    // 是否使用 headless 模式
    headless: false
};

export default class Rubik {
    constructor(opts = {}) {
        // debug('send "%s" %j', 'path', {a: 1});
        this.opts = mergeDeep({}, defaultOpts, opts);
        this.opts.visible = !this.opts.headless;

        this.proxy = new Chromy(this.opts);

        this._queue = [];
    }

    /**
     * 添加自定义的设备
     * {name, width, height, deviceScaleFactor, pageScaleFactor, mobile, userAgent}
     *
     * @param {Array|Object} cusDevices 设备信息
     */
    static addCustomDevice(cusDevices = []) {
    }

    async result(fn) {
        const me = this;

        const steps = me._queue.concat();
        me._queue = [];

        const ret = [];

        try {
            await next();
        }
        catch (e) {
            throw new Error(e);
        }

        async function next() {
            const step = steps.shift();
            if (!step) {
                return await done();
            }

            ret.push({
                [step.name]: await step.fn()
            });

            return await next();
        }

        async function after() {
            return await next();
        }

        async function done() {
            // TODO: end 判断
            return fn(ret);
        }
    }

    async end() {
        await this.proxy.close();
        return this;
    }

    start(startingUrl) {
        debug(`'start' for ${startingUrl}`);
        const startTime = +new Date;
        this._queue.push({
            name: 'start',
            fn: () => this.proxy.goto(startingUrl)
        });
        return this;
    }

    getTitle() {
        debug('getTitle');
        this._queue.push({
            name: 'getTitle',
            fn: () => this.proxy.evaluate(_ => document.title)
        });
        return this;
    }

    getCurrentUrl() {
        debug('getCurrentUrl');
        this._queue.push({
            name: 'getCurrentUrl',
            fn: () => this.proxy.evaluate(_ => document.location.href)
        });
        return this;
    }

    getDOMLength() {
        debug('getDOMLength');
        this._queue.push({
            name: 'getDOMLength',
            fn: () => this.proxy.evaluate(_ => document.getElementsByTagName('*').length)
        });
        return this;
    }

    getDOMCounters() {
        debug('getDOMCounters');
        this._queue.push({
            name: 'getDOMLength',
            fn: () => {
                return this.proxy.client.Memory.getDOMCounters()
            }
        });
        return this;
    }
}
