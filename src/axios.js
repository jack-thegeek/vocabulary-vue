import axios from 'axios'
import Element from 'element-ui'
import router from './router'
import store from './store'

axios.defaults.baseURL = "http://localhost:8081"
axios.defaults.withCredentials = true; //携带cookie信息,保持session的一致性，然而shiro把session关了

// 前置拦截
axios.interceptors.request.use(config => {
    var accessToken = localStorage.getItem('token');
    if (accessToken && accessToken !== '') {
        config.headers.Authorization = accessToken;
    }
  return config
})

axios.interceptors.response.use(response => {
    let res = response.data;

    console.log("=================")
    console.log(res)
    console.log("=================")

    if (res.code === 200) {
      return response
    } else {

      // Element.Message.error('错了哦，这是一条错误消息', {duration: 3 * 1000})
      Element.Message.error(response.data.msg, {duration: 3 * 1000})
      return Promise.reject(response.data.msg)
    }
  },
  error => {
    console.log(error)
    if(error.response.data) {
      error.message = error.response.data.msg
    }

    if(error.response.status === 401) {
      store.commit("REMOVE_INFO")
      router.push("/login")
    }

    Element.Message.error(error.message, {duration: 3 * 1000})
    return Promise.reject(error)
  }
)