const errorRouter = [
    {
        path: "/error404",
        name: "error404",
        meta: {
            title: "404"
        },
        component: (resolve) => require(['@/pages/error/404.vue'], resolve)
    }
];
export default errorRouter;