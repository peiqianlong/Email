const managementToolRouter = [
    {
        path: '/management-tool',
        name: 'management-tool',
        component: (resolve) => require(['@/pages/management-tool/managementTool'], resolve),
        meta: {
            title: 'management-tool'
        }
    }
];
export default managementToolRouter;