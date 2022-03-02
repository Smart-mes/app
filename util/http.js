import config from './config';
import store from 'store/index'
/*
@param url 字符串
@param method 请求方法
@param data请求参数
*/
const userToken=uni.getStorageSync('userToken');
const request = (opt) => {
	const {url,method,data}=opt
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': userToken
	}
	 let promise = new Promise(function(resolve, reject) {
	 uni.request({
		url: config.api.baseURL + url,
		method: method,
		data:data,
		dataType: 'json',
		header: headers
	}).then(result => {
		let [error, res] = result;
		if (res.statusCode === 200||res.statusCode === 204||res.statusCode === 201) {
			resolve(res.data);
		}else {
			throw res
		}	
	}).catch(error => {
		let message = error.data.message.toString()
		switch (error.statusCode) {
			case 400:
				uni.showToast({title: message,icon: 'none'})
				break
			default:
				uni.showToast({title: '网络错误',icon: 'none'})				
				break
		};
		reject(error);

	});

 });
 return promise;
}
export default {request};
