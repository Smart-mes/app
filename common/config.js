let url_config = ""

if (process.env.NODE_ENV === 'development') {
	// 开发环境
	url_config = 'http://192.168.1.123:8022'
} else {
	// 生产环境
	url_config = 'http://192.168.16.15:8012'
}

export default url_config
