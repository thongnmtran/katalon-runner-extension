/* eslint-disable default-param-last */
/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */


class ArrayUtils {
  static JsonComparator = (itemA, itemB) => (
    itemA === itemB || JSON.stringify(itemA) === JSON.stringify(itemB)
  );

  static map(array = [], func = (item) => {}) {
    const isArray = Array.isArray(array);
    if (!isArray) {
      array = [array];
    }
    const result = array.map(func);
    return isArray ? result : result[0];
  }

  static mapSingleField(array = [], field = '') {
    return [...new Set(array.map((itemI) => itemI[field]).flat().filter(this.nullFilter))];
  }

  static async forEach(array = [], func = async (item, index) => undefined) {
    if (!Array.isArray(array) || !func) {
      return [];
    }
    const results = [];
    for (let i = 0; i < array.length; i++) {
      const resultI = await func(array[i], i);
      results.push(resultI);
    }
    return results;
  }

  static async every(array = [], func = async (item, index) => undefined) {
    if (!Array.isArray(array) || !func) {
      return true;
    }
    for (let i = 0; i < array.length; i++) {
      if (!await func(array[i], i)) {
        return false;
      }
    }
    return true;
  }

  static subtract(sourceArray = [], destArray = [], key) {
    return this.filter(sourceArray, (itemI) => !this.find(destArray, itemI, key));
  }

  static filter(array = [], func = (item) => {}) {
    const isArray = Array.isArray(array);
    if (!isArray) {
      array = [array];
    }
    const result = array.filter(func);
    return isArray ? result : result[0];
  }

  static equal(arrayA = [], arrayB = [], key, deepCompare) {
    if (arrayA === arrayB) {
      return true;
    }
    return arrayA.length === arrayB.length && arrayA.every(
      (itemA) => arrayB.some(
        (itemB) => this._compareItem(itemA, itemB, key, deepCompare)
      )
    );
  }

  static _compareItem(A, B, key, deepCompare = false) {
    const deepComparator = (a, b) => (deepCompare && JSON.stringify(a) === JSON.stringify(b));
    if (!key) {
      return A === B || deepComparator(A, B);
    }
    let comparator;
    if (typeof key === 'function') {
      comparator = key.length > 1
        ? (a, b) => key(a, b) || deepComparator?.(a?.[key], b?.[key])
        : (a, b) => key(a) === key(b) || deepComparator?.(key(a), key(b));
    } else {
      comparator = (a, b) => a?.[key] === b?.[key] || deepComparator?.(a?.[key], b?.[key]);
    }
    return comparator(A, B);
  }

  static equalOrdered(arrayA = [], arrayB = [], key) {
    if (arrayA === arrayB) {
      return true;
    }
    return arrayA.length === arrayB.length && arrayA.every(
      (itemA, index) => this._compareItem(itemA, arrayB[index], key)
    );
  }

  static includes(array = [], clue, key) {
    return !!this.find(array, clue, key);
  }

  static findIndex(array = [], clue, key, deepCompare) {
    return array.findIndex((itemI) => this._compareItem(itemI, clue, key, deepCompare));
  }

  static find(array = [], clue, key, deepCompare = false) {
    if (!clue || !Array.isArray(array)) {
      return null;
    }
    if (!key && clue && typeof clue === 'object' && Object.keys(clue).length === 1) {
      [key] = Object.keys(clue);
    }
    return array.find((itemI) => this._compareItem(itemI, clue, key, deepCompare));
  }

  static findByProp(array = [], value, key) {
    return this.find(array, { [key]: value }, key);
  }

  static addItem(array = [], item, key) {
    const finder = key
      ? (itemI) => itemI[key] === item[key]
      : (itemI) => itemI === item;
    const existedItemIndex = array.findIndex(finder);
    if (existedItemIndex < 0) {
      return array.slice().concat(item);
    }
    return [...array];
  }

  static insert(array = [], index = -1, ...items) {
    if (index < 0) {
      array.push(...items);
    } else {
      array.splice(index, 0, ...items);
    }
    return array;
  }

  static removeWhere(array = [], filter) {
    const items = array.filter(filter);
    return this.removez(array, items);
  }

  static removez(array = [], items = [], key) {
    let index = -1;
    items.forEach((itemI) => {
      do {
        index = this.findIndex(array, itemI, key);
        if (index >= 0) {
          array.splice(index, 1);
        }
      } while (index >= 0);
    });
    return array;
  }

  static remove(array = [], ...items) {
    return array.filter((item) => !items.includes(item));
  }

  static removeItem(array = [], item, key, removeOnSourceArray = false) {
    if (typeof item === 'object' && Object.keys(item).length === 1) {
      [key] = Object.keys(item);
    }
    const finder = key
      ? (itemI) => itemI[key] === item[key]
      : (itemI) => itemI === item;
    const existedItemIndex = array.findIndex(finder);
    if (existedItemIndex < 0) {
      return [...array];
    }
    const newArray = removeOnSourceArray ? array : array.slice();
    newArray.splice(existedItemIndex, 1);
    return newArray;
  }

