<template>
	<view class="register-box">
		<view class="register-form">
			<input class="register-input" v-model="formData.mobile" placeholder-class="input-placeholder" placeholder="请输入手机号码" />
			<view class="register-input-btn">
				<input class="register-input" v-model="formData.code" placeholder-class="input-placeholder" placeholder="验证码"/>
				<view class="register-checking" @click="getCode" v-if="state===false">获取验证码</view>
				<view class="register-checking register-time" v-if="state===true">倒计时{{ currentTime }}s</view>
			</view>
			<input class="register-input" v-model="formData.password" placeholder-class="input-placeholder" password placeholder="请输入密码"/>
			<button class="register-btn" @click="register">立即注册</button>
			<navigator url="../login/index" hover-class="none" class="register-label">已有账号，点此去登录.</navigator>
		</view>
	</view>
</template>

<script>
	import api from '../../api/user.js'
	export default {
		data() {
			return {
				state: false,		//是否开启倒计时
				totalTime: 60,		//总时间，单位秒
				recordingTime: 0, 	//记录时间变量
				currentTime: 0, 	//显示时间变量
				formData: {
					mobile: '',
					password: '',
					code: ''
				},
			}
		},
		onLoad() {
	
		},
		methods: {
			register() {
				api.register(this.formData).then(res => {
					uni.showToast({
						title: res.msg
					})
					if (res.code === 200) {
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/index'
							})
						}, 500)
					}
				}).catch(err => {
					uni.showToast({
						title: JSON.stringify(err)
					})
				})
			},
			getCode() {
				if (this.formData.mobile) {
					api.sendSMS({
						mobile: this.formData.mobile,
						scene: '3'
					}).then(res => {
						this.formData.sign = res.data.sign
						this.formData.time = res.data.time
						uni.showToast({
							// title: res.msg,
							title:'验证码发送成功'
						})
					}).catch(err => {
						
					})
					//把显示时间设为总时间
					this.currentTime = this.totalTime;
					//开始倒计时
					this.state = true;
					//执行倒计时
					this.checkingTime();
				} else {
					uni.showToast({
						title: '请输入手机号'
					})
				}
			},
			checkingTime(){
				let that = this;
				//判断是否开启
				if(this.state){
					//判断显示时间是否已到0，判断记录时间是否已到总时间
					if(this.currentTime > 0 && this.recordingTime <= this.totalTime){
						//记录时间增加 1
						this.recordingTime = this.recordingTime + 1;
						//显示时间，用总时间 - 记录时间
						this.currentTime = this.totalTime - this.recordingTime;
						//1秒钟后，再次执行本方法
						setTimeout(() => { 	
							//定时器内，this指向外部，找不到vue的方法，所以，需要用that变量。
							that.checkingTime();
						}, 1000)
					}else{
						//时间已完成，还原相关变量
						this.state = false;		//关闭倒计时
						this.recordingTime = 0;	//记录时间为0
						this.currentTime = this.totalTime;	//显示时间为总时间
					}
				}else{
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
	.register-box{
		position: relative;
		height: 100%;
		background-size: cover;
		background-repeat: no-repeat;
		background-image: url(../../static/bgtest.jpg);
	}
	.register-form{
		position: absolute;
		bottom: 0;
		width: 80%;
		height: 600upx;
		margin: 0 10%;
		.register-input{
			background: #e2f5fc;
			margin-top: 20upx;
			border-radius: 100upx;
			padding: 20upx 40upx;
			font-size: 36upx;
		}
		.input-placeholder, .register-input{
			color: #94afce;
		}
		.register-label{
			padding-top: 20upx;
			text-align: center;
			font-size: 30upx;
			color: #a7b6d0;
		}
		.register-btn{
			margin-top: 50upx;
			color: #fff;
			font-size: 36upx;
			border: 0;
			border-radius: 100upx;
			background-color: $uni-color-primary;
		}
		.register-btn:after{
			border: 0;
		}
		
		/*验证码输入框*/
		.register-input-btn{
			position: relative;
		}
		.register-input-btn .register-input{
			padding-right: 260upx;
		}
		.register-checking{
			position: absolute;
			right: 0;
			top: 0;
			height: 100%;
			margin-left: auto;
			margin-right: auto;
			padding-left: 54upx;
			padding-right: 54upx;
			color: #fff;
			font-size: 36upx;
			line-height: 2.6;
			text-align: center;
			text-decoration: none;
			box-sizing: border-box;
			border: 0;
			border-radius: 110upx;
			overflow: hidden;
			background: $uni-color-primary;
			-webkit-tap-highlight-color: transparent;
		}
		.register-checking.register-time{
			background: #a7b6d0;
		}
		
		/*按钮点击效果*/
		.register-btn.button-hover{
			transform: translate(1upx, 1upx);
		}
	}
</style>
