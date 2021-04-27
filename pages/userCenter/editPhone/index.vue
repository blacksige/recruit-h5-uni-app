<template>
	<view class="">
		<uni-forms class="edit-form" ref="form" :value="formData" :rules="rules" labelAlign="right">
			<uni-forms-item label="" name="mobile">
				<uni-easyinput type="text" v-model="formData.mobile" placeholder="请输入联系方式" />
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
					mobile: ''
				},
				rules: {
					// 对email字段进行必填验证
					mobile: {
						rules: [{
							required: true,
							errorMessage: '请输入手机号码',
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
				user.setMobile({
					mobile: res.mobile
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
