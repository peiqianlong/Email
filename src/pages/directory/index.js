import usersRouter from '@/pages/directory/users/index.js'
const directoryRouter = [
    //users
    {
        path: '/users',
        redirect: '/users/userslist',
        meta: {
            title: 'users'
        },
        component: (users) => require(['@/pages/directory/users/users'], users),
        children: [...usersRouter]
    },
    //units列表
    {
        path: '/unitslist',
        name: 'unitslist',
        component: (units) => require(['@/pages/directory/units/unitsList'], units),
        meta: {
            title: 'unitslist'
        }
    },
    //groups列表
    {
        path: '/groupslist',
        component: (groups) => require(['@/pages/directory/groups/groupsList'], groups),
        meta: {
            title: 'groupslist'
        }
    },
    //groupsManage列表
    {
        path: '/groupsmanage',
        component: (groups) => require(['@/pages/directory/groups/groupsManage'], groups),
        meta: {
            title: 'groupsmanage'
        }
    },
    //groupsManage详情
    {
        path: '/groupsmanagedetail',
        component: (groups) => require(['@/pages/directory/groups/groupManageDetail'], groups),
        meta: {
            title: 'groupsmanagedetail'
        }
    }
];
export default directoryRouter;