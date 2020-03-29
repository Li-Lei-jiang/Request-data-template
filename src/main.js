import Vue from 'vue'
import App from './App.vue'
import router from './router'
import api from './http/api'
// import axios from 'axios'
import dayjs from 'dayjs'
import "nprogress/nprogress.css";
// import store from './store' //配置Vuex的内容
// import './global' 设置映射全局组件
// import './filters' 

Vue.prototype.$api = api
Vue.prototype.$dayjs = dayjs

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')

// axios({
//     url: 'http://api.tianapi.com/txapi/ncov/index?key=5d18950e0c1afd09a3d2e9eaf80c3961&data=2020-03-28'
// }).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })