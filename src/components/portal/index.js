/**
 * @description 
 * @author wljing<wljing@aliyun.com>
 * @date 2021/05/30
 */
import React from 'react';
import ReactDOM from 'react-dom';

export default (props) => {
  return (
    <>
      {
        ReactDOM.createPortal((
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              ...props.style,
            }}
            className={props.className}
          >
            {props.children}
          </div>
        ), document.querySelector('body'))
      }
    </>
  )
};
