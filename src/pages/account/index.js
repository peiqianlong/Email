const accountRouter = [
  {
    path: '/profile',
    name: 'profile',
    component: (account) => require(['@/pages/account/profile'], account),
    meta: {
      title: 'profile'
    }
  },
  {
    path: '/account2',
    name: 'account2',
    component: (account) => require(['@/pages/account/page2'], account),
    meta: {
      title: 'account2'
    }
  },
  {
    path: '/MeangerUser',
    name: 'MeangerUser',
    component: (account) => require(['@/pages/account/MeangerUser'], account),
    meta: {
      title: 'account2'
    }
  }
];
export default accountRouter;
