import Vue from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueI18n from "vue-i18n";
import VueRouter from "vue-router";
import axios from "axios";
import Vuex from "vuex";
import * as echarts from 'echarts'


Vue.prototype.$echarts = echarts
Vue.prototype.axios = axios;
//挂载Vuex
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Antd);
Vue.use(VueI18n);


Vue.config.productionTip = false;

let index = require('./components/Index.vue').default
let setting = require('./components/Setting.vue').default
let login = require('./components/Login.vue').default
let dashboard = require('./components/Dashboard.vue').default
let echart = require('./components/Echart.vue').default
let email = require('./components/Email.vue').default
let info = require('./components/Info.vue').default
let monitor = require('./components/Monitor.vue').default
let software = require('./components/Software.vue').default
let upload = require('./components/Upload.vue').default
let table = require('./components/Table.vue').default
let task = require('./components/Task.vue').default
let news = require('./components/News.vue').default

const routes = [
  {
    path: "/",
    name: "index",
    component: index,
    meta: {
      requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
    },
    redirect: '/setting',
    children: [
      {
        path: "/dashboard",
        component: dashboard,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/setting",
        name: "setting",
        component: setting,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/email",
        name: "email",
        component: email,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/echart",
        name: "echart",
        component: echart,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/info",
        name: "info",
        component: info,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/monitor",
        name: "monitor",
        component: monitor,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/software",
        name: "software",
        component: software,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },   
      {
        path: "/upload",
        name: "upload",
        component: upload,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },   
      {
        path: "/table",
        name: "table",
        component: table,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },           
      {
        path: "/task",
        name: "task",
        component: task,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },
      {
        path: "/news",
        name: "news",
        component: news,
        meta: {
          requireAuth: true, // 添加该字段，表示进入这个路由是需要登录的
        },
      },                                           
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: login,
  }
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    // 判断该路由是否需要登录权限
    if (store.state.token) {
      // 通过vuex state获取当前的token是否存在
      next();
    } else {
      next({
        path: "/login",
        query: { redirect: to.fullPath }, // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});
// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    if (store.state.token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = `token ${store.state.token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT);
          router.replace({
            path: "login",
            query: { redirect: router.currentRoute.fullPath },
          });
      }
    }
    return Promise.reject(error.response.data); // 返回接口返回的错误信息
  }
);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    // 存储token
    token: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "",
  },
  mutations: {
    set_token(state, token) {
      state.token = token;
      sessionStorage.token = token;
      localStorage.token = token;
    },
    del_token(state) {
      state.token = "";
      sessionStorage.removeItem("token");
      localStorage.removeItem('token');
    },
  },
});

const i18n = new VueI18n({
  locale: localStorage.getItem("language") || "zh", // 语言标识
  //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    zh: require("./language/zh"),
    en: require("./language/en"),
  },
});

new Vue({
  render: (h) => h(App),
  i18n, // 不要忘记
  router,
  store
}).$mount("#app");
