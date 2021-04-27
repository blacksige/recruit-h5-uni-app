import Vue from 'vue'
import Vuex from 'vuex'
import fetch from '../util/request.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		version: "1.4.2",
		isLogin: uni.getStorageSync("recruit_token") ? true : false,
		mobile: uni.getStorageSync("thorui_mobile") || "echo.",
		memberId: uni.getStorageSync("memberId") || 0,
		openid: "",
		userInfo: { // 用户信息
			longitude: null, // 经度
			latitude: null, // 纬度
			locationCity: '' // 定位城市
		},
		appInfo: { // APP整体数据
			commonDataVersion: '0', // 公共数据的大版本号
			adVersion: '0', // 广告数据版本号	
			serviceVersion: '0' // 服务数据版本号
		},
	},
	mutations: {
		login(state, payload) {
			if (payload) {
				state.mobile = payload.mobile;
				state.memberId = payload.memberId;
			}
			state.isLogin = true;
		},
		logout(state) {
			state.mobile = "";
			state.memberId = 0;
			state.isLogin = false;
		},
		setOpenid(state, openid) {
			state.openid = openid;
		},
		// 设置用户信息
		setUserInfo(state, payload) {
			for (let i in payload) {
				for (let j in state.userInfo) {
					if (i === j) {
						state.userInfo[j] = payload[i]
					}
				}
			}
		},
		// 设置APP信息
		setAppInfo(state, payload) {
			for (let i in payload) {
				for (let j in state.appInfo) {
					if (i === j) {
						state.appInfo[j] = payload[i]
					}
				}
			}
		},
	},
	actions: {
		// 查看公共数据版本是否更新
		// 返回有data数据时代表有更新，未返回data数据代表不需要更新
		// 返回9010错误时代表还未生成公共数据版本，需要先调用对应接口生成数据版本号
		async checkModuleUpdate({
			commit,
			state
		}) {
			return new Promise((resolve, reject) => {
				fetch.request('config/queryHasUpdates', {
					version: state.appInfo.commonDataVersion
				}, 'POST').then((res) => {
					//console.log('各个模块数据数据' + JSON.stringify(res))
					if (res.code === 200) {
						if (!res.data) return
						const data = res.data.versionData
						let obj = {
							updateAd: false,
							updateService: false
						}
						commit('setAppInfo', {
							commonDataVersion: res.data.version
						})
						if (data.advertVersion !== state.appInfo.adVersion) {
							obj.updateAd = true
						}
						if (data.serviceVersion !== state.appInfo.serviceVersion) {
							obj.updateService = true
						}
						resolve(obj)
					} else {
						fetch.toast(res.message)
					}
				}).catch((e) => {})
			})
		}
	}
})

export default store
