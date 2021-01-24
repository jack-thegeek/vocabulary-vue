import Vue from 'vue'
import VueRouter from 'vue-router'
import {Message} from 'element-ui'
import Login from '../components/Login.vue'
import Regist from '../components/Regist.vue'
import Forget from "../components/Forget";
import Info from '../components/Info.vue'
import Recite from '../components/Recite.vue'
import Home from '../views/Home.vue'
import Translate from '../components/Translate.vue'
import Word from '../components/Word.vue'
import Book from '../components/Book.vue'
import MyBook from '../components/MyBook.vue'
import Manage from '../components/Manage.vue'

Vue.use(VueRouter)
Vue.prototype.$message = Message

const routes = [
    {path: '/', name: 'Index', redirect: {name: "Login"}},
    {path: '/login', name: 'Login', component: Login},
    {path: '/regist', name: 'Regist', component: Regist},
    {path: '/forget', name: 'Forget', component: Forget},
    {path: '/home',
        component: Home,
        redirect: {name: "info"},
        children:[
            {path: '/info', component: Info},
            {path: '/recite', component: Recite},
            {path: '/myBook', component: MyBook},
            {path: '/translate', component: Translate},
            {path: '/book', component: Book},
            {path: '/word', component: Word},
            {path: '/manage', component: Manage},
        ]
    },
]


const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {

    const token = window.localStorage.getItem('token');
    // 访问注册登录找回密码，放行
    if (to.path == '/login' || to.path == '/regist' || to.path == '/forget') {
        if (!token) {
            return next();
        } else {
            return next({path: '/home'})
        }
    }

    if (to.path == '/401') {
        return next();
    }

    //没登陆访问，统统跳转到login
    if (!token) {
        return next('/login');
    }
    next();
})

export default router
