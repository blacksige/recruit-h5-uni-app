<template>
	<view style="height: 100%;">
		<uni-card title="上传简历">
			<view class="tips">文件支持doc docx pdf等格式</view>
		</uni-card>
		<view class="attachment-info">
			<button class="upload-btn" @click="uploadFile">点击上传</button>
		</view>
	</view>
</template>

<script>
	import resume from '../../../api/resume.js'
	export default {

		data() {
			return {
				thisUrl:'',
			}
		},
		onLoad() {

		},
		methods: {
			uploadFile() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title: '上传中'
						});
						let loca = window.location
						if(loca.hostname === "localhost"){
							this.thisUrl = 'http://zp-test.lansee.net' 
						}else{
							this.thisUrl = loca.origin
						}
						uni.uploadFile({
							url: this.thisUrl + '/api/job/common/upload',
							filePath: tempFilePaths[0], // uni.chooseImage函数调用后获取的本地文件路劲
							name: 'file', //后端通过'file'获取上传的文件对象
							formData: this.sendDate,
							header: {
								'Token': uni.getStorageSync("recruit_token")
							},
							success: (res) => {
								res = JSON.parse(res.data)
								if (res.code == 200) {
									resume.resumeUpload({
										name: res.data.name,
										file_type: res.data.type,
										file_url: res.data.url
									}).then(sa => {
										uni.hideLoading();
										uni.showToast({
											title: sa.msg
										})
										setTimeout(function() {
										uni.reLaunch({
											url: '../list/index'
										})
										}, 1000)
									}).catch(err => {
										console.log(err)
										uni.hideLoading();
									})

								} else {
									uni.hideLoading();
									uni.showToast({
										icon: 'none',
										title: "未知错误！",
									})
								}
							},
							fail:(error)=>{
								uni.hideLoading();
								console.log()
							}
						})
					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '文件不符合要求，请重新上传',
						})
					}
				})
			},
			// gotoList() {
			// 	uni.switchTab({
			// 		url: '../list/index'
			// 	})
			// }
		}
	}
</script>

<style lang="scss">
	.upload-btn {
		width: 345px;
		height: 80upx;
		margin: 100upx auto;
		color: #fff;
		font-size: 30upx;
		border: 0;
		border-radius: 10upx;
		background-color: $uni-color-primary;
	}

	.uploader-content {
		// height: ;
		margin-top: 40px;
	}

	.upload-btn:after {
		border: 0;
	}

	.tips {
		font-size: 26rpx;
		color: #777777;
	}
</style>
