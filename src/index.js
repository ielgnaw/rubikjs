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

async function sleep(fn, timestamp, ...args) {
    await new Promise(resolve => setTimeout(resolve, timestamp));
    return fn(...args);
    // return await new Promise(resolve => setTimeout(resolve, timestamp));
}

// sleep(function () {
//     console.log(arguments, 'done');
// }, 100, {a: 1})

class Test {
    constructor(promise) {
        this.$promise = promise || Promise.resolve();
        this._queue = [];
    }

    async then(fn) {
        // const s = await this._queue[0]();
        // console.log(s);

        // return Promise.all([this._queue[0](), this._queue[1](), this._queue[2]()]).then(function (resolve, reject) {
        //     console.log(22, arguments);
        // });

        const steps = this._queue.concat();
        const me = this;

        async function next(ret = {}) {
            const item = steps.shift();
            if (!item) {
                return await done(ret);
            }
            const s = await item();
            return await after(s);
        }

        async function after(ret) {
            return await next(ret);
        }

        async function done(ret) {
            return fn.apply(me, [ret]);
        }

        next();
    }

    catch(reject) {
        return this.then(reject);
    }

    thing1(fn) {
        const startTime = +new Date;
        this._queue.push(() => sleep(function () {
            const endTime = +new Date;
            console.log(arguments, 'thing1', endTime - startTime);
            return endTime - startTime;
        }, 5000, {a: 1}));
        return this;
        // return this.then(() => sleep(function () {
        //     const endTime = +new Date;
        //     console.log(arguments, 'thing1', endTime - startTime);
        // }, 5000, {a: 1}));
    }

    thing2(fn) {
        const startTime = +new Date;
        this._queue.push(() => sleep(function () {
            const endTime = +new Date;
            console.log(arguments, 'thing2', endTime - startTime);
            return endTime - startTime;
        }, 2000, {a: 2}));
        return this;
        // return this.then(() => sleep(function () {
        //     const endTime = +new Date;
        //     console.log(arguments, 'thing2', endTime - startTime);
        // }, 2000, {a: 2}));
    }

    thing3(fn) {
        const startTime = +new Date;
        this._queue.push(() => sleep(function () {
            const endTime = +new Date;
            console.log(arguments, 'thing3', endTime - startTime);
            return endTime - startTime;
        }, 3000, {a: 3}));
        return this;
        // return this.then(() => sleep(function () {
        //     const endTime = +new Date;
        //     console.log(arguments, 'thing3', endTime - startTime);
        // }, 3000, {a: 3}));
    }
}

new Test(Promise.resolve())
    .thing1(function (_id) {
        console.log(11111, arguments);
    })
    .thing2(function (_id) {
        console.log(22222, arguments);
    })
    .thing3(function (_id) {
        console.log(33333, arguments);
    })
    // .then(function () {
    //     console.log(111, arguments);
    // })
    .catch(error => console.error(error));


export default class Rubik {
    constructor(opts = {}) {
        // debug('send "%s" %j', 'path', {a: 1});
        this.opts = mergeDeep({}, defaultOpts, opts);
        this.opts.visible = !this.opts.headless;

        this.client = new Chromy(this.opts);

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

    addQueue(fn) {
        this._queue.push(fn);
    }

    result(fulfill, reject) {
        return new Promise((success, failure) => {
            this.run((err, result) => {
                if (err) {
                    failure(err);
                }
                else {
                    success(result);
                }
            })
        }).then(fulfill, reject);
    }

    run(fn) {
        debug('running');
    }

    // start(startingUrl, headers) {
    //     debug(`queueing action 'start' for ${startingUrl}` );
    //     headers = headers || {};
    //     for (var key in this._headers) {
    //         headers[key] = headers[key] || this._headers[key];
    //     }

    //     this.addQueue(() => {
    //         this.client.start(startingUrl);
    //         // self.child.call('goto', url, headers, this.options.gotoTimeout, fn);
    //     });

    //     return this;
    // }

    // getTitle() {
    //     this.addQueue(async () => {
    //         console.log(123123);
    //         await this.client.evaluate(_ => {
    //             console.log(9999);
    //             return document.title;
    //         })
    //     });
    //     return this;
    // }

    // async start(startingUrl = 'about:blank', callback = null) {
    //     const ret = await this.client.start(startingUrl);
    //     if (callback && typeof callback === 'function') {
    //         (async () => {
    //             callback.call(this, ret);
    //         })();
    //     }
    //     return this;
    // }

    // async getTitle(callback = null) {
    //     const ret = await this.client.evaluate(_ => {
    //         return document.title;
    //     });
    //     if (callback && typeof callback === 'function') {
    //         (async () => {
    //             callback.call(this, ret);
    //         })();
    //     }
    //     return ret;
    // }
}
