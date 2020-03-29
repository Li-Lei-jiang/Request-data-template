import axios from 'axios'; //引入axios
import qs from 'qs'; //引入qs
import router from '../router' //引入路由
import NProgress from 'nprogress' //引入nprogress 插件 页面加载动画

// //一般发请求
// axios.get(URL,{
//     params:{

//     },
// }).then(res=>{
//     console.log(res);
// }).catch(err=>{
//     console.log(err);
// });

//如何封装？
//1 . 根据环境变量区分接口默认地址 要设置环境可以在 package.json文件 自定义设置
//axios.defaults.baseURL="http://127.0.0.1:3000" ;//公共前缀
// process.env.NODE_ENV的值决定当前环境
// production为生产环境 development为开发环境

// 创建axios配置对象
const service = axios.create()

switch (process.env.NODE_ENV) {
    case 'production':
        service.defaults.baseURL = 'http://api.xx.cn'; //线上环境接口
        break;
    case 'test':
        service.defaults.baseURL = 'http://192.168.0.1:8080'; //测试环境服务器接口   
        break;
    default:
        service.defaults.baseURL = 'http://localhost:8080'; //本地开发环境
}

/**
 * 2 .设置超时时间和跨域是否允许携带凭证
 */

service.defaults.timeout = 10000; //响应时间10秒
service.defaults.withCredentials = true; // 是否允许携带凭证

/**
 * 3 . 设置请求传递数据的格式（看服务器要求什么格式）
 * x-www-form-urlencoded
 */
service.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
service.defaults.transformRequest[(data) => { qs.stringify(data) }]; //在只对post请求

/**
 * 4 . 设置请求拦截器
 * 客户端发送请求 - > [请求拦截器] - > 服务器
 * TOKEN 校验 （JWT算法）：接受服务器返回的token ，储存在vuex、本地存储中，每次向服务器发请求，我们应该把token 带上
 * config 是否带token
 */
service.interceptors.request.use(config => {
    // 在发送请求之前做些什么 ? - > 携带token
    NProgress.start()
    let token = localStorage.getItem('adminToken');
    token && (config.headers.Authorization = token + 'Bearer')
    return config;
}, error => {
    // 返回处理请求错误
    console.log(error);
    return Promise.reject(error);
});

/**
 * 5 . 响应拦截器
 * 服务器返回信息 -> [拦截的统一处理] ->客户端JS获取到信息
 */
/**
 * service.defaults.validateStatus = status=>{//校验状态码
    //自定义响应成功HTTP 状态码 一般很少用 特殊情况 200-300 
     return /^(2|3)\d{2}$/.test(status);
    };
 */

service.interceptors.response.use(response => {
    // Do something before response is sent
    NProgress.done()
    return response.data; //返回响应主体
}, error => {
    // Do something with response error
    let { response } = error;
    if (response) {
        //服务器有返回结果
        switch (response.status) {
            case 400: // => 路径参数错误
                break;
            case 401: // =>权限不足 去登陆页
                break;
            case 403: // => token 过期 服务器禁止访问
                break;
            case 404: // => 找不到页面 或者路径参数错误
                break;
        }
    } else {
        //服务器连接结果都没返回
        if (!window.navigator.onLine) {
            // 断网处理 ：可以跳转到断网页面
            return;
        }
        return Promise.reject(error);
    }
    if (error.response.status === 401) {
        router.push("/login")
    }

    // service.req = function(...params) {
    //     if (params.length === 1) {
    //         return service.get(params[0])
    //     }
    //     if (params.length === 2) {
    //         return service.post(params[0], qs.stringify(params[1]))
    //     }
    // }

});

export default service;