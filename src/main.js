import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import './common/style.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import "./axios"


Vue.use(Element)
import axios from 'axios'
Vue.prototype.$axios = axios

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
