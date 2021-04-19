import Vue from 'vue'
import VueRouter from 'vue-router'
import {Loading, Message, MessageBox} from 'element-ui'
import Login from '../components/Login.vue'
import Regist from '../components/Regist.vue'
import Forget from '../components/Forget'
import Info from '../components/Info.vue'
import Recite from '../components/Recite.vue'
import Statistics from '../components/Statistics.vue'
import Home from '../views/Home.vue'
import Translate from '../components/Translate.vue'
import Book from '../components/Book.vue'
import MyBook from '../components/MyBook.vue'
import Manage from '../components/Manage.vue'
import Upload from '../components/Upload.vue'
import Admin from '../views/Admin.vue'
import UserMgt from '../components/admin/UserMgt.vue'
import LibraryMgt from '../components/admin/LibraryMgt.vue'
import SystemMgt from '../components/admin/SystemMgt.vue'
import ReviewMgt from '../components/admin/ReviewMgt.vue'

Vue.use(VueRouter)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message


const routes = [
    {path: '/', name: 'Index', redirect: {name: 'Login'}},
    {path: '/login', name: 'Login', component: Login},
    {path: '/regist', name: 'Regist', component: Regist},
    {path: '/forget', name: 'Forget', component: Forget},

    {
        path: '/admin',
        component: Admin,
        redirect: '/admin/userMgt',
        //以 / 开头的嵌套路径会被当作根路径
        children: [
            {path: 'userMgt', component: UserMgt},
            {path: 'libraryMgt', component: LibraryMgt},
            {path: 'systemMgt', component: SystemMgt},
            {path: 'reviewMgt', component: ReviewMgt}
        ]
    },

    {
        path: '/home',
        component: Home,
        redirect: '/home/info',
        children: [
            {path: 'info', component: Info},
            {path: 'recite', component: Recite},
            {path: 'statistics', component: Statistics},
            {path: 'myBook', component: MyBook},
            {path: 'translate', component: Translate},
            {path: 'book', component: Book},
            {path: 'manage', component: Manage},
            {path: 'upload', component: Upload}
        ]
    }
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


router.beforeEach((to, from, next) => {

    const token = window.localStorage.getItem('token')

    // 访问注册登录找回密码，放行
    if (to.path == '/login' || to.path == '/regist' || to.path == '/forget') {
        if (!token) {
            return next()
        } else {
            return next({path: '/home'})
        }
    }

    if (to.path == '/401') {
        return next()
    }

    //没登陆访问，统统跳转到login
    if (!token) {
        return next('/login')
    }
    next()
})

export default router
