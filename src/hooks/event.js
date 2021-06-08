/**
 * @description dom事件相关hook
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/11
 */

import { useEffect } from "react";

export const useEventListener = (eventName, callback, options, deps = []) => {
  useEffect(() => {
    window.addEventListener(eventName, callback, options);
    return () => {
      window.removeEventListener(eventName, callback, options);
    };
  }, [eventName, options, ...deps]);
};


// 获取常用字符的键盘码
const getKeyCode = (char) => {
  return typeof char === 'string' && /[a-zA-Z0-9]{1}/.test(char) ? char.charCodeAt(char) : char;
};

export const useKeyDown = (keyCode, callback, options) => {
  keyCode = getKeyCode(keyCode);
  useEventListener('keydown', (e) => {
    if (e.keyCode === keyCode) {
      return callback(e);
    }
  }, options);
};

const useKeyDownWith = key => (keyCode, callback, options) => {
  useKeyDown(keyCode, e => {
    if (e[`${key}Key`]) {
      return callback(e);
    }
  }, options)
}

export const useKeyDownWithCtrl = useKeyDownWith('ctrl');
export const useKeyDownWithAlt = useKeyDownWith('alt');
export const useKeyDownWithShift = useKeyDownWith('shift');



