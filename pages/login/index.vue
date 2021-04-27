<template>
	<view class="login-box">
		<view class="login-form">
			<input class="login-input" v-model="formData.user_name" placeholder-class="input-placeholder" placeholder="请输入手机号码" />
			<!-- 		<view class="login-input-btn">
				<input class="login-input" placeholder-class="input-placeholder" placeholder="验证码" />
				<view class="login-checking" @click="checking" v-if="state===false">获取验证码</view>
				<view class="login-checking login-time" v-if="state===true">倒计时{{ currentTime }}s</view>
			</view> -->
			<input class="login-input" v-model="formData.password" placeholder-class="input-placeholder" password placeholder="请输入密码" />
			<!-- <view class="checkbox"><checkbox :checked="isChecked" style="transform:scale(0.6)" color="#008600" @click="agree()"/>我已阅读并同意
				<navigator url="../agreement/index">
					<span style="color: blue">"用户协议与隐私协议"</span>
				</navigator>
			</view> -->
			<button class="login-btn" @click="login">立即登录</button>
			<navigator url="../register/index" hover-class="none" class="login-label">还没有账号？点此注册.</navigator>
		</view>
	</view>
</template>

<script>
	import api from '../../api/user.js'
	export default {
		data() {
			return {
				formData: {
					user_name: '',
					password: ''
				},
				state: false, //是否开启倒计时
				totalTime: 60, //总时间，单位秒
				recordingTime: 0, //记录时间变量
				currentTime: 0, //显示时间变量
				isChecked:false,
			}
		},
		onLoad() {

		},
		methods: {
			login() {
				if(!this.isChecked){
					api.login(this.formData).then(res => {
						if(res.code == 200){
							this.$util.setToken(res.data.userinfo.token)
							uni.showToast({
								title: res.msg
							})
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/jobs/index/index'
								})
							}, 500)
						}else if(res.code == 601){
							uni.reLaunch({
								url:'../index/index'
							})
						}else{
							uni.showToast({
								icon:'none',
								title: res.msg
							})
						}
					}).catch(err => {
						console.log(err)
					})
				}else{
					uni.showToast({
						icon:'none',
						title: '未同意协议'
					})	
				}
			},
			agree(){
				this.isChecked = !this.isChecked
				console.log(this.isChecked)
			},
			checking() {
				//把显示时间设为总时间
				this.currentTime = this.totalTime;
				//开始倒计时
				this.state = true;
				//执行倒计时
				this.checkingTime();
			},
			checkingTime() {
				let that = this;
				//判断是否开启
				if (this.state) {
					//判断显示时间是否已到0，判断记录时间是否已到总时间
					if (this.currentTime > 0 && this.recordingTime <= this.totalTime) {
						//记录时间增加 1
						this.recordingTime = this.recordingTime + 1;
						//显示时间，用总时间 - 记录时间
						this.currentTime = this.totalTime - this.recordingTime;
						//1秒钟后，再次执行本方法
						setTimeout(() => {
							//定时器内，this指向外部，找不到vue的方法，所以，需要用that变量。
							that.checkingTime();
						}, 1000)
					} else {
						//时间已完成，还原相关变量
						this.state = false; //关闭倒计时
						this.recordingTime = 0; //记录时间为0
						this.currentTime = this.totalTime; //显示时间为总时间
					}
				} else {
					//倒计时未开启，初始化默认变量
					this.state = false;
					this.recordingTime = 0;
					this.currentTime = this.totalTime;
				}
			}
		}
	}
</script>

<style lang="scss">
	.login-box {
		position: relative;
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		background-image: url(../../static/bgtest.jpg);
	}

	.login-form {
		position: absolute;
		bottom: 0;
		width: 80%;
		height: 550upx;
		margin: 0 10%;
		.login-input {
			background: #f3f3f3;
			margin-top: 30upx;
			border-radius: 100upx;
			padding: 20upx 40upx;
			font-size: 36upx;
		}

		.input-placeholder,
		.login-input {
			color: #91a9eb;
		}

		.login-label {
			padding: 50upx 0;
			text-align: center;
			font-size: 30upx;
			color: #a7b6d0;
		}

		.login-btn {
			color: #fff;
			font-size: 36upx;
			border: 0;
			border-radius: 100upx;
			background-color: $uni-color-primary;
			margin-top: 40upx;
		}
		.checkbox{
			margin: 18rpx;
			color: #a7b6d0;
			font-size: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.login-btn:after {
			border: 0;
		}

		/*验证码输入框*/
		.login-input-btn {
			position: relative;
		}

		.login-input-btn .login-input {
			padding-right: 260upx;
		}

		.login-checking {
			position: absolute;
			right: 0;
			top: 0;
			background: #ff65a3;
			color: #fff;
			border: 0;
			border-radius: 110upx;
			font-size: 36upx;
			margin-left: auto;
			margin-right: auto;
			padding-left: 28upx;
			padding-right: 28upx;
			box-sizing: border-box;
			text-align: center;
			text-decoration: none;
			line-height: 2.3;
			-webkit-tap-highlight-color: transparent;
			overflow: hidden;
			padding-top: 2upx;
			padding-bottom: 2upx;
		}

		.login-checking.login-time {
			background: #a7b6d0;
		}

		/*按钮点击效果*/
		.login-btn.button-hover {
			transform: translate(1upx, 1upx);
		}
	}
</style>
