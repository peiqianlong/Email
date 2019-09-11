const systemLogRouter = [
    {
        path: '/system-log',
        name: 'system-log',
        component: (resolve) => require(['@/pages/system-log/page1'], resolve),
        meta: {
            title: 'system-log'
        }
    }
];
export default systemLogRouter;