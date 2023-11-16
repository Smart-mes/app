const testURL='http://111.230.91.22:8037'
export default {
    api: { baseURL: process.env.NODE_ENV === 'development' ? testURL:'http://192.168.2.235:8012' },
    oeeServerApi: { baseURL:testURL }
}
//华旺:'http://111.230.91.22:8037'
// 郭：http:// 192.168.1.9:8002


