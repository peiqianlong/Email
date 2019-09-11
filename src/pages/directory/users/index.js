const usersRouter = [
    //users列表
    {
        path: 'userslist',
        name: 'userslist',
        component: (users) => require(['@/pages/directory/users/usersList'], users),
        meta: {
            title: 'users'
        }
    },
    //users表单
    {
        path: 'usersform',
        name: 'usersform',
        component: (users) => require(['@/pages/directory/users/usersForm'], users),
        meta: {
            title: 'usersform'
        }
    },
    //users详情
    {
        path: 'usersdetail',
        name: 'usersdetail',
        component: (users) => require(['@/pages/directory/users/usersDetail'], users),
        meta: {
            title: 'usersDetail'
        }
    }
];
export default usersRouter;