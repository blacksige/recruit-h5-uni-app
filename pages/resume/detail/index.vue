<template>
	<view class="refume-box">
		<view class="resume-detail">
			<view class="headerData">
				<image class="resume-avatar" mode="aspectFit" :src="resumeDetail.avatar" v-if="resumeDetail.avatar"></image>
				<image class="resume-avatar" mode="aspectFit" v-else :src="defaultImg"></image>
				<view class="resume-name">{{ resumeDetail.name }}</view>
			</view>
			<view class="resume-phone">手机号：{{ resumeDetail.mobile}}</view>
			<view class="resume-email" v-if="resumeDetail.email">邮箱：{{ resumeDetail.email}}</view>
			<view class="resume-sex">性别：{{ resumeDetail.sex_text}}<span v-if="resumeDetail.now_address">|</span>{{ resumeDetail.now_address }}</view>
			<view class="resume-sex">最高学历：{{ resumeDetail.edu_background_text}}</view>
			<view class="resume-expect">求职意向：{{ resumeDetail.expect_position_name}} </view>
			<view class="resume-expect">期望薪资： {{ resumeDetail.expect_salary_m_start }}~{{ resumeDetail.expect_salary_m_end }}元</view>
			<view class="resume-section">
				<view class="section-title">工作经历</view>
				<view class="section-detail">
					<view class="section-item" v-for="(work,index) in resumeDetail.work" :key="index">
						<view class="item-name">
							<text class="name-left">{{ work.company_name}}</text>
							<text class="name-right">{{ work.start_at}}~{{ work.end_at}}</text>
						</view>
						<view class="item-position">
							{{ work.position }}
						</view>
						<view class="item-desc">
							<view style="margin-bottom: 5px;color: #888;">职位描述：</view>
							<text class="description">{{ work.description }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="resume-section">
				<view class="section-title">项目经历</view>
				<view class="section-detail">
					<view class="section-item" v-for="(project,index) in resumeDetail.projects" :key="index">
						<view class="item-name">
							<text class="name-left">{{ project.name}}</text>
							<text class="name-right">{{ project.start_at}}~{{ project.end_at}}</text>
						</view>
						<view class="item-position">
							{{ project.position_name }}
						</view>
						<view class="item-desc">
							<view style="margin-bottom: 5px;color: #888;">项目描述：</view>
							<text class="description">{{ project.description }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="resume-section">
				<view class="section-title">教育经历</view>
				<view class="section-detail">
					<view class="section-item" v-for="(school,index) in resumeDetail.school" :key="index">
						<view class="item-name">
							<text class="name-left">{{ school.school_name}}</text>
							<text class="name-right">{{ school.start_at}}~{{ school.end_at}}</text>
						</view>
						<view class="item-position" style="margin-bottom: 0px;color: #888;">
							<span v-if="school.edu_background_text">学历：{{ school.edu_background_text }}</span>
							<span style="margin-left: 10rpx;margin-right: 10rpx;">|</span>
							<span v-if="school.background_type_text">({{school.background_type_text}})</span>
						</view>
						<view class="item-desc">
							<view style="margin-bottom: 5px;color: #888;">经历描述：</view>
							<text class="description">{{ school.description }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="resume-section" style="margin-bottom: 20px;">
				<view class="section-title">专业技能</view>
				<view class="section-detail">
					<view class="section-item" v-for="(skill,index) in resumeDetail.skill" :key="index">
						<view class="item-desc" v-if="skill.name">
							{{ skill.name }}
						</view>
						<view class="item-desc" v-if="skill.use_time">
							技能使用时长(月)：{{ skill.use_time}}
						</view>
						<view class="item-desc" v-if="skill.skilled_text">
							技能熟练度：{{ skill.skilled_text }}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import resume from '../../../api/resume.js'
	export default {
		data() {
			return {
				resumeDetail: {},
				resumeId: '',
				defaultImg: '/static/imgs/avatar-violet.png'
			}
		},
		onLoad() {
			this.resumeId = this.$route.query.id
			this.compile()
		},
		// 点击编辑按钮
		onNavigationBarButtonTap(e) {
			console.log(this.resumeDetail)
			uni.navigateTo({
				url: '../edit/index?id=' + this.resumeDetail.id
			})
		},
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			this.back();
			return true;
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 2
				});
			},
			compile() {
				resume.getResumeDetail({
					id: this.resumeId
				}).then(res => {
					if (res.code == 200) {
						this.resumeDetail = res.data[0]
						console.log(this.resumeDetail)
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						})
					}
					// if(this.resumeDetail.skill.skilled = "1000"){

					// }
				}).catch(err => {})
			}
		}
	}
</script>

<style lang="scss">
	.refume-box {
		border-radius: 34upx;
		margin: 30upx 30upx 0;
		padding-top: 50upx;
		background-color: #FFFFFF;
		color: #333333;

		.resume-detail {
			position: relative;
			height: 100%;
			border-radius: 34upx;
			padding-top: 2upx;

			.headerData {
				padding: 0 20rpx;
				display: flex;
				flex-direction: row;
				align-items: center;

				.resume-name {
					margin-left: 20px;
					color: #333333;
					font-weight: bold;
				}

				.resume-avatar {
					width: 120upx;
					height: 120upx;
					border-radius: 50%;
					background-color: #eeeeee;
				}

			}

			.resume-phone,
			.resume-email,
			.resume-sex,
			.resume-expect {
				margin: 16upx 25upx;
				color: #777;
				font-size: 26upx;
			}

			.resume-section {
				padding: 20upx 26upx;
				margin-top: 20upx;
				border-radius: 20upx;
				overflow: hidden;
				// box-shadow: 0 0 5px 2px rgba($color: #000000, $alpha: 0.08);

				.section-title {
					font-size: 32upx;
					font-weight: bold;
					padding-bottom: 20upx;
					border-bottom: 1px solid #EEEEEE;
				}

				.section-item {
					margin-top: 20rpx;
					border: 2rpx solid #E5E5E5;
					padding: 10rpx;
					border-radius: 10rpx;
					.item-name {
						display: flex;
						justify-content: space-between;
						padding: 10px 0;

						.name-left {
							font-size: 30upx;

						}

						.name-right {
							font-size: 20upx;
							color: #888;
						}
					}

					.item-position {
						font-size: 28upx;

					}

					.item-desc {
						padding: 5px 0;
						font-size: 28upx;

						.description {
							color: #808080;
						}
					}
				}
			}
		}
	}
</style>
