import React, { useMemo } from 'react';
import ReactDom from 'react-dom';
import Router from './route';
import { setModal, useModal, useEventListener } from '@/hooks';
import '@/style/iconfont';
import './app.scss';
import appManager from './appManager';

setModal({
  name: 'app',
  store: {
    theme: 'dark',
    theme: 'default',
    window: {},
    appManager,
    appMap: { //  应用表
      app1: { 
        id: 'app1',
        url: '/assets/apps/app1/index.html',
        mode: 'html',
      },
      app2: {
        id: 'app2',
        url: '/assets/apps/app2/index.html',
        mode: 'html',
      }
    },
  },
  actions: {
    // 获取app信息
    getAppInfo: ({ store }, payload) => {
      const id = payload;
      const { appMap } = store;
      return Reflect.has(appMap, id) ? appMap[id] : false;
    }
  }
});

const App = () => {
  // 主题切换
  const { theme } = useModal('app', ['theme']);
  useMemo(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  return (
    <Router />
  )
};

ReactDom.render(<App />, document.querySelector('#root_main'));

