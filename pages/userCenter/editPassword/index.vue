<template>
	<view class="">
		<uni-forms class="edit-form" ref="form" :value="formData" :rules="rules" labelAlign="right">
			<uni-forms-item label="新密码:" name="password">
				<uni-easyinput type="password" v-model="formData.password" placeholder="请输入新密码" />
			</uni-forms-item>
			<uni-forms-item label="确认密码:" name="confirm_password">
				<uni-easyinput type="password" v-model="formData.confirm_password" placeholder="请输入确认密码" />
			</uni-forms-item>
		</uni-forms>
	</view>
</template>

<script>
	import user from '../../../api/user.js'
	export default {
		data() {
			return {
				formData: {
					password: '',
					confirm_password: ''
				},
				rules: {
					// 对name字段进行必填验证
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								minLength: 6,
								maxLength: 30,
								errorMessage: '密码长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					// 对email字段进行必填验证
					confirm_password: {
						rules: [{
								required: true,
								errorMessage: '请输入确认密码',
							}, {
								validateFunction: function(rule, value, data, callback) {
									if (data.password !== data.confirm_password) {
										callback('密码不一致，请重新输入确认密码')
									}
									return true
								}
							}
						]
					}
				}
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e){
		uni.showLoading()
						this.$refs.form.submit().then(res => {
							user.setPassword({
								password: res.password,
								confirm_password: res.confirm_password
							}).then(res => {
								uni.showToast({
									title: res.msg,
									duration: 2000
								})
								
								setTimeout(function() {
									uni.switchTab({
										url: '../index/index'
									})
								}, 1000)
							}).catch(err => {
								uni.hideLoading()
							})
						}).catch(err => {
							uni.hideLoading()
						})	
		},	
		methods: {
			// 触发提交表单
		}

	}
</script>

<style>
	.edit-form {
		width: 80%;
		margin: 40upx auto;
		padding-top: 40upx;
		border-radius: 40upx;
		background-color: #fff;
	}
	.submit-btn {
		width: 200upx;
		margin-left: 50%;
		transform: translateX(-50%);
	}
</style>
