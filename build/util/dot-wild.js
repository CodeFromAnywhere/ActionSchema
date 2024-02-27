/**
 * Utilities
 *
 * NB: i replaced is-plain-object and clone-deep
 */
const clone = (item) => JSON.parse(JSON.stringify(item));
const isObj = (item) => typeof item === "object" && !Array.isArray(item);
const isArray = (val) => Array.isArray(val);
const isString = (val) => typeof val === "string";
const isInteger = (val) => Number(val) == val && Number(val) % 1 === 0; // tslint:disable-line triple-equals
const isNumeric = (val) => !isArray(val) && val - parseFloat(val) + 1 >= 0;
const isData = (data) => isObj(data) || isArray(data);
const isArrayKey = (key) => isInteger(key) && parseInt(key) >= 0;
const hasProp = (obj, key) => obj && obj.hasOwnProperty(key);
const objKeys = Object.keys;
const isEmpty = (obj) => {
    if (isArray(obj))
        return obj.length === 0;
    if (isObj(obj))
        return objKeys(obj).length === 0;
    if (isNumeric(obj))
        return parseFloat(obj) === 0;
    return !obj;
};
const regex = {
    dot: /^\./,
    prop: /[^[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
    escape: /\\(\\)?/g,
};
const each = (obj, iteratee) => {
    if (!obj)
        return;
    if (isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            if (iteratee(obj[i], i, obj) === false)
                break;
        }
    }
    else if (isObj(obj)) {
        const keys = objKeys(obj);
        for (let i = 0; i < keys.length; i++) {
            if (iteratee(obj[keys[i]], keys[i], obj) === false)
                break;
        }
    }
};
const merge = (obj, source) => {
    each(source, (value, key) => {
        if (hasProp(obj, key) && isData(obj)) {
            merge(obj[key], value);
        }
        else {
            //@ts-ignore
            obj[key] = value;
        }
    });
    return obj;
};
const splitTokens = (input) => {
    const tokens = `${input}`.split(".");
    let results = [];
    let store = [];
    tokens.forEach((token) => {
        if (/^.*\\$/.test(token)) {
            store.push(token.slice(0, token.length - 1));
        }
        else if (store.length > 0) {
            results = [...results, `${store.join(".")}.${token}`];
            store = [];
        }
        else {
            results.push(token);
        }
    });
    return results;
};
const matchToken = (key, token) => {
    if (token === "*")
        return true;
    return isInteger(token) ? key == token : key === token; // tslint:disable-line triple-equals
};
const hasToken = (path) => path.indexOf(".") > -1 || path.indexOf("[") > -1;
/**
 * Tokenize path string
 */
export const tokenize = (str) => {
    const results = [];
    splitTokens(str).forEach((token) => {
        token.replace(regex.prop, (m, n, q, s) => {
            results.push(q ? s.replace(regex.escape, "$1") : n || m);
        });
    });
    return results;
};
const defaultGetOptions = {
    iterateObject: true,
    iterateArray: true,
};
const internalGet = (data, path, value, options) => {
    const opts = {
        ...defaultGetOptions,
        ...(options || {}),
    };
    if (!path || !isString(path)) {
        return {
            exist: false,
            wildcard: false,
            values: [[value, data, []]],
        };
    }
    const key = "__get_item__";
    const tokens = tokenize(path);
    const length = tokens.length;
    const state = {
        index: 0,
        context: { [key]: [[data, data, []]] },
        wildcard: false,
    };
    tokens.forEach((token) => {
        const next = [];
        each(state.context[key], ([item, _, p]) => {
            each(item, (v, k) => {
                if (!matchToken(k, token))
                    return;
                if (token !== "*") {
                    next.push([v, item, [...p, k]]);
                }
                else {
                    if (!opts.iterateObject && isObj(item))
                        return;
                    if (!opts.iterateArray && isArray(item))
                        return;
                    state.wildcard = true;
                    next.push([v, item, [...p, k]]);
                }
            });
        });
        if (next.length > 0) {
            state.context = { [key]: next };
            state.index++;
        }
    });
    if (state.index !== length) {
        return {
            exist: false,
            wildcard: state.wildcard,
            values: [[value, null, []]],
        };
    }
    return {
        exist: true,
        wildcard: state.wildcard,
        values: state.context[key],
    };
};
export const get = (data, path, value = undefined, options) => {
    const { exist, wildcard, values } = internalGet(data, path, value, options);
    if (!exist)
        return values[0][0];
    if (wildcard)
        return values.map((v) => v[0]);
    return values[0][0] === undefined ? value : values[0][0];
};
/**
 * Setter
 */
export const set = (data, path, value) => {
    if (!path || !isString(path))
        return data;
    let _data = clone(data);
    if (!hasToken(path)) {
        _data[path] = value;
        return _data;
    }
    const tokens = tokenize(path);
    if (tokens.indexOf("*") < 0) {
        const res = _data;
        each(tokens, (token, i) => {
            if (!isObj(_data[token]) && !isArray(_data[token])) {
                if (i < tokens.length - 1 &&
                    isArrayKey(tokens[i + 1])) {
                    _data[token] = [];
                }
                else {
                    _data[token] = {};
                }
            }
            if (i === tokens.length - 1) {
                _data[token] = value;
            }
            _data = _data[token];
        });
        return res;
    }
    else {
        const token = tokens.shift();
        const nextPath = tokens.map((v) => v.replace(".", "\\.")).join(".");
        if (token === undefined)
            return _data;
        each(_data, (v, k) => {
            if (matchToken(k, token)) {
                _data[k] = nextPath ? set(v, nextPath, value) : merge(v, value);
            }
        });
    }
    return _data;
};
/**
 * Deleter
 */
const arrayRemove = (array, index) => array.slice(0, index).concat(array.slice(index + 1));
const simpleRemove = (data, path) => {
    if (isArray(data) && isArrayKey(path)) {
        data = arrayRemove(data, parseInt(path, 10));
    }
    else {
        delete data[path];
    }
    return data;
};
export const remove = (data, path) => {
    if (!path || !isString(path)) {
        return data;
    }
    let _data = clone(data);
    if (!hasToken(path) && path !== "*") {
        return simpleRemove(_data, path);
    }
    const tokens = tokenize(path);
    if (tokens.indexOf("*") < 0) {
        const result = _data;
        each(tokens, (token, i) => {
            if (i === tokens.length - 1) {
                if (isArray(_data)) {
                    _data.splice(parseInt(token, 10), 1);
                }
                else {
                    delete _data[token];
                }
                return false;
            }
            else {
                _data = _data[token];
                return isObj(_data) || isArray(_data);
            }
        });
        return result;
    }
    const first = tokens.shift();
    const later = tokens.join(".");
    const isDataArray = isArray(_data);
    let count = 0;
    if (first === undefined) {
        return _data;
    }
    each(_data, (v, k) => {
        if (!matchToken(k, first)) {
            return;
        }
        if ((!isObj(v) && !isArray(v)) || !later) {
            if (!later) {
                if (isDataArray) {
                    _data = arrayRemove(_data, parseInt(k, 10) - count);
                    count += isDataArray ? 1 : 0;
                }
                else {
                    delete _data[k];
                }
            }
            return;
        }
        _data[k] = remove(v, later);
    });
    return _data;
};
/**
 * Check value
 */
export const has = (data, path) => {
    if (!path || !isString(path))
        return false;
    const key = "__has__item";
    const tokens = tokenize(path);
    let context = { [key]: [data] };
    let result = true;
    each(tokens, (token) => {
        const next = [];
        each(context[key], (item) => {
            each(item, (v, k) => {
                if (matchToken(k, token)) {
                    next.push(v);
                }
            });
        });
        if (next.length === 0) {
            result = false;
            return false;
        }
        else {
            context = { [key]: next };
        }
        return true;
    });
    return result;
};
/**
 * Flatten values
 */
const internalFlatten = (data, currentPath = null) => {
    let results = {};
    if (isEmpty(data))
        return results;
    if (isArray(data) && data.length === 0) {
        const path = currentPath == null ? 0 : currentPath;
        results[path] = data;
        return results;
    }
    each(data, (val, key) => {
        const k = `${key}`.split(".").join("\\.");
        const p = currentPath == null ? k : `${currentPath}.${k}`;
        if (isArray(val) || isObj(val)) {
            const children = internalFlatten(val, p);
            if (objKeys(children).length > 0) {
                results = merge(results, children);
            }
        }
        else {
            results[p] = val;
        }
    });
    return results;
};
export const flatten = (data) => internalFlatten(data);
/**
 * Expand vaules
 */
export const expand = (data) => {
    let results = {};
    each(data, (value, flat) => {
        const keys = tokenize(flat).reverse();
        const key = keys.shift();
        let child = isArrayKey(key) ? [] : {};
        child[key] = value;
        each(keys, (k) => {
            if (isArrayKey(k)) {
                const newChild = [];
                newChild[k] = child;
                child = newChild;
            }
            else {
                child = { [k]: child };
            }
        });
        if (isArrayKey(keys[keys.length - 1]) && isEmpty(results)) {
            results = [];
        }
        results = merge(results, child);
    });
    return results;
};
/**
 * Executes a provided function once for each element.
 */
export const forEach = (data, path, iteratee, options) => {
    const { exist, values } = internalGet(data, path, null, options);
    if (!exist)
        return;
    each(values, ([v, c, p]) => iteratee(v, p[p.length - 1], c, p.join("."), data));
};
/**
 * Create a new element
 * with the results of calling a provided function on every element.
 */
export const map = (data, path, iteratee, options) => {
    const { exist, values } = internalGet(data, path, null, options);
    if (!exist)
        return [];
    return values.map(([v, c, p]) => iteratee(v, p[p.length - 1], c, p.join("."), data));
};
/**
 * Match key
 */
export const matchPath = (pathA, pathB) => {
    if (!isString(pathA) || !isString(pathB))
        return false;
    if (pathA === pathB)
        return true;
    const a = tokenize(pathA);
    const b = tokenize(pathB);
    return a.length !== b.length
        ? false
        : a.every((t, i) => matchToken(t, b[i]) || matchToken(b[i], t));
};
/**
 * Escape path string
 */
export const escapePath = (path) => !isString(path)
    ? ""
    : tokenize(path)
        .map((p) => p.split(".").join("\\."))
        .join("\\.");
/**
 * Build path from Tokens like array
 */
export const buildPath = (tokens) => tokens.map((token) => escapePath(`${token}`)).join(".");
/**
 * Check contains of wildcard syntax
 */
export const containWildcardToken = (path) => !isString(path) ? false : tokenize(path).indexOf("*") > -1;
//# sourceMappingURL=dot-wild.js.map