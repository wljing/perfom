/**
 * @description 本地存储抽象
 * @author wljing<wljing@aliyun.com>
 * @date 2021/06/03
 */

const get = (key, parse = true, isKeep = true) => {
  const store = isKeep ? localStorage : sessionStorage;
  const value = store.getItem(key);
  return parse ? JSON.parse(value) : value;
};

const set = (key, value, stringify = true, isKeep = true) => {
  const store = isKeep ? localStorage : sessionStorage;
  const value = stringify ? JSON.stringify(value) : value;
  store.setItem(key, value);
};

export const localGet = (key, parse = true) => get(key, parse, true);
export const localSet = (key, value, parse = true) => set(key, value, parse, true);


export const sessionGet = (key, parse = true) => get(key, parse, false);
export const sessionSet = (key, value, parse = true) => set(key, value, parse, false);
