<template>
	<view class="">
		<uni-forms class="edit-form" ref="form" :value="formData" :rules="rules" labelAlign="right">
			<uni-forms-item label="" name="email">
				<uni-easyinput type="text" v-model="formData.email" placeholder="请输入您的邮箱" />
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
					email: ''
				},
				rules: {
					// 对email字段进行必填验证
					email: {
						rules: [{
							required: true,
							errorMessage: '请输入你的邮箱地址',
						}, {
							format: 'email',
							errorMessage: '请输入正确的邮箱地址',
						}]
					}
				}
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e) {
			uni.showLoading()
			this.$refs.form.submit().then(res => {
				user.setEmail({
					email: res.email
				}).then(res => {
					uni.showToast({
						title: res.msg,
						duration: 2000
					})
					setTimeout(function() {
						uni.switchTab({
							url: '../index/index',
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
		width: 100%;
		padding: 0;
	}

	.submit-btn {
		width: 200upx;
		margin-left: 50%;
		transform: translateX(-50%);
	}
</style>
