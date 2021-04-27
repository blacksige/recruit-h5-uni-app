import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

const util = {
	toast: function(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	constNum: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android" ? 300 : 0;
	},
	px: function(num) {
		return uni.upx2px(num) + 'px';
	},
	interfaceUrl: function() {
		//接口地址
		return process.env.NODE_ENV === 'development' ? 'http://zp-test.lansee.net' : 'http://zp-test.lansee.net'
	},
	request: function(url, postData, method, type, hideLoading) {
		//接口请求
		if (!hideLoading) {
			uni.showLoading({
				mask: true,
				title: '请稍候...'
			})
		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: this.interfaceUrl() + url,
				data: postData,
				header: {
					'content-type': type ? 'application/x-www-form-urlencoded' : 'application/json',
					'authorization': this.getToken(),
					'security': 1
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					!hideLoading && uni.hideLoading()
					resolve(res.data)
				},
				fail: (res) => {
					if (!hideLoading) {
						this.toast("网络不给力，请稍后再试~")
					}
					reject(res)
				}
			})
		})
	},
	uploadFile: function(src) {
		const that = this
		uni.showLoading({
			title: '请稍候...'
		})
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: this.interfaceUrl() + '/api/job/common/upload',
				filePath: src,
				name: 'file',
				header: {
					'content-type': 'multipart/form-data'
				},
				formData: {},
				success: function(res) {
					uni.hideLoading()
					let d = JSON.parse(res.data)
					if (d.code === 1) {
						let fileObj = JSON.parse(d.data)[0];
						//文件上传成功后把图片路径数据提交到服务器，数据提交成功后，再进行下张图片的上传
						resolve(fileObj)
					} else {
						that.toast(res.message);
					}
				},
				fail: function(res) {
					reject(res)
					uni.hideLoading();
					that.toast(res.message);
				}
			})
		})
	},
	setToken: function(token) {
		uni.setStorageSync("recruit_token", token)
	},
	getToken() {
		return uni.getStorageSync("recruit_token")
	},
	isLogin: function() {
		return uni.getStorageSync("recruit_token") ? true : false
	}
}

uni.getSystemInfo({
	success: function(e) {
		Vue.prototype.statusBar = e.statusBarHeight
		// #ifndef MP
		if (e.platform == 'android') {
			Vue.prototype.customBar = e.statusBarHeight + 50
		} else {
			Vue.prototype.customBar = e.statusBarHeight + 45
		}
		// #endif

		// #ifdef MP-WEIXIN
		let custom = wx.getMenuButtonBoundingClientRect()
		Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight
		// #endif

		// #ifdef MP-ALIPAY
		Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight
		// #endif
	}
})
Vue.prototype.$util = util
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
