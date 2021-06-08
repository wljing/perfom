/**
 * @description 图标
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/30
 */
import React from 'react';

const Icon = (props) => {
  const {
    name,
    className = '',
    ..._porps
  } = props;

  return (
    <svg className={`icon ${className}`} {..._porps}>
      <use xlinkHref={`#icon-${name}`} />
    </svg>
  )
};

export default Icon;
