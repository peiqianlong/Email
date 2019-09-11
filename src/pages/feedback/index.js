const feedbackRouter = [
    {
        path: '/feedback',
        name: 'feedback',
        component: (resolve) => require(['@/pages/feedback/page1'], resolve),
        meta: {
            title: 'feedback'
        }
    }
];
export default feedbackRouter;