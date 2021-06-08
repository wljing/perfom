/**
 * @description 动画组件
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/11
 */
import animejs from 'animejs';
import { unique_key } from '@/utils';
import React, { forwardRef, useEffect, useMemo, useRef, useState, } from 'react';
import { useUpdated } from '@/hooks';

// export const Animate = (props) => {
//   const {
//     anime,
//     className = '',
//     children,
//   } = props;
//   const id = useMemo(() => `ani__${unique_key()}`, []);
//   useLayoutEffect(() => {
//     animejs({
//       targets: `.${id}`,
//       ...anime,
//     })
//   }, [anime]);
//   return (
//     <div className={`${className} ${id}`}>
//       {
//         children
//       }
//     </div>
//   )
// };

export const Animator = forwardRef((props, ref) => {
  const {
    anime,
    className = '',
    children,
    ..._props
  } = props;
  const id = useMemo(() => `ani__${unique_key()}`, []);

  useEffect(() => {
    if (anime !== false) {
      animejs({
        targets: `.${id}`,
        ...anime,
      })
    }
  }, [anime]);
  return (
    <div className={`${id} ${className}`} {..._props} ref={ref}>
      {
        children
      }
    </div>
  )
});

const animateTypeMap = {
  'fade': {
    in: {
      opacity: 1,
    },
    out: {
      opacity: 0,
    },
  }
};

export const AnimateVisiable = forwardRef((props, ref) => {
  const {
    animeType = 'fade',
    anime: _anime = {},
    visiable = true,
    children,
    style,
    ..._props
  } = props;
  const [anime, setAnime] = useState({});
  const [canAnime, setCanAnime] = useState(false);

  // 首次不进行动画
  useUpdated(() => {
    setCanAnime(true);
    setAnime(animateTypeMap[animeType][visiable ? 'in' : 'out']);
  }, [visiable])

  const animeObj = useMemo(() => {
    return canAnime ? Object.assign({}, anime, _anime) : false;
  }, [anime, _anime, canAnime]);
  return (
    <Animator
      anime={animeObj}
      ref={ref}
      style={{
        display: 'none',
        ...style,
      }}
      {..._props}
    >
      {children}
    </Animator>
  )
});
