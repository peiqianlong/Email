import axios from 'axios';
import QS from 'qs';
import router from '../router/index';
// 超时设定
axios.defaults.timeout = 150000;
axios.defaults.baseURL = process.env.NODE_ENV !== 'production' ? '/api' : process.env.API;
// http request 拦截器
axios.interceptors.request.use(config => {
  return config;
}, err => {
  console('请求超时');
  return Promise.resolve(err);
});


// http response 拦截器
axios.interceptors.response.use(response => {
  //判断是否登陆超时
  if (response.data.status == -1 && response.data.message == "Your session is invalid or expired.") {
    window.localStorage.clear();
    window.location.href = 'http://mail.phrmg.org/#/login';
  } else {
    const data = response.data;
    return data;
  }

}, err => {
  const data = err.response;
  switch (data.status) {
    case 404:
      router.replace({
        name: 'error404'
      })
  }
  return Promise.resolve(err);
});
const request = {
  //读取session
  getSession: (name) => JSON.parse(sessionStorage.getItem(name)),
  setSession: (name, val) => sessionStorage.setItem(name, JSON.stringify(val)),
  removeSession: (name) => sessionStorage.removeItem(name),
  clearSession: () => sessionStorage.clear(),
  //读取Local
  getLocal: (name) => JSON.parse(localStorage.getItem(name)),
  setLocal: (name, val) => localStorage.setItem(name, JSON.stringify(val)),
  removeLocal: (name) => localStorage.removeItem(name),
  clearLocal: () => localStorage.clear(),
  axios: (url, data = {}) => {
    data.channel = data.channel == undefined ? "0001" : data.channel;
    return new Promise((resolve, reject) => {
      axios.post(url, QS.stringify(data)).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    });
  },
  post: (url, data = {}) => {
    data.channel = data.channel == undefined ? "0001" : data.channel;
    return new Promise((resolve, reject) => {
      axios.post(url + '?sid=' + JSON.parse(localStorage.getItem('sid')), QS.stringify(data)).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    });
  },
  get: (url, params = {}) => {
    params.channel = params.channel == undefined ? "0001" : params.channel;
    return new Promise((resolve, reject) => {
      axios.get(url + '?sid=' + JSON.parse(localStorage.getItem('sid')), {
        params: params
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      });
    });
  }
};
export default request;
