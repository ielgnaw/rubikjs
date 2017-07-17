/**
 * @file 通用方法
 * @author ielgnaw <wuji0223@gmail.com>
 */

/**
 * check object
 *
 * @param {*} item 待检测
 *
 * @return {boolean} 结果
 */
export function isObject(item) {
    return item
        && typeof item === 'object'
        && !Array.isArray(item)
        && Object.prototype.toString.call(item) === '[object Object]';
}

/**
 * deep merge object
 *
 * @param {Object} target 目标
 * @param {Object} ...sources 源
 *
 * @return {Object} 合并后结果
 */
export function mergeDeep(target, ...sources) {
    if (!sources.length) {
        return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {[key]: {}});
                }
                mergeDeep(target[key], source[key]);
            }
            else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}
