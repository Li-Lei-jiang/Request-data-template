/**
 * 这是数据请求的唯一入口
 * 所有请求都写在这里
 */

import service from './index';

export default {

    banner({ type }) {
        return service.get(`/api/banner?type=${type}`)
    }

}