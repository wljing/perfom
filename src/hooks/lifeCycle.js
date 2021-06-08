/**
 * @description 生命周期相关hook
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/11
 */

import { useEffect } from 'react';
import { useSelf } from './common';

export const useMounted = (fn) => {
  useEffect(() => {
    typeof fn === 'function' && fn();
  }, []);
};

export const useUpdated = (fn, deps = []) => {
  const self = useSelf();
  useEffect(() => {
    if (self.isMounted === undefined) {
      self.isMounted = true;
    } else {
      typeof fn === 'function' && fn();
    }
  }, deps);
};