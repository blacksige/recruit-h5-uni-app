<template>
	<view>
		<view class="job-info-item">
			<view class="name-salary">
				<view class="job-name">{{ jobDetail.name }}</view>
				<view class="job-salary" v-if="jobDetail.salary_type_text">{{ jobDetail.salary_type_text }}: {{ jobDetail.salary_range_before }}
					~ {{ jobDetail.salary_range_after }}</view>
			</view>
			<view class="cityContent">
				<text class="icon-Frame1 iconfont" style="font-size: 28rpx; margin-right: 5rpx;"></text>
				<view class="job-city">{{ jobDetail.cityName }}</view>
			</view>

		</view>
		<uni-card>
			<view class="yx-disc" @click="jump()">远想企业介绍</view>
		</uni-card>

		<view class="job-info-item">
			<view class="title">职位详情</view>
			<text class="detail">
				{{ jobDetail.job_description }}
			</text>
		</view>
		<view class="job-info-item">
			<view class="title">任职要求</view>
			<text class="detail">
				{{ jobDetail.require }}
			</text>
		</view>
		<view class="btns">
			<button class="post-btn" type="primary" size="mini" @click="postResume">投递简历</button>
		</view>
		<ming-pop ref="pop" direction="center" :is_close="false" :is_mask="true" :width="100">
			<view class="pop-title">请选择投递简历</view>
			<view class="resume-list">
				<radio-group @change="radioChange">
					<label class="resume-list-item" v-for="resume in resumeList" :key="resume.id">
						<!-- <view class="resume-title">{{ resume.position_name }}</view>
						<view class="resume-time">{{ resume.created_at }}</view>
						<view class="resume-info">
							<text class="info">{{ resume.user_name }}</text>
							<text class="info">{{ resume.work_year }}年工作经验</text>
							<text class="info">{{ resume.edu_background_text }}</text>
							<text class="info">{{ resume.expect_salary_m_start }}~{{ resume.expect_salary_m_end }}</text>
						</view>
						 -->
						<view class="name_date" v-if="resume.type == '1000'">
							<view class="resume-title">{{ resume.position_name }}</view>
							<view class="resume-time">{{ resume.created_at }}</view>
						</view>
						<view class="name_date" v-else>
							<view class="resume-title" style="font-size: 32rpx;color: #999;">简历附件</view>
							<view class="resume-time">{{ resume.created_at }}</view>
						</view>
						<view class="resume-info">
							<text class="info" v-if="resume.name">{{ resume.name }}</text>
							<text class="info" v-if="resume.edu_background_text">{{ resume.edu_background_text }}</text>
							<text class="info textSize" v-if="resume.expect_salary_m_start">{{ resume.expect_salary_m_start }}~{{ resume.expect_salary_m_end }}</text>
						</view>

						<view class="resume-radio">
							<radio :value="resume.id + ''" :checked="resume.id === resumeId" />
						</view>
					</label>
				</radio-group>
			</view>
			<view class="btns send">
				<button class="post-btn2" type="primary" size="mini" @click="confirmPost">确认投递</button>
			</view>
		</ming-pop>

	</view>
</template>

<script>
	import job from '../../../api/job.js'
	import resume from '../../../api/resume.js'
	export default {
		data() {
			return {
				jobDetail: {},
				resumeList: [],
				positionId: '',
				resumeId: ''
			}
		},
		onShow() {
			this.positionId = this.$route.query.id
			job.getPositionDetail({
				id: this.positionId
			}).then(res => {
				if(res.code == 200){
					this.jobDetail = res.data
					this.jobDetail.cityName = this.jobDetail.city.shortname
				}else if(res.code == 601){
					uni.reLaunch({
						url:'../index/index'
					})
				}
			}).catch(err => {})
		},
		methods: {
			jump() {
				uni.showModal({
					title: '提示',
					content: '确定跳转吗？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							uni.switchTab({
								url: '../../culture/index'
							})
						}
					}
				})
			},
			postResume() {
				//打开弹窗
				this.resumeId = ''
				resume.getMyResumeList().then(res => {
					this.resumeList = res.data.map(item => {
						item.checked = false
						return item
					})
					if (this.resumeList.length != 0 && this.resumeList != "")
						this.$refs.pop.show()
					else {
						uni.showModal({
							title: '提示',
							content: '请先添加简历',
							confirmText:'去添加',
							success: function(res) {
								if (res.confirm) {
									uni.switchTab({
										url:'../../resume/list/index'
									})
								} else if (res.cancel) {
									console.log('');
								}
							}
						});
					}
				}).catch(err => {})
			},
			confirmPost() {
				job.postPosition({
					position_id: this.positionId,
					resume_id: this.resumeId
				}).then(res => {
					this.$refs.pop.close()
					setTimeout(function() {
						uni.showModal({
							title:res.msg
						})
					}, 300)
					uni.reLaunch({
						url: '../index/index'
					})
				}).catch(err => {})
			},
			radioChange: function(evt) {
				this.resumeId = evt.target.value
			}
		}
	}
</script>

<style lang="scss">
	.yx-disc {
		color: #333333;
	}

	.job-info-item {
		border-top: 2upx solid #EEEEEE;
		padding: 20upx;

		&:first-child {
			border-bottom: 1px solid #EEEEEE;
		}

		.name-salary {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.job-salary {
				font-size: 30upx;
				color: #09f;
				font-weight: bold;
			}

			.job-name {
				font-size: 40upx;
				font-weight: bold;
			}
		}

		.cityContent {
			display: flex;
			align-items: center;
			color: #777;

			.job-city {
				font-size: 30upx;
				color: #777;
				padding: 10upx 0;
			}
		}

		.title {
			height: 70upx;
			line-height: 70upx;
			color: #333;
			font-size: 32upx;
		}

		.detail {
			font-size: 28upx;
			color: #777777;
		}
	}

	.btns {
		text-align: center;

		.post-btn {
			width: 90%;
			height: 80rpx;
			line-height: 40px;
			font-size: 30rpx;
			margin-top: 60px;
			border-radius: 60upx;
		}

		.post-btn2 {
			height: 70upx;
			line-height: 70upx;
			width: 450upx;
			border-radius: 70upx;
		}
	}

	.pop-title {
		height: 80upx;
		line-height: 80upx;
		font-size: 30upx;
		color: #fff;
		text-align: center;
		border-radius: 20upx;
		background: #007AFF;
	}

	.resume-list {
		padding-top: 20upx;

		.resume-list-item {
			display: block;
			position: relative;
			padding: 30upx;
			margin: 0 0 20upx;
			border-radius: 26upx;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.08);
		}

		.name_date {}

		.resume-title {
			font-size: 34rpx;
			color: #333333;
		}

		.resume-time {
			color: #999;
			font-size: 20upx;
			margin: 10upx 0 15upx;
		}

		.resume-info {
			font-size: 26upx;
			font-weight: bold;
			color: #333333;
			margin: 16rpx 0;

			.info {
				margin: 10upx 30upx 10upx 0;
			}

			.textSize {
				font-size: 24rpx;
			}
		}

		.resume-radio {
			position: absolute;
			top: 50%;
			right: 60upx;
			transform: translateY(-50%);
		}
	}
</style>
