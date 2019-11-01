import router from "../router"
import request from "../utils/axios";

router.beforeEach((to, from, next) => {
  if (to.meta.title == 'home') {
    console.log(localStorage.getItem("sid") && localStorage.getItem("dns_status") +"++++++++++++++")
    if (localStorage.getItem("sid") ) {
      if(localStorage.getItem("dns_status") != 0){
        window.document.title = to.meta.title;
        next()
      }else {
        next({path: "/domainname"})
      }
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
          request.setLocal("dns_status", res.result.dns_status);
          if (!res.result.dns_status) {
            next({path: "/domainname"})
          }
          request.get("/user/info").then(res => {
            res.status === 1 ? request.setLocal("userInfo", res.result) : next({path: "/nologin"});
            next()
          });
        } else {
          next({path: "/nologin"});
        }
      });

    }
  } else {
    let stuts = localStorage.getItem("dns_status");
    // stuts ? next() : next({path: "/domainname"})
    if (to.meta.title == 'domainname') {
      next()
    } else {
      if (stuts == 1) {
        next()
      } else {
        next({path: "/domainname"});
      }
    }

    // next()
    // if (localStorage.getItem("dns_status")) {
    //   next({path: "/nologin"})
    // }else {
    //   next()
    // }
  }


  // window.document.title = to.meta.title;
  // JSON.parse(localStorage.getItem("sid")) ? next() : next({path: "/nologin"})
});
