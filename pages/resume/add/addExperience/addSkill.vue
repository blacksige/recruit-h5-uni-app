<template>
	<view>

		<view class="resume-item">
			<view class="resume-item-content">
				<view class="content-item" v-for="(item,index) in skill" :key="index">
					<uni-forms :value="item">
						<uni-forms-item label="技能名称" :required='true'>
							<uni-easyinput type="text" v-model="item.skillName" placeholder="请输入技能名称" />
						</uni-forms-item>
						<uni-forms-item label="使用时间">
							<view class="time-pickers">
								<uni-easyinput type="text" v-model="item.use_time" placeholder="请输入技能使用时长(月)" />
							</view>
						</uni-forms-item>
						<uni-forms-item label="技能水平">
							<!-- <view style="border: 2rpx solid #c8c7cc;border-radius: 8rpx;min-height: 72rpx;display: flex;align-items: center;padding-left: 20rpx;color: #777;" @click="openpicker(index)">请选择技能水平</view> -->
							<picker @change="skbindPickerChange" :value="skindex" :range="skillLevel" range-key="label">
								<view class="uni-input">{{skillLevel[skindex].label}}</view>
							</picker>

						</uni-forms-item>

						<!-- <lb-picker ref="picker" :name="'picker'+index" v-model='list'></lb-picker> -->
					</uni-forms>

				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import resume from '../../../../api/resume.js'
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				thisResume_id: "",
				skill: [{
					skillName: '',
					proficiency: '',
					use_time: '',
				}],
				other: currentDate,

				skillLevel: [{
					key: 1000,
					label: '一般'
				}, {
					key: 1001,
					label: '良好'
				}, {
					key: 1002,
					label: '熟练'
				}, {
					key: 1003,
					label: '精通'
				}, ],

				skindex: 0,
			};
		},
		onLoad() {
			this.thisResume_id = this.$route.query.id
		},
		onNavigationBarButtonTap() {
			this.skill.forEach(item => {
				// console.log(this.skill)
				if (item.proficiency === "") {
					item.proficiency = this.skillLevel[0].key
					console.log(this.skillLevel[0].key)
				}
			})
			let skill = JSON.stringify(this.skill)
			let thisResume_id = parseInt(this.thisResume_id)
			resume.createResumeSkill({
				resume_id: thisResume_id,
				skills: skill
			}).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: "添加成功!",
					})
					this.skill = []
					uni.navigateBack({
						//uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				} else {
					uni.showToast({
						title: res.msg,
					})
				}
			})
			// uni.navigateTo({
			// 	url: '../edit/index?id=' + this.resumeDetail.id
			// })

		},
		methods: {
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			skbindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.skindex = e.target.value
				this.skill[0].proficiency = this.skillLevel[e.target.value].key
			},
		}
	}
</script>

<style lang="scss">
	.resume-item {
		background: #fff;
		margin: 20upx;
		padding: 24rpx;
		border-radius: 12px;

		.resume-item-title {
			padding: 20upx;
			color: #09f;
			font-size: 32upx;
			font-weight: bold;
			box-shadow: 0 1px #eee;
			display: flex;
			justify-content: space-between;

			.add-btn {
				font-size: 30upx;
				color: #09f;
				margin: 0;

				&:after {
					border: none;
				}

				.add-icon {
					display: inline-block;
					width: 40upx;
					height: 40upx;
					line-height: 34upx;
					margin: 0 20upx;
					text-align: center;
					color: #ffffff;
					background-color: #09f;
					border-radius: 50%;
				}
			}
		}

		.avatar-style {
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			height: 80rpx;
			line-height: 80rpx;

			.avatar-content {
				margin-right: 34rpx;

				.addPhoto {
					width: 80rpx;
					height: 80rpx;
					margin: 0 auto;
					padding: 0;
					// background-image: url(../../../static/imgs/avatar-violet.png);
					// background-repeat: no-repeat;
					// background-size: cover;
					// background-color: #FFFFFF;
					border-radius: 50%;
					display: flex;
					justify-content: center;
					align-items: center;

					// border: 1px solid #8a989f;
					.centerTitle {
						text-align: center;
					}

					.avatar {
						border-radius: 50%;
						width: 80rpx;
						height: 80rpx;
					}
				}
			}

		}

		.resume-item-content {
			padding: 20upx;

			.content-item {
				margin-bottom: 20upx;

			}

			uni-picker {
				display: block;
				min-height: 72upx;
				line-height: 72upx;
				font-size: 28upx;
				cursor: pointer;
				border: 2upx solid #c8c7cc;
				border-radius: 8upx;
				box-sizing: border-box;
				border-color: rgb(229, 229, 229);
				background-color: rgb(255, 255, 255);

				.uni-input {
					padding-left: 20upx;
				}
			}

			uni-textarea {
				width: auto;
				min-height: 200upx;
				padding: 20upx;
				border: 2upx solid #c8c7cc;
				border-color: rgb(229, 229, 229);
				background-color: rgb(255, 255, 255);
			}

			.time-pickers {
				display: flex;
				justify-content: space-between;

				.time-picker {
					width: 49%;
				}

				.tipText {
					color: #808080;
					padding-left: 10px;
				}
			}

			.uni-forms {
				/deep/ .uni-forms-item {
					.uni-forms-item__inner {
						align-items: center;

						.uni-forms-item__label {
							width: 72px !important;
							justify-content: center !important;
							padding: 0;
							// border: 1px solid #ababab;
							border-radius: 12px;
							height: 24px;
							line-height: 24px;
						}
					}
				}
			}
		}
	}
</style>
