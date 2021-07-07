/**
 * @description 子应用组件
 * @author wljing<wljing@aliyun.com>
 * @date 2021/06/06
 */

import React, { useEffect, useRef } from 'react';
import { useModal, setModal } from '@/hooks';
import store from './store';
import './index.scss';
import { Window } from '@/components';

setModal(store);

export default (props) => {
  const {
    appId,
    winKey,
    ...restProps
  } = props;
  const ref = useRef();
  const { setWindowMap, windowMap } = useModal('desktop');
  const { appManager } = useModal('app');
  useEffect(() => {
    windowMap[winKey] = {
      modalName: ref.current.modalName,
      ...windowMap[winKey],
    };
    setWindowMap(windowMap);
    appManager.load(appId, document.querySelector(`#${ref.current.modalName} .win-body`));
  }, []);
  const { winInfo } = windowMap[winKey];
  return (
    <Window
      ref={ref}
      winInfo={winInfo}
      {...restProps}
    />
  )
}
