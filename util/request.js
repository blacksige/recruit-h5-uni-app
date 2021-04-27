//公共js,以及基本方法封装 nvue里使用
const fetch = {
	interfaceUrl: function() {
		//接口地址
		let loca = window.location
		if(loca.hostname === "localhost"){
			return 'http://zp-test.lansee.net'
		}else{
			return loca.origin
		}
		// return process.env.NODE_ENV === 'development' ? 'http://zp-test.lansee.net' : 'http://zp.lansee.net'
	},
	toast: function(tips) {
		uni.showToast({
			title: tips || "出错啦~",
			icon: 'none',
			duration: 2000
		})
	},
	request: function(url, method, postData, type, showLoading) {
		//接口请求
		if (showLoading) {
			uni.showLoading({
				mask: true,
				title: '请稍候...'
			})
		}

		// const params = {
		// 	data: method === "POST" ? postData : JSON.stringify(postData)
		// }
		return new Promise((resolve, reject) => {
			uni.request({
				url: fetch.interfaceUrl() + url,
				data: method === "POST" ? JSON.stringify(postData) : postData,
				header: {
					'token': uni.getStorageSync("recruit_token"),
					'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
					'security': "1"
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					showLoading && uni.hideLoading()
					resolve(res.data)
				},
				fail: (res) => {
					fetch.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	}
}

module.exports = {
	request: fetch.request,
	toast: fetch.toast
}
