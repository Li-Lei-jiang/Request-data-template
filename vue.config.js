module.exports = {
    devServer: {
        // 配置端口号
        // port: 8080,
        // 用来真机调试
        host: "0.0.0.0",
        // 代理方式处理跨域 (面试必问)
        proxy: {
            "/api": {
                ws: false,
                // target就是请求接口的根路径
                target: "http://49.233.66.125:3000", //请求跨域的接口
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    }
};