  static removeItemI(array = [], ...indexes) {
    const clone = [...array];
    indexes.forEach((index) => {
      if (index >= 0) {
        clone.splice(index, 1);
      }
    });
    return clone;
  }

  static toggleItem(array = [], item, key, state) {
    const finder = key
      ? (itemI) => itemI[key] === item[key]
      : (itemI) => itemI === item;

    const newArray = array.slice();

    const existedItemIndex = array.findIndex(finder);

    if (existedItemIndex < 0) {
      if (state === false) {
        return newArray;
      }
      return newArray.concat(item);
    }

    if (state) {
      return newArray;
    }
    newArray.splice(existedItemIndex, 1);
    return newArray;
  }

  static keepFirst(object, arrayField, numItems) {
    if (numItems == null) {
      return false; // No effect
    }
    const array = object[arrayField] || [];
    object[arrayField] = array.slice(0, numItems);
    return true;
  }

  static keepLast(object, arrayField, numItems) {
    if (numItems == null) {
      return false; // No effect
    }
    const array = object[arrayField] || [];
    object[arrayField] = array.slice(-numItems);
    return true;
  }

  static push(object, arrayField, item, key) {
    const array = object[arrayField] || [];
    object[arrayField] = array;
    if (!this.includes(array, item, key)) {
      array.push(item);
      return true;
    }
    return false;
  }

  static unshift(object, arrayField, item, key) {
    const array = object[arrayField] || [];
    object[arrayField] = array;
    if (!this.includes(array, item, key)) {
      array.unshift(item);
      return true;
    }
    return false;
  }

  static isEmpty(array) {
    return !Array.isArray(array) || array.length <= 0;
  }

  static isNotEmpty(array) {
    return array && array.length > 0;
  }

  static isLastItem(array = [], item) {
    return array[array.length - 1] === item;
  }

  static array(number) {
    return [...new Array(number)].map((value, index) => index);
  }

  static weekdays() {
    return [...new Array(7)].map((value, index) => (index + 1) % 7);
  }

  static batch(array, size) {
    // eslint-disable-next-line prefer-spread
    return [].concat.apply(
      [],
      array.map(
        (elem, i) => (i % size ? [] : [array.slice(i, i + size)])
      )
    );
  }

  static chunkify(array, n, balanced = false) {
    if (n < 2) { return [array]; }

    const len = array.length;
    const out = [];
    let i = 0;
    let size;

    if (len % n === 0) {
      size = Math.floor(len / n);
      while (i < len) {
        out.push(array.slice(i, i += size));
      }
    } else if (balanced) {
      while (i < len) {
        size = Math.ceil((len - i) / n--);
        out.push(array.slice(i, i += size));
      }
    } else {
      n--;
      size = Math.floor(len / n);
      if (len % size === 0) { size--; }
      while (i < size * n) {
        out.push(array.slice(i, i += size));
      }
      out.push(array.slice(size * n));
    }

    return out;
  }

  static filterDuplicate(array = [], key, deepCompare) {
    return array.filter(
      (itemI, index) => array.findIndex(
        (itemJ) => this._compareItem(itemI, itemJ, key, deepCompare)
      ) === index
    );
  }

  static filterDictinct(newArray, oldArray, key) {
    return newArray.filter(
      (newItem) => oldArray.every((oldItem) => oldItem[key] !== newItem[key])
    );
  }

  static sort(array = [], ...criteria) {
    criteria = criteria.flat();
    criteria = criteria.map((criterion) => ({
      direction: criterion.startsWith('-') ? -1 : 1,
      prop: criterion.startsWith('-') ? criterion.slice(1) : criterion
    }));
    return array.sort((a, b) => {
      let diff = 0;
      criteria.some((criterion) => {
        const aVal = a[criterion.prop] != null ? a[criterion.prop] : 0;
        const bVal = b[criterion.prop] != null ? b[criterion.prop] : 0;
        if (typeof aVal === 'string' || typeof bVal === 'string') {
          diff = (aVal || '').toString().localeCompare(bVal);
        } else {
          diff = aVal - bVal;
        }
        diff *= criterion.direction;
        return diff !== 0;
      });
      return diff;
    });
  }

  static merge(
    newArray = [],
    oldArray = [],
    comparator = (oldItem, newItem) => oldItem === newItem
  ) {
    const allItems = [...(oldArray || [])];
    (newArray || []).forEach((newItemI) => {
      const existedItem = oldArray.find((oldItemI) => comparator(newItemI, oldItemI));
      if (existedItem) {
        if (typeof existedItem === 'object') {
          Object.assign(existedItem, newItemI);
        }
      } else {
        allItems.push(newItemI);
      }
    });
    return allItems.filter(
      (itemI, indexI) => allItems.findIndex((itemJ) => comparator(itemI, itemJ)) === indexI
    );
  }

  static nullFilter = (itemI) => itemI;

  static filterNull = (array = []) => array.filter(this.nullFilter);

  static thenFilterNull = (filter = this.nullFilter) => (array = []) => array.filter(filter);
}

module.exports = ArrayUtils;
