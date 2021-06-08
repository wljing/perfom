/**
 * @description 
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/11
 */
import { useMemo } from 'react';

// 伴随组件整个生命周期不变的对象
export const useSelf = (data = {}) => {
  return useMemo(() => (data), []);
};