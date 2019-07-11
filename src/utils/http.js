import axios from 'axios'
import Message from '@/utils/message'
import { getToken } from '@/utils/auth'
import store from '@/store'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
})

service.interceptors.request.use(
    request => {
        console.log('request')
        console.log(request)
        if (request.url === '/login' || request.url === 'register') {
            return request
        }
        if (getToken('token')) {
            request.headers['Authorization'] = 'Bearer ' + getToken('token')
        } else {
            store.dispatch('logout')
        }
        return request
    },
    error => {
        console.log(error)
    }
)

service.interceptors.response.use(
    response => {
        console.log('response')
        console.log(response)
        switch (response.data.code) {
            case 200: return response.data;
            default: _message(response.data.message); throw new Error(response.data.message);
            // case 400: _message('用户名或密码错误'); throw new Error('用户名或密码错误');
            // case 401: _message(response.data.message); throw new Error(response.data.message);
            // default: console.log(`错误code: ${response.data.code}`); throw new Error('未知错误')
        }

    },
    error => {
        // switch (error.response.status) {
        //     case 400:
        //     case 500: throw new Error(error.response.data.message);
        //     default: throw new Error('未知错误');
        // }
        _message(error.response.data.message)
        throw new Error(error.response.data.message || `未知错误信息： ${error}`)
    }
)
function _message(msg) {
    Message({
        message: msg,
        type: 'error',
    })
}
export default service