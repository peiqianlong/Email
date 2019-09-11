import router from "../router"
import request from "../utils/axios";

router.beforeEach((to, from, next) => {
  if (to.meta.title == 'home') {
    if (localStorage.getItem("sid")) {
      window.document.title = to.meta.title;
      next()
    } else {
      let str = window.atob(window.location.search.substr(1));
      let usernameReg = new RegExp("(^|&)username=([^&]*)(&|$)");
      let passwordReg = new RegExp("(^|&)password=([^&]*)(&|$)");
      let formData = {
        username: str.match(usernameReg)[2],
        password: str.match(passwordReg)[2]
      };
      request.axios("/site/login", formData).then(res => {
        if (res.status === 1) {
          request.setLocal("sid", res.result.sid);
          request.get("/user/info").then(res => {
            res.status === 1 ? request.setLocal("userInfo", res.result) : next({path: "/nologin"});
            ;
            next()
          });
        } else {
          next({path: "/nologin"});
        }
      });

    }
  } else {
    next()
  }


  // window.document.title = to.meta.title;
  // JSON.parse(localStorage.getItem("sid")) ? next() : next({path: "/nologin"})
});
