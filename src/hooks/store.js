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
        return _value;
      },
      set(newValue) {
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
 */
export const useModal = (modalName) => {
  const [_, setState] = useState();
  const self = useMemo(() => ({
    id: null
  }), []);
  let modal = {};
  if (modalMap.has(modalName)) {
    const { store, actions } = modalMap.get(modalName);
    self.store = store;
    modal = { ...store, ...actions };
  }
  if (self.id === null) {
    self.id = index++;
    self.map = new Map();
    modalList[self.id] = setState;
  }
  return new Proxy(modal, {
    get: (target, p) => {
      if (!self.map.has(p) && Reflect.has(self.store, p)) {
        const channelName = getChannelKey(modalName, p);
        const set = watcherMap.has(channelName) ? watcherMap.get(channelName) : new Set();
        set.add(self.id);
        watcherMap.set(channelName, set);
        self.map.set(p, true);
      }
      return target[p];
    },
  });
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