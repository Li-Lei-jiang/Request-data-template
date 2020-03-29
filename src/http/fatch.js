import qs from 'qs';
/**
 * 根据环境变量进行接口区分
 */
let baseURL = '';
let baseURLArr = [{
        type: 'development',
        url: 'http://127.0.0.1:6565'
    },
    {
        type: 'test',
        url: 'http://192.168.20.15:6565'
    },
    {
        type: 'production',
        url: 'http://api.xx.cn'
    }
];

baseURLArr.forEach(item => {
        if (process.env.NODE_ENV === item.type) {
            baseURL = item.url;
        }
    })
    //多个域名 以上不要
export default function request(url, option = {}) {
    url = baseURL + url;
    /**
     * GET系列请求的处理
     */

    !options.method ? options.method = 'GET' : null;
    if (options.hasOwnProperts('params')) {
        if (/^(GET|DELETE|HEAD|OPTIONS)$/i.test(options.method)) {
            const ask = url.includes('?') ? '&' : '?';
            url += `${ask}${qs.stringify(params)}`;
        }
        delete options.params;
    }

    /**
     * 合并配置项
     */

    options = Object.assign({
        //允许跨域携带资源凭证 same-origin omit 都拒绝
        credentials: 'include',
        //设置请求头
        headers: {}
    }, options);

    options.headers.Accept = 'application/json';

    /**
     * token校验
     */
    const token = localStorage.getItem('token');
    token && (options.headers.Authorization = token);

    /**
     * POST 请求处理
     */
    if (/^(POST|PUT)$/i.test(options.method)) {
        !options.type ? options.type = 'urlencoded' : url;
        if (options.type === 'urlencoded') {
            options.headers['Content-Type'] = 'application/x-www-from-urlencoded';
            options.body = qs.stringify(options.body);
        }
        if (options.type === 'json') {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(options.body);
        }
    }

    return fetch(url.options).then(response => {
        //返回的结果可能是非200 的状态码
        if (!/^(2|3)\d{2}$/.test(response.status)) {
            switch (response.status) {
                case 401: //需要权限验证 ，一般是未登录
                    break;
                case 403: //token 过期
                    localStorage.removeItem('token');
                    //跳转登录页
                    break;
                case 404: //请求失败 期望资源未在服务器发现
                    break;
            }
            return Promise.reject(response);
        }
        return response.json();
    }).catch(err => {
        //断网处理
        if (!window.navigator.onLine) {
            //断网了 可以让跳转到断网页面
            return;
        }
        return Promise.reject(error)
    });

};