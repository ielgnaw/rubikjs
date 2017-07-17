/**
 * @file main entry
 * @author ielgnaw <wuji0223@gmail.com>
 */

import 'babel-polyfill';
import Debug from 'debug';
import CDP from 'chrome-remote-interface';

import {mergeDeep} from './util';

const debug = Debug('rubik');

/**
 * default target
 * from chrome-remote-interface/lib/chrome.js
 *
 * @param {Array} targets targets
 *
 * @return {Object} target
 */
const defaultTarget = targets => {
    let backup;
    let target = targets.find(target => {
        if (target.webSocketDebuggerUrl) {
            backup = backup || target;
            // http://localhost:9222/json 获取到访问的页面，t.type === 'page'
            // type 可选值为 background_page，service_worker
            return target.type === 'page';
        }
        return false;
    });

    target = target || backup;

    if (target) {
        return target;
    }

    throw new Error('No inspectable targets');
};

const instances = [];
let instanceId = 0;

const defaultOpts = {
    // all flags: http://peter.sh/experiments/chromium-command-line-switches/
    chromeFlags: ['--disable-gpu'],
    chromePath: null,
    userDataDir: null,
    startUrl: null,
    launchBrowser: true,
    // verbose, info, error, silent
    logLevel: 'error',
    cdpOpts: {
        port: 9222,
        host: 'localhost',
        target: defaultTarget,
        onError: function () {}
    }
};

export default class Rubik {
    constructor(opts = {}) {
        // debug('send "%s" %j', 'path', {a: 1});
        this.opts = mergeDeep({}, defaultOpts, opts);

        this.instanceId = instanceId++;
    }

    async start(url = 'about:blank') {
        const cdpOpts = this.opts.cdpOpts;

        // CDP 是需要 launch browser 的，只是在这里可以在别处启动这个 browser 而不一定非要在程序里启动
        // 例如可以在另一个命令行运行 chrome --remote-debugging-port=9222 然后再运行 rubikjs
        if (this.opts.launchBrowser) {
        }

        await new Promise((resolve, reject) => {
            CDP(cdpOpts, async protocol => {
                console.log(protocol);
                resolve(protocol);
            }).on('error', err => {
                console.log(123);
                cdpOpts.onError(err);
                reject(err);
            });
        }).catch(e => {
            console.log(44);
            throw e;
        });
    }
}
