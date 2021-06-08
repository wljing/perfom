/**
 * @description 锁屏
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/18
 */

import React from 'react';
import { setModal, useModal } from '@/hooks';
import store from './store';
import './index.scss';

setModal(store);

export default () => {
  const { lock, setLock, lockImg } = useModal('lock', ['lock', 'lockImg']);
  return (
    <div
      className="lock-root"
      style={{
        backgroundImage: `url(${lockImg})`,
      }}
    >
      {/* 时间 */}
    </div>
  )
}