/**
 * @description 自定义store
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/09
 */

import { useState, useMemo } from 'react';

const modalMap = new Map();
let index = 0;
const modalList = [];
const watcherMap = new Map();

const getChannelKey = (modalName, key) => `${modalName}:${key}`;

/**
 * @description 设置一个modal
 * @param {object} modal
 */
export const setModal = (modal) => {
  const { name, store = {}, actions = {} } = modal;
  Object.keys(store).forEach(key => {
    let _value = store[key];
    const setFunctionName = `set${key.slice(0, 1).toUpperCase()}${key.slice(1)}`;
    if (!Reflect.has(actions, setFunctionName)) {
      // 自动添加添加set方法
      actions[setFunctionName] = (store, payload) => {
        store[key] = payload;
      };
    }
    // 监听每个modal的store
    Reflect.defineProperty(store, key, {
      get() {
        // console.log('get', getChannelKey(name, key), _value);
        return _value;
      },
      set(newValue) {
        // console.log('set', getChannelKey(name, key), newValue);
        _value = newValue;
        const channelKey = getChannelKey(name, key);
        if (watcherMap.has(channelKey)) {
          const set = watcherMap.get(channelKey);
          set.forEach(v => {
            modalList[v]({});
          });
        }
        return true;
      }
    })
  });
  Object.keys(actions).forEach(key => {
    const fn = actions[key];
    actions[key] = (payload) => {
      // modalMap.get(name)
      return fn(store, payload, modalMap.get(name));
    }
  })
  modalMap.set(name, {
    name,
    store,
    actions,
  });
};

/**
 * @description 使用一个modal
 * @param {string} modalName modal名称
 * @param {array} deps 响应key的数组
 * @returns 
 */
export const useModal = (modalName, deps = null) => {
  const [_, setState] = useState();
  const self = useMemo(() => ({
    id: null
  }), []);
  let modal = {};
  if (modalMap.has(modalName)) {
    modal = modalMap.get(modalName);
    modal = { ...modal.store, ...modal.actions };
  }
  if (self.id === null) {
    self.id = index++;
    modalList[self.id] = setState;
  }
  useMemo(() => {
    if (Array.isArray(deps)) {
      const id = self.id;
      deps.forEach(key => {
        const channelName = getChannelKey(modalName, key);
        const set = watcherMap.has(channelName) ? watcherMap.get(channelName) : new Set();
        set.add(id);
        watcherMap.set(channelName, set);
      });
    }
  }, deps);

  return modal;
};

export const delModal = (modalName) => {
  if (hasModal(modalName)) {
    modalMap.delete(modalName);
  }
};

export const hasModal = (modalName) => modalMap.has(modalName);

export const getModal = (modalName) => {
  if (hasModal(modalName)) {
    const { actions, store, } = modalMap.get(modalName);
    return {
      ...actions,
      ...store,
    }
  } else {
    return false;
  }
}