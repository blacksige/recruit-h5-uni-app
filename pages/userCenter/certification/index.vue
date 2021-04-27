<template>
	<view class="">
		<uni-forms class="edit-form" ref="form" :value="formData" :rules="rules" labelAlign="right">
			<uni-forms-item label="姓名:" name="name">
				<uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
			</uni-forms-item>
			<uni-forms-item label="联系方式:" name="phone">
				<uni-easyinput type="text" v-model="formData.phone" placeholder="请输入联系方式" />
			</uni-forms-item>
			<button class="submit-btn" size="mini" type="primary" @click="submit">立即认证</button>
		</uni-forms>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formData: {
					name: '',
					phone: ''
				},
				rules: {
					// 对name字段进行必填验证
					name: {
						rules: [{
								required: true,
								errorMessage: '请输入姓名',
							},
							{
								minLength: 3,
								maxLength: 30,
								errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
							}
						]
					},
					// 对email字段进行必填验证
					phone: {
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
		methods: {
			/**
			 * 复写 binddata 方法，如果只是为了校验，无复杂自定义操作，可忽略此方法
			 * @param {String} name 字段名称
			 * @param {String} value 表单域的值
			 */
			// binddata(name,value){
			// 通过 input 事件设置表单指定 name 的值
			//   this.$refs.form.setValue(name, value)
			// },
			// 触发提交表单
			submit() {
				this.$refs.form.submit().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
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
