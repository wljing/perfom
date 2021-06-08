/**
 * @description 气泡提示
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/30
 */
import { useSelf } from '@/hooks';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { AnimateVisiable } from '../animate';
import Portal from '../portal';
import './index.scss';

export const Popup = (props) => {
  const {
    children,
    className = '',
    content,
    ..._props
  } = props;
  const [visiable, setVisiable] = useState(false);
  const [style, setStyle] = useState({
    top: 0,
    left: 0,
  });
  const ref = useRef(null);
  const popupRef = useRef(null);
  const self = useSelf();
  self.visiable = visiable;
  useEffect(() => {
    if (ref.current && visiable) {
      const { top, left, width, height } = ref.current.getBoundingClientRect();
      const screen = window.screen;
      setStyle({
        top: top > screen.height * .9 ? top - height : top + height,
        left: left > screen.width * .9 ? left - width : left + width,
      })
    }
  }, [visiable]);
  return (
    <>
      <div
        className={`popup-root ${className}`}
        onMouseEnter={() => setVisiable(true)}
        onMouseLeave={() => setVisiable(false)}
        ref={ref}
        {..._props}
      >
        {
          children
        }
      </div>
      <Portal
        style={{
          zIndex: 9000,
        }}
      >
        <AnimateVisiable
          visiable={visiable}
          ref={popupRef}
          className="popup-content"
          style={{
            ...style,
          }}
          anime={useMemo(() => {
            return {
              begin: (ani) => {
                const el = ani.animatables[0].target;
                el.style.display = 'block';
              },
              complete: (ani) => {
                const el = ani.animatables[0].target;
                el.style.display = self.visiable ? 'block' : 'none';
              }
            }
          }, [])}
        >
          {content}
        </AnimateVisiable>
      </Portal>

    </>
  )
};


export default Popup;