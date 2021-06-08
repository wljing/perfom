export default {
  name: 'desktop',
  store: {
    desktopImg: '../../assets/images/desktop.jpeg', // 壁纸
    // lock: false, // 是否锁屏
    // passwrod: () => 1234, // 锁屏密码
    windowMap: {
      // 'app1': {
      //   appId: 'app1',
      //   winInfo: {
      //     title: 'app1',
      //     width: 1000,
      //     height: 300,
      //     top: 100,
      //     left: 100,
      //   },
      // }
    }, // 子窗口
    menus: [ // 菜单栏
      {
        id: 'nav1',
        appId: 'app1',
        icon: '',
        winInfo: {
          title: 'APP1',
        },
      },
      {
        id: 'nav2',
        appId: 'app2',
        icon: '',
        winInfo: {
          title: 'APP2',
        },
      },
      
    ],
    menuWinLinkMap: {
    }
  },
  actions: {
    createWin: (store, { appId, winInfo, menuId }) => {
      console.log('创建窗口', appId, menuId, winInfo);
      const { windowMap, menuWinLinkMap } = store;
      const index = Object.keys(windowMap).length;
      const winKey = `Win_${appId}_${index}`;
      if (!Reflect.has(windowMap, winKey)) {
        windowMap[winKey] = {
          appId,
          winInfo,
          index,
        };
        menuWinLinkMap[menuId] = winKey;
        store.windowMap = windowMap;
        store.menuWinLinkMap = menuWinLinkMap;
        return winKey;
      } else {
        console.error('winKey' + winKey + 'is repeated');
        return false;
      }
    },
    removeWin: (store, winKey) => {
      const { windowMap } = store;
      if (Reflect.has(windowMap, winKey)) {
        delete windowMap[winKey];
        store.windowMap = windowMap;
        return true;
      } else {
        return false;
      }
    },
  },
}