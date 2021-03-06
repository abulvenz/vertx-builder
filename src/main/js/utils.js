
var isFunction = (fn) => {
    return fn && typeof fn === 'function';
};
var isArray = (obj) => {
    return obj && isFunction(obj.map);
};
var isString = (obj) => {
    return obj && typeof obj === 'string';
};
var propList = obj => {
    let p = [];
    if (isString(obj))
        return p;
    for (var q in obj)
        p.push(q);
    return p;
};
var traverse = (obj, fn) => {
    propList(obj).forEach(prop => {
        fn(obj, prop);
        return !isString(obj[prop]) &&
                traverse(obj[prop], fn);
    });
};
var copy = obj => {
    let result = JSON.parse(JSON.stringify(obj));
    return result;
};
var event = (vnode, fn) => {
    return (ev) => {
        fn(vnode, ev);
    };
};
var toMap = (array, keyProp, valueProp) => {
    var result = {};
    array.map(elem => result[elem[keyProp]] = valueProp ? elem[valueProp] : elem);
    return result;
};
var safe = (fn) => {
    return fn || (() => {
    });
};

export default {
    propList: propList,
    isArray: isArray,
    isString: isString,
    isFunction: isFunction,
    traverse: traverse,
    copy: copy,
    event: event,
    toMap: toMap,
    safe: safe
};
