import urlConfig from './config';
import store from 'store/index'
/*
@param url 字符串
@param method 请求方法
@param data请求参数
*/
const request = (opt) => {
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': store.state.userToken
	}
	 let promise = new Promise(function(resolve, reject) {
	 uni.request({
		url: urlConfig + opt.url,
		method: opt.method,
		data: opt.data,
		dataType: 'json',
		header: headers
	}).then(result => {
		let [error, res] = result;

		if (res.statusCode === 200) {
			resolve(res.data);
		}else {
			throw res
		}	
	}).catch(error => {
		switch (error.statusCode) {
			case 400:
				let message = error.data.message.toString()
				uni.showToast({
					title: message,
					icon: 'none'
				})
				break
			default:
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				})				
				break
		};
		reject(error);

	});

 });
 return promise;
}

export default {
	request
};
