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

// 窗口状态常量
export const SIZE_STATE_NORMAL = 0;
export const SIZE_STATE_MAX = 1;
export const SIZE_STATE_MIN = 2;
export const SIZE_STATE_DESTORY = -1;

// 菜单组件
const Menu = memo((props) => {
  const {
    sizeState = SIZE_STATE_NORMAL,
    onClick = () => { },
    menuOptions = [
      {
        tip: '最小化',
        content: <Icon name="suoxiao" />,
        onClick: () => typeof onClick === 'function' && onClick('min', sizeState),
      },
      {
        tip: sizeState === SIZE_STATE_NORMAL ? '最大化' : '还原',
        content: <Icon name={sizeState === SIZE_STATE_MAX ? 'zuidahua' : 'zuidahuaxi'} />,
        onClick: () => typeof onClick === 'function' && onClick('toggle', sizeState),
      },
      {
        tip: '关闭',
        content: <Icon name="guanbi" />,
        onClick: () => typeof onClick === 'function' && onClick('close', sizeState),
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
  if (prev.sizeState === next.sizeState) {
    return true
  }
  return false;
});

// 缩放控件
const ResizeWidget = (props) => {
  const {
    style: _style = {},
    onMove,
    ...restProps
  } = props;
  const [style, setStyle] = useState(_style);
  const self = useSelf({
    canMove: false,
    clientX: 0,
    clientY: 0,
    initStyle: null,
  });
  if (!self.initStyle) {
    self.initStyle = style;
  }
  useEventListener('mousemove', (e) => {
    if (self.canMove) {
      const { clientX, clientY } = e;
      const diffX = clientX - self.clientX;
      const diffY = clientY - self.clientY;
      self.clientX = clientX;
      self.clientY = clientY;
      typeof onMove === 'function' && onMove(diffX, diffY);
      setStyle(prev => {
        const newStyle = {...prev};
        if (Reflect.has(newStyle, 'top')) {
          newStyle.top += diffY;
        }
        if (Reflect.has(newStyle, 'left')) {
          newStyle.left += diffX;
        }
        if (Reflect.has(newStyle, 'right')) {
          newStyle.right += diffX;
        }
        if (Reflect.has(newStyle, 'bottom')) {
          newStyle.bottom += diffY;
        }
        return newStyle;
      })
    }
  });
  useEventListener('mouseup', (e) => {
    self.canMove = false;
  })
  return (
    <div
      style={style}
      onMouseDown={e => {
        e.preventDefault();
        const { button, clientX, clientY } = e;
        if (button === 0) {
          self.canMove = true;
          self.clientX = clientX;
          self.clientY = clientY;
        }
      }}
      {...restProps}
    />
  )
};

// 基础窗口组件
export const Window = forwardRef((props, ref) => {
  // 默认窗口参数
  const defaultModal = {
    width: 1200,
    height: 480,
    top: 50,
    left: window.screen.width / 2 - 1200 / 2,
    sizeState: SIZE_STATE_NORMAL,
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

  // 窗口的modalName
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
    resize = true,
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
          if (store.sizeState === SIZE_STATE_NORMAL || store.sizeState === SIZE_STATE_MAX) {
            store.sizeState = SIZE_STATE_DESTORY;
          } else {
            store.sizeState = self.beforeMin.sizeState;
          }
        },
      }
    });
  }

  const { width, height, top, left, sizeState, setWidth, setHeight, setTop, setLeft, setSizeState } = useModal(winModalName);
  if (!self.normal) {
    // 缓存窗口正常状态
    self.normal = {
      top,
      left,
      width,
      height,
      sizeState,
    };
  }

  useEventListener('mousemove', (e) => {
    if (self.canMove && move && self.last.sizeState !== SIZE_STATE_MAX) {
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

  // 首次设置窗口位置
  useEffect(() => {
    setTop(self.init.top);
    setLeft(self.init.left);
  }, []);

  // 窗口sizeState改变设置窗口位置与大小
  useMemo(() => {
    if (sizeState === SIZE_STATE_NORMAL) {
      // 正常
      if (self.last) {
        if (self.last.sizeState === SIZE_STATE_MIN) {
          setTop(self.beforeMin.top);
          setLeft(self.beforeMin.left);
        } else if (self.last.sizeState === SIZE_STATE_MAX) {
          setTop(self.beforeMax.top);
          setLeft(self.beforeMax.left);
        }
      }
      setWidth(self.normal.width);
      setHeight(self.normal.height);
    } else if (sizeState === SIZE_STATE_MAX) {
      // 放大
      setWidth(max.width);
      setHeight(max.height);
      setTop(0);
      setLeft(0);
      if (self.last.sizeState === SIZE_STATE_NORMAL) {
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

  // 缓存窗口上次的状态
  self.last = {
    top,
    left,
    width,
    height,
    sizeState,
  };

  // 缩放回调
  const reszieHandle = (type) => e => {
    const { clientX, clientY, button } = e;
    if (button === 0) {
      self.canMove = false;
      self.canResize = type;
      self.clientX = clientX;
      self.clientY = clientY;
    }
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
              sizeState={sizeState}
              onClick={(type, sizeState) => {
                self.duration = 200;
                if (type === 'min') {
                  setSizeState(SIZE_STATE_MIN);
                } else if (type === 'close') {
                  setSizeState(SIZE_STATE_DESTORY);
                } else {
                  if (sizeState === SIZE_STATE_NORMAL) {
                    setSizeState(SIZE_STATE_MAX);
                  } else {
                    setSizeState(SIZE_STATE_NORMAL);
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
      {/* 缩放div */}
      {
        resize && (
          <>
            <ResizeWidget 
              className="win-resize-left"
              style={{
                top: 0,
                left: 0,
              }}
              onMove={reszieHandle('l')}
            />
            <ResizeWidget
              className="win-resize-top"
              style={{
                top: 0,
                left: 0,
              }}
              onMove={reszieHandle('t')}
            />
            <ResizeWidget
              className="win-resize-right"
              style={{
                top: 0,
                right: 0,
              }}
              onMove={reszieHandle('r')}
            />
            <ResizeWidget
              className="win-resize-bottom"
              style={{
                bottom: 0,
                right: 0,
              }}
              onMove={reszieHandle('b')}
            />
            <ResizeWidget
              className="win-resize-lt"
            />
            <ResizeWidget
              className="win-resize-lb"
            />
            <ResizeWidget
              className="win-resize-rt"
            />
            <ResizeWidget
              className="win-resize-rb"
            />
          </>
        )
      }
    </Animator>
  )
});
