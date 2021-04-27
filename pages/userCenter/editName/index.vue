<template>
	<view class="">
		<uni-forms class="edit-form" ref="form" :value="formData" :rules="rules" labelAlign="right">
			<uni-forms-item label="" name="true_name">
				<uni-easyinput type="text" v-model="formData.true_name" placeholder="请输入姓名" />
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
					true_name: ''
				},
				rules: {
					// 对name字段进行必填验证
					true_name: {
						rules: [{
								required: true,
								errorMessage: '请输入姓名',
							},
							{
								minLength: 2,
								maxLength: 10,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
				}
			}
		},
		onLoad() {

		},
		onNavigationBarButtonTap(e) {
				uni.showLoading()
								this.$refs.form.submit().then(res => {
									user.setTrueName({
										true_name: res.true_name
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
