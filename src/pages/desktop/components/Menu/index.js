/**
 * @description 桌面菜单栏
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/12
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useModal, setModal, useEventListener, useSelf } from '@/hooks';
import { Animator } from '@/components/animate';
import { throttle, now } from '@/utils';
import store from './store';
import './index.scss';

setModal(store);

const MenuItem = ({ style = {}, anime, ..._props }) => {
  return (
    <Animator style={style} className="menu-item" anime={anime} {..._props} />
  )
};

export default (props) => {
  const {
    itemClick,
  } = props;
  const { menus } = useModal('desktop', ['menus']);
  const { visiable: menuVisable, setVisiable: setMenuVisable, itemSize } = useModal('menu', ['visiable', 'itemSize']);
  const gap = 16; // 菜单项间距
  const padding = 36; // 菜单上下padding
  const maxMensShowLength = 16; // 最多显示的菜单数量
  const menuBottom = 40; // 显示时距离底部距离
  const menuAnimeDuring = 500; // 菜单动画持续事件
  const menuShowDelay = 100; // 菜单显示延迟
  const menuHiddenDelay = 300; // 菜单隐藏延迟
  const [activeMenuIndex, setActiveMenuIndex] = useState(-1); // 活跃的菜单索引
  const self = useSelf({
    mouseLeft: 0, // 鼠标距离左侧位置
    canMenuItemAnime: true, // 菜单项可动画控制
  });

  // 菜单总宽度
  const menuWidth = useMemo(() => {
    const len = Math.min(menus.length, maxMensShowLength);
    return len * (itemSize + gap) + gap;
  }, [menus, itemSize]);
  // 菜单总高度
  const menuHeight = useMemo(() => {
    return itemSize + padding * 2;
  }, [itemSize]);
  // 菜单anime
  const menuAnime = useMemo(() => ({
    bottom: menuVisable ? menuBottom : -menuHeight,
  }), [menuVisable, menuHeight]);
  // 菜单项初始style
  const initItemStyle = useMemo(() => {
    return menus.map((_, index) => {
      return {
        width: itemSize,
        height: itemSize,
        top: (menuHeight) / 2 - itemSize / 2,
        left: index * (itemSize + gap) + gap,
      }
    });
  }, [menuHeight]);
  // 菜单项 动画属性
  const menusOffset = useMemo(() => {
    const activeIndex = activeMenuIndex;
    return menus.map((_, index) => {
      if (!self.canMenuItemAnime) {
        return {};
      }
      let offset = 0;
      if (activeIndex !== -1) {
        const diff = Math.abs(activeIndex - index);
        if (diff <= 2) {
          offset = 2 - diff;
        }
      }
      return {
        scale: offset === 0 ? 1 : (1 + (offset - 1) * .4),
        translateY: -offset * 6,
      }
    })
  }, [activeMenuIndex]);
  // 菜单项anime
  const menusAnime = useMemo(() => {
    return menusOffset;
  }, [menusOffset]);

  // 设置活跃的菜单
  const setMenuActive = (e) => {
    const el = document.querySelector('.menu-content');
    const { scrollLeft, clientWidth } = el;
    if (e && e.nativeEvent) {
      const { clientX } = e.nativeEvent;
      self.mouseLeft = clientX;
    }
    const diff = self.mouseLeft - (document.documentElement.clientWidth - clientWidth) / 2 + scrollLeft;
    const activeIndex = Math.floor(diff / (itemSize + gap));
    if (activeMenuIndex !== activeIndex) {
      setActiveMenuIndex(activeIndex);
    }
  };

  // 控制菜单显示、隐藏
  useEventListener('mousemove', throttle((e) => {
    const { clientY, clientX } = e;
    self.mouseLeft = clientX;
    const bottom = document.documentElement.clientHeight - clientY;
    if (bottom <= (menuBottom + menuHeight)) {
      // 在菜单位置
      if (self.leaveTimeId) {
        clearTimeout(self.leaveTimeId);
        self.leaveTimeId = null;
      }
      if (!menuVisable) {
        if (!self.enterTimeId) {
          self.enterTimeId = setTimeout(() => {
            setMenuVisable(true);
            self.enterTimeId = null;
          }, menuShowDelay);
        }
      }
    } else {
      // 不在菜单位置
      if (self.enterTimeId) {
        self.enterTimeId = null;
        clearTimeout(self.enterTimeId);
      }
      if (menuVisable) {
        if (!self.leaveTimeId) {
          self.leaveTimeId = setTimeout(() => {
            setMenuVisable(false);
            setActiveMenuIndex(-1);
            self.leaveTimeId = null;
          }, menuHiddenDelay);
        }
      }
    }
  }, 50), {}, [menuHeight]);
  return (
    <Animator
      className="menu-root"
      style={{
        bottom: -menuHeight,
        width: menuWidth,
        height: menuHeight,
      }}
      anime={useMemo(() => {
        return {
          duration: menuAnimeDuring,
          easing: 'easeInOutQuart',
          begin: () => {
            self.canMenuItemAnime = false;
          },
          complete: () => {
            self.canMenuItemAnime = true;
            if (menuVisable) {
              setMenuActive();
            }
          },
          ...menuAnime
        }
      }, [menuAnime, menuVisable])}
    >
      <div className="menu-bg" />
      <div
        className="menu-content"
        onMouseMove={throttle((e) => {
          if (!self.canMenuItemAnime) {
            return
          }
          setMenuActive(e);
        }, 50)}
        onScroll={throttle((e) => {
          setMenuActive();
        }, 50)}
      >
        {
          menus.map((v, index) => (
            <MenuItem
              style={initItemStyle[index]}
              anime={{
                duration: 200,
                easing: 'linear',
                ...menusAnime[index],
              }}
              key={v}
              onClick={() => typeof itemClick === 'function' && itemClick(index)}
            />
          ))
        }
      </div>

    </Animator>
  )
}
