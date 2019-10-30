import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/pages/main'
import accountRouter from '@/pages/account/index.js'
import directoryRouter from '@/pages/directory/index.js'
import feedbackRouter from '@/pages/feedback/index.js'
import managementToolRouter from '@/pages/management-tool/index.js'
import systemLogRouter from '@/pages/system-log/index.js'
import errorRouter from '@/pages/error/index.js'
import request from "../utils/axios";

import nologin from '@/pages/nologin'
import domainname from '@/pages/domainname'


Vue.use(Router);
const routes = [
  {
    path: '/',
    component: Main,
    children: [{
      path: '',
      name: 'home',
      component: (home) => require(['@/pages/home'], home),
      meta: {
        title: 'home'
      }
    },
      ...accountRouter,
      ...directoryRouter,
      ...feedbackRouter,
      ...managementToolRouter,
      ...systemLogRouter,
      ...errorRouter
    ]
  },
  {
    path: '/nologin',
    component: nologin,
    meta: {
      title: 'nologin'
    }
  },
  {
    path: '/domainname',
    component: domainname,
    meta: {
      title: 'domainname'
    }
  }
];
const router = new Router({
  mode: 'history',
  routes
});


router.afterEach(route => {
  window.scrollTo(0, 0);
});
export default router;
