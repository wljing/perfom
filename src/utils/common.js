let uniqueKeyIndex = 0;

export const unique_key = () => (+`${new Date().getTime()}${uniqueKeyIndex++}`).toString(16);

// 节流
export const throttle = function (fn, time) {
  let timeout = null
  return function (...args) {
    let context = this;
    const e = args[0];
    typeof e === 'object' && typeof e.persist === 'function' && e.persist();
    if (timeout === null) {
      timeout = setTimeout(() => {
        fn.apply(context, args)
        timeout = null;
      }, time)
    }
  }
};

// 防抖
export const debounce = function (fn, time) {
  let timeout = null;
  return function (...args) {
    let context = this;
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => {
      fn.apply(context, args)
      timeout = null;
    }, time)
  }
};

export const now = () => new Date().getTime();