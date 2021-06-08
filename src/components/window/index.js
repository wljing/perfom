/**
 * @description 窗口组件
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/11
 */
import React, { memo, useCallback, useState, useImperativeHandle, forwardRef, useMemo, useEffect } from 'react';
import Popup from '../popup';
import Icon from '../icon';
import './index.scss';
import { hasModal, setModal, useEventListener, useModal, useSelf } from '@/hooks';
import { unique_key } from '@/utils';
import { Animator } from '../animate';


const Menu = memo((props) => {
  const {
    windowState = 0,
    onClick = () => { },
    menuOptions = [
      {
        tip: '最小化',
        content: <Icon name="suoxiao" />,
        onClick: () => typeof onClick === 'function' && onClick('min', windowState),
      },
      {
        tip: windowState === 0 ? '最大化' : '还原',
        content: <Icon name={windowState === 1 ? 'zuidahua' : 'zuidahuaxi'} />,
        onClick: () => typeof onClick === 'function' && onClick('toggle', windowState),
      },
      {
        tip: '关闭',
        content: <Icon name="guanbi" />,
        onClick: () => typeof onClick === 'function' && onClick('close', windowState),
      },
    ],
    className = '',
    ...restProps
  } = props;

  return (
    <div
      className={`win-menu-root ${className}`}
      {...restProps}
    >
      <div
        onMouseDown={e => e.stopPropagation()}
        className="win-menu-menus"
      >
        {
          menuOptions.map(({ tip, content, ...props }) => (
            <Popup key={content} content={tip} className="win-menu-item" {...props} >
              {content}
            </Popup>
          ))
        }
      </div>
    </div>
  )
}, (prev, next) => {
  if (prev.windowState === next.windowState) {
    return true
  }
  return false;
});


// 基础窗口组件
export const Window = forwardRef((props, ref) => {
  const defaultModal = {
    width: 1200,
    height: 480,
    top: 50,
    left: window.screen.width / 2 - 1200 / 2,
    sizeState: 0,
  };

  const {
    // 菜单属性
    menuClassName = '',
    menuRender,
    menuProps,

    winKey = unique_key(),
    winInfo = {},
    className = '',
    style,

    children,

    move = true,
    onMove,

    anime = true,
    animeProps,

    ...restProps
  } = props;
  const winModalName = useMemo(() => `W_${winKey}`, []);

  const {
    title = '标题',
    src = {
      top: window.screen.height - 200,
      left: window.screen.width / 2,
    },
    max = {
      width: window.screen.width,
      height: window.screen.height,
    },
    ..._winInfo
  } = winInfo;

  const self = useSelf({
    duration: 200,
    canMove: false,
    clientX: 0,
    clientY: 0,
    init: {
      top: winInfo.top ?? defaultModal.top,
      left: winInfo.left ?? defaultModal.left,
    },
    beforeMax: null,
    last: null,
  });

  if (!hasModal(winModalName)) {
    setModal({
      name: winModalName,
      store: Object.assign({}, defaultModal, _winInfo),
      actions: {
        toggleSize: (store) => {
          if (store.sizeState === 0 || store.sizeState === 1) {
            store.sizeState = -1;
          } else {
            store.sizeState = self.beforeMin.sizeState;
          }
        },
      }
    });
  }

  const { width, height, top, left, sizeState, setWidth, setHeight, setTop, setLeft, setSizeState } = useModal(winModalName, ['top', 'left', 'width', 'height', 'sizeState']);
  if (!self.normal) {
    self.normal = {
      top,
      left,
      width,
      height,
      sizeState,
    };
  }

  useEventListener('mousemove', (e) => {
    if (self.canMove && move && self.last.sizeState !== 1) {
      self.duration = 0;
      const { clientX, clientY } = e;
      setTop(self.last.top + clientY - self.clientY);
      setLeft(self.last.left + clientX - self.clientX);
      self.clientX = clientX;
      self.clientY = clientY;
      typeof onMove === 'function' && onMove(clientX, clientY);
    }
  })
  useEventListener('mouseup', () => {
    self.canMove = false;
  });

  useImperativeHandle(ref, () => {
    return {
      x: left,
      y: top,
      setWidth,
      setHeight,
      modalName: winModalName,
    };
  }, [top, left]);

  useEffect(() => {
    setTop(self.init.top);
    setLeft(self.init.left);
  }, []);
  useMemo(() => {
    if (sizeState === 0) {
      // 正常
      if (self.last) {
        if (self.last.sizeState === -1) {
          setTop(self.beforeMin.top);
          setLeft(self.beforeMin.left);
        } else if (self.last.sizeState === 1) {
          setTop(self.beforeMax.top);
          setLeft(self.beforeMax.left);
        }
      }
      setWidth(self.normal.width);
      setHeight(self.normal.height);
    } else if (sizeState === 1) {
      // 放大
      setWidth(max.width);
      setHeight(max.height);
      setTop(0);
      setLeft(0);
      if (self.last.sizeState === 0) {
        self.beforeMax = { ...self.last };
      }
    } else {
      // 缩小
      setWidth(0);
      setHeight(0);
      setTop(src.top);
      setLeft(src.left);
      self.beforeMin = { ...self.last };
    }
  }, [sizeState]);

  self.last = {
    top,
    left,
    width,
    height,
    sizeState,
  };
  return (
    <Animator
      id={winModalName}
      className={`win-root ${className}`}
      {
      ...(
        anime ? {
          style: {
            top: src.top,
            left: src.left,
            ...style,
          },
          anime: {
            width,
            height,
            top,
            left,
            duration: self.duration,
            easing: 'linear',
            ...animeProps,
          }
        } : {
          style: {
            ...style,
            width,
            height,
            top,
            left,
          }
        }
      )
      }
      {...restProps}
    >
      {/* 窗口菜单栏 */}
      {
        typeof menuRender === 'function'
          ? menuRender(<Menu
            {...menuProps}
          />)
          : <div className={`win-menu`}
            onMouseDown={(e) => {
              const { clientX, clientY, button } = e;
              if (button === 0) {
                self.canMove = true;
                self.clientX = clientX;
                self.clientY = clientY;
              }
            }}
          >
            <span
              className="win-menu-title"
            >
              {title}
            </span>
            <Menu
              className={menuClassName}
              windowState={sizeState}
              onClick={(type, sizeState) => {
                self.duration = 200;
                if (type === 'min') {
                  setSizeState(-1);
                } else if (type === 'close') {
                  setSizeState(-1);
                } else {
                  if (sizeState === 0) {
                    setSizeState(1);
                  } else {
                    setSizeState(0);
                  }
                }
              }}
              {...menuProps}
            />
          </div>
      }
      {/* 窗口主体 */}
      <div className={`win-body`}>
        {children}
      </div>
    </Animator>
  )
});
