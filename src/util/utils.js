import {isUndefined} from 'lodash';
import find from 'lodash/find';

function isFunction(possibleFunction) {
    return typeof possibleFunction === 'function';
}

function isDefined(value) {
    return !isUndefined(value);
}

function isInArray(value, arr) {
    return arr.indexOf(value) !== -1;
}

function contains(value, value2) {
    return value.toUpperCase().indexOf(value2.toUpperCase()) !== -1;
}

function findIdentifiables(list, toFindIds) {
    let result = list.filter((item) => {
        return !isUndefined(find(toFindIds, (toFindId) => toFindId === item.id));
    });
    return isDefined(result) ? result : [];
}

function compare(left, right) {
    if (left === right) {
        return 0;
    } else if (left > right) {
        return 1;
    } else {
        return -1;
    }
}

export {
    findIdentifiables,
    isFunction,
    isDefined,
    isInArray,
    contains,
    compare
};