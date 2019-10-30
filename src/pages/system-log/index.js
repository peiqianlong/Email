import usersRouter from '@/pages/directory/users/index.js'

const systemLogRouter = [
  {
    path: '/system-log',
    component: (resolve) => require(['@/pages/system-log/page1'], resolve),
    meta: {
      title: 'system-log'
    },
    children: [
      {
        path: '',
        name: 'highlights',
        component: (resolve) => require(['@/pages/system-log/Highlights'], resolve),
      },
      {
        path: 'emaillog',
        name: 'emaillog',
        component: (resolve) => require(['@/pages/system-log/emaillog'], resolve),
      }, {
        path: 'capacity',
        name: 'capacity',
        component: (resolve) => require(['@/pages/system-log/capacity'], resolve),
      },
      {
        path: 'operatuion',
        name: 'operatuion',
        component: (resolve) => require(['@/pages/system-log/operatuion'], resolve),
      }, {
        path: 'systeminfo',
        name: 'systeminfo',
        component: (resolve) => require(['@/pages/system-log/Systeminfo'], resolve),
      }

    ]

  }
];
export default systemLogRouter;
