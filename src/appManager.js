/**
 * @description 应用管理器
 * @author wljing<wljing@aliyun.com>
 * @date 2021/06/08
 */

import AppManager from 'micro';

export default new AppManager({ 
  apps: [
   {
     id: 'app1',
     url: '/assets/apps/app1/index.html',
     mode: 'html',
   },
   {
    id: 'app2',
    url: '/assets/apps/app2/index.html',
    mode: 'html',
  } 
  ],
})