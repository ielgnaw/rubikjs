/**
 * @file main entry
 * @author ielgnaw <wuji0223@gmail.com>
 */

import 'babel-polyfill';
import Debug from 'debug';
import Chromy from 'chromy';
import chalk from 'chalk';

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
    headless: true
};

export default class Rubik {
    constructor(opts = {}) {
        // debug('send "%s" %j', 'path', {a: 1});
        this.opts = mergeDeep({}, defaultOpts, opts);
        this.opts.visible = !this.opts.headless;

        this.proxy = new Chromy(this.opts);

        this.currentUrl = '';
        this.isStarting = false;
    }

    /**
     * 添加自定义的设备
     * {name, width, height, deviceScaleFactor, pageScaleFactor, mobile, userAgent}
     *
     * @param {Array|Object} cusDevices 设备信息
     */
    static addCustomDevice(cusDevices = []) {
    }

    /**
     * 打开页面
     *
     * @param {string} startingUrl 页面地址
     *
     * @return {Promise} 是否打开成功的结果
     */
    async start(startingUrl) {
        debug(`'start' for ${startingUrl}`);
        let ret = true;
        try {
            await this.proxy.goto(startingUrl);
            this.currentUrl = startingUrl;
            this.isStarting = true;
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }
        return ret;
    }

    /**
     * 获取当前页面的 url
     *
     * @return {Promise} Promise 结果
     */
    async getCurrentUrl() {
        if (!this.isStarting) {
            console.log(`${chalk.red('Please execute `start` method first.')}`);
            return;
        }
        debug(`'getCurrentUrl' for ${this.currentUrl}`);
        let ret = null;
        try {
            ret = await this.proxy.evaluate(_ => document.location.href);
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }
        return ret;
    }

    /**
     * 获取当前页面的 title
     *
     * @return {Promise} Promise 结果
     */
    async getTitle() {
        if (!this.isStarting) {
            console.log(`${chalk.red('Please execute `start` method first.')}`);
            return;
        }
        debug(`'getTitle' for ${this.currentUrl}`);
        let ret = null;
        try {
            ret = await this.proxy.evaluate(_ => document.title);
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }

        return ret;
    }

    /**
     * 点击页面元素
     *
     * @param {string} selector 页面元素选择器
     * @param {boolean} waitPageLoad 是否等待页面加载完成，例如点击了一个跳转链接
     *
     * @return {Promise} Promise 结果
     */
    async click(selector, waitPageLoad = false) {
        if (!this.isStarting) {
            console.log(`${chalk.red('Please execute `start` method first.')}`);
            return;
        }
        debug(`'click' in ${this.currentUrl} for ${selector}`);
        let ret = null;
        try {
            ret = await this.proxy.click(selector, {waitLoadEvent: waitPageLoad});
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }

        return ret;
    }

    /**
     * 在页面中执行函数
     *
     * @param {Function} fn 函数，注意这里的函数是在 window 的作用域下
     *
     * @return {Promise} Promise 结果
     */
    async executeScript(fn) {
        if (!this.isStarting) {
            console.log(`${chalk.red('Please execute `start` method first.')}`);
            return;
        }
        debug(`'executeScript' in ${this.currentUrl}`);

        let ret = null;
        try {
            ret = await this.proxy.evaluate(fn);
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }

        return ret;
    }

    /**
     * 向页面中注入一段脚本
     *
     * @param {string} scriptContent 注入的脚本内容
     *
     * @return {Promise} Promise 结果
     */
    async addScript(scriptContent) {
        if (!this.isStarting) {
            console.log(`${chalk.red('Please execute `start` method first.')}`);
            return;
        }
        debug(`'addScript' in ${this.currentUrl}`);

        let ret = null;
        try {
            ret = await this.proxy.evaluate(scriptContent);
        }
        // 异常默认的处理是抛出，停止后续逻辑
        catch (e) {
            if (this.opts.onError && typeof this.opts.onError === 'function') {
                this.opts.onError(e);
                return false;
            }
            console.log(`${chalk.red(e.stack ? e.stack : e)}`);
            throw new Error(e);
        }

        return ret;
    }
}
