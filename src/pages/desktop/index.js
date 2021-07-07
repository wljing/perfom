/**
 * @description 桌面
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/12
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { setModal, useModal, useKeyDown, useKeyDownWithCtrl, useSelf, getModal } from '@/hooks';
import Menu from './components/Menu';
import Application from './components/Application';
import store from './store';
import { Window } from '@/components';
import './index.scss';

setModal(store);

export default () => {
  const { desktopImg, windowMap, menus, setWindowMap, createWin, menuWinLinkMap } = useModal('desktop');
  const initIndex = 100;
  return (
    <Window
      className="desktop-root"
      style={{
        backgroundImage: `url(${desktopImg})`,
      }}
      winKey="desktop"
      winInfo={{
        width: window.screen.width,
        height: window.screen.height,
        top: 0,
        left: 0,
        resize: false,
      }}
      anime={false}
      menuRender={() => <></>}
      onKeyUp={(e) => console.log(e, 'key')}
    >
      {/* 锁屏 */}
      {/* <Lock /> */}

      {/* 底部菜单栏 */}
      <Menu
        itemClick={(i) => {
          const { id: menuId, appId, winInfo } = menus[i];
          if (Reflect.has(menuWinLinkMap, menuId)) {
            // 窗口尚未创建
            const winKey = menuWinLinkMap[menuId];
            const modalName = windowMap[winKey].modalName;
            const modal = getModal(modalName);
            const { toggleSize, sizeState } = modal;
            if (sizeState === -1) {
              const prevIndex = windowMap[winKey].index;
              const keys = Object.keys(windowMap);
              keys.forEach(key => {
                if (key === winKey) {
                  windowMap[key].index = keys.length;
                } else {
                  if (windowMap[key].index > prevIndex) {
                    windowMap[key].index--;
                  }
                }
              })
              setWindowMap(windowMap);
            }
            // 切换窗口大小
            toggleSize();
          } else {
            // 创建窗口
            createWin({
              appId,
              winInfo,
              menuId,
            });
          }
        }}
      />

      {/* 子应用 */}
      {
        Object.keys(windowMap).map((key) => {
          const { appId, index } = windowMap[key];
          return (
            <Application
              appId={appId}
              winKey={key}
              onMouseDown={e => {
                const id = key;
                const prevIndex = windowMap[id].index;
                const keys = Object.keys(windowMap);
                keys.forEach(key => {
                  if (key === id) {
                    windowMap[key].index = keys.length;
                  } else {
                    if (windowMap[key].index > prevIndex) {
                      windowMap[key].index--;
                    }
                  }
                })
                setWindowMap(windowMap);
              }}
              style={{
                zIndex: index + initIndex,
              }}
            />
          )
        })
      }
    </Window>
  )
}