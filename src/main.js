import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import './common/style.css'
import './axios'
import * as echarts from 'echarts'
import ECharts from 'vue-echarts'

Vue.use(Element)
Vue.component('v-chart', ECharts)//注册组件，使得能识别<v-chart>

Vue.prototype.$axios = axios
Vue.config.productionTip = false


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
