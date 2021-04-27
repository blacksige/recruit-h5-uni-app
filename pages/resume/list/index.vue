<template>
	<view class="resume-main">
		<uni-swipe-action class="resume-list">

			<uni-swipe-action-item v-for="(resume,index) in resumeList" :right-options="options" @click="onClick(resume.id)" :key="index">
				<navigator class="resume-list-item" :url="'../detail/index?id=' + resume.id" v-if="resume.type == '1000'">
					<view class="name_date">
						<view class="resume-title">{{ resume.position_name }}</view>
						<view class="resume-time">{{ resume.created_at }}</view>
					</view>
					<view class="resume-info">
						<text class="info" v-if="resume.name">{{ resume.name }}</text>
						<text class="info" v-if="resume.edu_background_text">{{ resume.edu_background_text }}</text>
						<text class="info textSize" v-if="resume.expect_salary_m_start">{{ resume.expect_salary_m_start }}~{{ resume.expect_salary_m_end }}</text>
					</view>
				</navigator>
				<view class="resume-list-item" v-else>
					<view class="name_date">
						<view class="resume-title" style="font-size: 32rpx;color: #999;">简历附件</view>
						<view class="resume-time">{{ resume.created_at }}</view>
					</view>
					<view class="resume-info">
						<text class="info" v-if="resume.name">{{ resume.name }}</text>
						<text class="info" v-if="resume.edu_background_text">{{ resume.edu_background_text }}</text>
						<text class="info textSize" v-if="resume.expect_salary_m_start">{{ resume.expect_salary_m_start }}~{{ resume.expect_salary_m_end }}</text>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<!-- <navigator class="resume-add" url="../add/index">
			<view class="add-icon">+</view>新增简历
		</navigator> -->
		<view class="icon-meiyougengduo iconfont" style="text-align: center;font-size: 80px;color: #808080; margin-top: 50%;"
		 v-if="!resumeList.length>0"></view>
		<uni-load-more :status="more" style="font-size: 20px;"></uni-load-more>

		<!-- <uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="input" message="成功消息" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup> -->
		<l-modal ref="customModal" modalTitle="选择添加简历方式" confirmText='添加简历' cancelText='导入简历' @onClickCancel="Cancel"
		 @onClickConfirm="Confirm">
			<p style="text-align: center;font-size: 30rpx;">你可以选择上传简历或者直接编辑简历</p>
		</l-modal>
	</view>
</template>

<script>
	import resume from '../../../api/resume.js'
	import lModal from '@/components/l-modal/l-modal.vue'
import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	import {
		uniSwipeAction,
		uniSwipeActionItem
	} from '@dcloudio/uni-ui'
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			lModal
		},


		data() {
			return {
				more: 'noMore',
				resumeList: [],
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		onShow() {
			resume.getMyResumeList().then(res => {
				if(res.code==200){
					this.resumeList = res.data
					console.log(this.res.data)
				}else if(res.code == 601){
					console.log('11')
					uni.reLaunch({
						url: '../../index/index'
					})
				}
			}).catch(err => {})
		},
		// 点击导入按钮
		onNavigationBarButtonTap(e) {
			this.$refs['customModal'].showModal()
			this.$refs['customModal'].showBotton(true)
			
		},
		methods: {
			Confirm() {
				uni.navigateTo({ //跳转页面
					url: "../add/index"
				})
			},
			Cancel() {
				uni.navigateTo({ //跳转页面
					url: "../upload/index"
				})
			},
			onClick(id) {
				
				uni.showModal({
					title: '提示',
					content: '你确定删除这个简历吗？',
					success: function (resu) {
						if (resu.confirm) {
							resume.delResume({
								resume_id:id
							}).then(res=>{
								if(res.code = 200){
									uni.showToast({
										title:res.msg ,
									})
									uni.reLaunch({
										url: '../list/index'
									})
								}else{
									uni.showToast({
										icon:'none',
										title:"删除失败" ,
									})
								}
							})
						} else if (resu.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
				
			},
		}
	}
</script>

<style lang="scss">
	.resume-main {
		padding-bottom: 100upx;
	}

	.resume-list {
		padding-top: 20upx;

		.resume-list-item {
			width: 100%;
			padding: 36upx;
			border-radius: 10upx;
			margin: 14rpx;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.08);
		}

		/deep/ .uni-swipe {
			.uni-swipe_button-group {
				height: 30%;
				top: 32%;
				
				.uni-swipe_button:first-child {
					border-radius: 15px 0 0 15px;
					display: none;
				}

				.uni-swipe_button:last-child {
					border-radius: 15px 15px 15px 15px;
				}
				
			}
		}
		.name_date{
			display: flex;
			justify-content: space-between;
		}
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
			.textSize{
				font-size: 24rpx;
			}
		}
	}

	.resume-add {
		font-size: 30upx;
		color: #007aff;

		.add-icon {
			display: inline-block;
			width: 40upx;
			height: 40upx;
			margin: 0 20upx;
			line-height: 36upx;
			text-align: center;
			color: #ffffff;
			background-color: #007aff;
			border-radius: 50%;
		}
	}
</style>
