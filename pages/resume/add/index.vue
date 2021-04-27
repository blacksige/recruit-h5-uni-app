<template>
	<view class="add-box">
		<view class="resume-item">
			<view class="resume-item-title avatar-style">
				<view>形象照片</view>
				<view class="avatar-content">
					<view class="addPhoto" @tap="openChooseImg">
						<image v-if="imgUrl" :src="imgUrl" class="avatar"></image>
						<image v-else :src="imgUrl2" class="avatar"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="resume-item" v-if="!ifexShow">
			<view class="resume-item-title">基本信息</view>
			<view class="resume-item-content">
				<uni-forms :value="resumeData" ref="form" :rules="Rules">
					<uni-forms-item label="姓名" name="name" :required='true'>
						<uni-easyinput type="text" v-model="resumeData.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item label="电话" name="mobile" :required='true'>
						<uni-easyinput type="text" v-model="resumeData.mobile" placeholder="请输入电话" />
					</uni-forms-item>
					<uni-forms-item label="性别" name="sex" :required='true'>
						<picker @change="sexbindPickerChange" :value="sexIndex" :range="sexList" range-key="label">
							<view class="uni-input">{{sexList[sexIndex].label}}</view>
						</picker>
					</uni-forms-item>

					<uni-forms-item label="最高学历" name="edu_background" :required='true'>
						<picker @change="edbindPickerChange" :value="stindex" :range="eduLevel" range-key="label">
							<view class="uni-input">{{eduLevel[stindex].label}}</view>
						</picker>
					</uni-forms-item>

					<uni-forms-item label="期望职位" name="expect_position_id" :required='true'>
						<picker @change="expect_position_idbindPickerChange" :value="expect_position_idIndex" :range="positionList"
						 range-key="name">
							<view class="uni-input">{{positionList[expect_position_idIndex].name}}</view>
						</picker>
					</uni-forms-item>
					<uni-forms-item label="期望月薪" name="expect_salary_m_start" :required='true'>
						<view class="time-pickers">
							<uni-easyinput type="text" v-model="resumeData.expect_salary_m_start" placeholder="下限月薪(元)" class="time-picker"
							 @change="salaryChange1" />
							<view style="line-height: 36px;color: #808080">-</view>
							<uni-easyinput type="text" v-model="resumeData.expect_salary_m_end" placeholder="上限月薪(元)" class="time-picker"
							 @change="salaryChange2" />
						</view>
					</uni-forms-item>
					<uni-forms-item label="期望地点" name="expect_city_id" :required='true'>
						<view class="time-pickers">
							<picker class="time-picker" :value="expect_city_idIndex1" @change="cityChange1" :range="countryList" range-key="name">
								<view class="uni-input" v-if="ifCityShow">{{countryList[expect_city_idIndex1].name}}</view>
								<view class="tipText" v-else>选择省份</view>
							</picker>
							<view style="line-height: 36px;color: #808080">-</view>
							<picker class="time-picker" :value="expect_city_idIndex2" @change="cityChange2" :range="cityList" range-key="name"
							 :disabled="!ifCityShow">
								<view class="uni-input" v-if="cityList[expect_city_idIndex2].name">{{cityList[expect_city_idIndex2].name}}</view>
								<view class="tipText" v-else>选择城市</view>
							</picker>
						</view>
					</uni-forms-item>
				</uni-forms>
				<button type="primary" @click="nextAction" class="submit-btn" v-if="!ifexShow">提交，下一步</button>
			</view>

		</view>
		<view class="resume-item" v-if="ifexShow">
			<view class="resume-item-title">
				<view>工作经历</view>
				<view class="add-btn" @click="addWorkExperience">
					<view class="icon-add-fill iconfont add-icon"></view>
					<view class="add-text">添加</view>
				</view>
			</view>
			<view class="resume-item-content">
				<view class="content-item" v-for="(item,index) in work" :key="index">
					<view class="name_date">
						<view class="this_name">{{item.company_name}}</view>
						<view class="this_date">{{item.start_at}}&nbsp;至&nbsp;{{item.end_at}}
							<text class="icon-dayu1 iconfont" @click="editExperiencewr(item)"></text>
						</view>
					</view>
					<view class="this_title">工作内容:</view>
					<text class="this_description">&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}</text>
				</view>
			</view>
		</view>
		<view class="resume-item" v-if="ifexShow">
			<view class="resume-item-title">
				<view>项目经历</view>
				<view class="add-btn" @click="addProjectExperience">
					<view class="icon-add-fill iconfont add-icon"></view>
					<view class="add-text">添加</view>
				</view>
			</view>
			<view class="resume-item-content">
				<view class="content-item" v-for="(item,index) in projects" :key="index">
					<view class="name_date">
						<view class="this_name">{{item.name}}</view>
						<view class="this_date">{{item.start_at}}&nbsp;至&nbsp;{{item.end_at}}
							<text class="icon-dayu1 iconfont" @click="editExperiencepr(item)"></text>
						</view>
					</view>
					<view class="this_title">项目描述:</view>
					<text class="this_description">&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}</text>
				</view>

			</view>
		</view>
		<view class="resume-item" v-if="ifexShow">
			<view class="resume-item-title">
				<view>教育经历</view>
				<view class="add-btn" @click="addSchoolExperience">
					<view class="icon-add-fill iconfont add-icon"></view>
					<view class="add-text">添加</view>
				</view>
			</view>
			<view class="resume-item-content">
				<view class="content-item" v-for="(item,index) in school" :key="index">

					<view class="name_date">
						<view class="this_name">{{item.school_name}}</view>
						<view class="this_date">{{item.start_at}}&nbsp;至&nbsp;{{item.end_at}}
							<text class="icon-dayu1 iconfont" @click="editExperiencesc(item)"></text>
						</view>
					</view>
					<view style="margin-top: 12rpx;color: #808080;font-size: 24rpx;">
						<span>学历：</span><span>{{item.edu_background_text}}</span>
						<span style="margin-left: 10rpx;margin-right: 10rpx;">|</span>
						<span>学制：</span><span>{{item.background_type_text}}</span>
					</view>
					<view class="this_title">履历描述:</view>
					<text class="this_description">&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}</text>
				</view>

			</view>
		</view>
		<view class="resume-item" v-if="ifexShow">
			<view class="resume-item-title">
				<view>专业技能</view>
				<view class="add-btn" @click="addSkill">
					<view class="icon-add-fill iconfont add-icon"></view>
					<view class="add-text">添加</view>
				</view>
			</view>
			<view class="resume-item-content">
				<view class="content-item" v-for="(item,index) in skill" :key="index">
					<view class="space_bw">
						<view style="margin-top: 12rpx;"><span>{{item.name}}</span></view>
						<text class="icon-dayu1 iconfont" @click="editExperiencesk(item)"></text>
					</view>
					<view style="margin-top: 12rpx;font-size: 30rpx;color: #808080;">
						<span>使用时长：</span><span>{{item.use_time}}</span>
						<span style="margin-left: 14rpx;margin-right: 14rpx;">|</span>
						<span>技能水平：</span><span>{{item.skilled_text}}</span>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import resume from '../../../api/resume'
	import hlUploadImg from '../../../components/hl-uploadImg/hlUploadImg.js'
	import pathToBase64 from '../../../js_sdk/mmmm-image-tools/index.js'

	components: {
		hlUploadImg
	}
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				Rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入姓名',
						}, ]
					},
					// 对email字段进行必填验证
					mobile: {
						rules: [{
							required: true,
							errorMessage: '请输入11位电话号码',
						}]
					}
				},


				thisResume_id: '',

				ifexShow: false,
				ifCityShow: false,
				imgUrl: "",
				imgUrl2: "../../../static/imgs/avatar-violet.png",
				other: currentDate,
				thisUrl: '',
				percent: 0,
				loading: false,
				disabled: false,

				resumeData: {
					name: '',
					avatar: '',
					sex: '',
					mobile: '',
					edu_background: '',
					expect_province_id: '',
					expect_city_id: '',
					expect_salary_m_start: '',
					expect_salary_m_end: '',
					expect_position_id: '',
				},
				work: [],
				projects: [],
				school: [],
				skill: [],

				stindex: 0,
				sexIndex: 0,
				expect_position_idIndex: 0,
				expect_city_idIndex: 0,
				expect_city_idIndex1: 0,
				expect_city_idIndex2: 0,

				sexList: [{
						key: 1000,
						label: '未选择',
					}, {
						key: 1001,
						label: '男',
					},
					{
						key: 1002,
						label: '女'
					}
				],
				countryList: [{
					id: '',
					name: ''
				}],
				cityList: [{
					id: '',
					name: ''
				}],

				positionList: [{
					id: '',
					name: ''
				}],
				eduLevel: [{
						key: 1000,
						label: '初中以下'
					},
					{
						key: 1001,
						label: '初中'
					},
					{
						key: 1002,
						label: '中专'
					},
					{
						key: 1003,
						label: '高中'
					},
					{
						key: 1004,
						label: '大专'
					},
					{
						key: 1005,
						label: '本科'
					},
					{
						key: 1006,
						label: '研究生'
					},
					{
						key: 1007,
						label: '博士及以上'
					},
				],

				popup: true,
				citySelect: true
			}
		},
		onLoad() {
			resume.getExpectPosition().then(res => {
				this.positionList = res.data
				// res.data.forEach(item=>{
				// 	this.positionList.push({
				// 		id:item.id,
				// 		name:item.name
				// 	})
				// })
			})
			resume.getRegion().then(res => {
				this.countryList = res.data
			})
		},
		onShow() {
			// if(this.ifexShow){

			// }
			resume.getResumeDetail({
				id: this.thisResume_id
			}).then(res => {
				if (res.code == 200) {
					let arr = res.data[0]
					console.log(arr)
					this.work = arr.work
					this.school = arr.school
					this.skill = arr.skill
					this.projects = arr.projects
				} else {
					console.log("err")
				}
				console.log(this.work, this.school, this.skill, this.projects)
			})
		},
		// mounted(){
		// 	document.querySelector('.uni-page-head-hd').style.display = 'none'
		// },
		onNavigationBarButtonTap() {
			if (this.ifexShow) {
				uni.showToast({
					title: "添加成功!",
				})
				setTimeout(function() {
					uni.reLaunch({
						url: '../list/index'
					})
				}, 1000)
			} else {
				uni.showToast({
					title: "您的简历未填写完整",
					icon: 'none'
				})
			}
		},
		methods: {

			openChooseImg() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择，和摄像头功能，默认二者都有
					success: res => {
						console.log(res)
						uni.showLoading({
							title: '图片上传中'
						});
						if (res.tempFiles[0].type !== "image/jpeg" && res.tempFiles[0].type !== "image/png") {
							uni.showToast({
								title: '上传文件仅支持jpg/png的图片',
								icon: 'none',
								duration: 2000
							});
							return false
						}
						if (res.tempFiles[0].size > 2097152) {
							uni.showToast({
								title: '上传文件大小不可超过2M',
								icon: 'none',
								duration: 2000
							});
							return false
						}
						let loca = window.location
						if (loca.hostname === "localhost") {
							this.thisUrl = 'http://zp-test.lansee.net'
						} else {
							this.thisUrl = loca.origin
						}
						uni.uploadFile({
							url: this.thisUrl + '/api/job/common/upload',
							filePath: res.tempFilePaths[0], // 图片本地路径
							fileType: "image",
							name: 'file', // 写死
							// 请求头一定要加，否则 iOS 图片上传会失败 安卓 可有可无
							header: {
								// 'content-type': 'multipart/form-data',
								'Token': uni.getStorageSync("recruit_token")
							},
							formData: {
								name: 'file' // 后端接口要求的名称
								// file: tempFilePath   // 这里一定不能加 file 加了 iOS 图片上传会失败 安卓无此问题
							},
							success: (uploadFileRes) => {
								console.log(JSON.parse(uploadFileRes.data));
								let imgData = JSON.parse(uploadFileRes.data)
								if (imgData.code == 200) {
									this.imgUrl = imgData.data.url
									this.resumeData.avatar = this.imgUrl
									uni.showToast({
										title: "上传成功!",
									})

								} else {
									uni.hideLoading()
									uni.showToast({
										icon: 'none',
										title: imgData.msg,
									})
								}

							},
							fail: (err) => {
								uni.hideLoading()
								console.log('错误的文件类型')
							}
						});

					},
					fail: (err) => {
						uni.showToast({
							icon: 'none',
							title: '图片不符合要求，请重新上传',
						})
					}
				});
			},
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


			sexbindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.sexIndex = e.target.value
				this.resumeData.sex = this.sexList[e.target.value].key
			},

			expect_position_idbindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.expect_position_idIndex = e.target.value
				this.resumeData.expect_position_id = this.positionList[e.target.value].id
			},
			edbindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.stindex = e.target.value
				this.resumeData.edu_background = this.eduLevel[this.stindex].key
			},

			cityChange1(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.ifCityShow = true
				this.expect_city_idIndex1 = e.target.value
				resume.getRegion({
					pid: this.countryList[e.target.value].id
				}).then(res => {
					this.cityList = res.data
					this.resumeData.expect_province_id = JSON.stringify(this.countryList[e.target.value].id)
					this.citySelect = false
				})

			},
			cityChange2(e) {
				this.expect_city_idIndex2 = e.target.value
				this.resumeData.expect_city_id = JSON.stringify(this.cityList[e.target.value].id)
			},


			addWorkExperience() {
				// this.work.push({
				// 	start_at: '',
				// 	end_at: '',
				// 	memo:'',
				// 	company_name:''
				// })
				uni.navigateTo({
					url: './addExperience/addWork?id=' + this.thisResume_id,
				});
			},
			addProjectExperience() {
				// this.projects.push({
				// 	start_at: '',
				// 	end_at: '',
				// 	description:'',
				// 	name:''
				// })
				uni.navigateTo({
					url: './addExperience/addProject?id=' + this.thisResume_id,
				});
			},
			addSchoolExperience() {
				// this.school.push({
				// 	start_at: '',
				// 	end_at: '',
				// 	schName:'',
				// 	eduBackground:'',
				// 	eduNature:'',
				// 	memo:'',
				// })
				uni.navigateTo({
					url: './addExperience/addSchool?id=' + this.thisResume_id,
				});
			},
			addSkill() {
				// this.skill.push({
				// 	skillName:'',
				// 	proficiency:'',
				// 	use_time:'',
				// })
				uni.navigateTo({
					url: './addExperience/addSkill?id=' + this.thisResume_id,
				});
			},

			nextAction(form) {
				this.$refs.form.submit().then(res => {
					console.log('表单数据信息：', res);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
				console.log(this.resumeData)
				if (this.resumeData.sex === "") {
					this.resumeData.sex = this.sexList[0].key
				}
				if (this.resumeData.expect_position_id === "") {
					this.resumeData.expect_position_id = this.positionList[0].id
					console.log(this.positionList[0].id)
				}
				if (this.resumeData.edu_background === "") {
					this.resumeData.edu_background = this.eduLevel[0].key
					console.log(this.eduLevel[0].id)
				}
				if (this.resumeData.expect_city_id === "") {
					this.resumeData.expect_city_id = this.cityList[0].id
					console.log(this.cityList[0].id)
				}
				this.$refs.form.submit().then((res) => {
					resume.createResumeBasic(this.resumeData).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: "保存成功!",
							})
							this.ifexShow = true
							this.thisResume_id = res.data.resume_id
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000,
							});
						}
					}).catch(err => {
						uni.showToast({
							title: err.msg,
							icon: 'none',
							duration: 2000,
						});
					})
				})
			},

			editExperiencewr(item) {
				console.log(item)
				uni.navigateTo({
					url: '../edit/editExperience/editWork?item=' + encodeURIComponent(JSON.stringify(item)),
				});
			},
			editExperiencepr(item) {
				console.log(item)
				uni.navigateTo({
					url: '../edit/editExperience/editProject?item=' + encodeURIComponent(JSON.stringify(item)),
				});
			},
			editExperiencesc(item) {
				console.log(item)
				uni.navigateTo({
					url: '../edit/editExperience/editSchool?item=' + encodeURIComponent(JSON.stringify(item)),
				});
			},
			editExperiencesk(item) {
				console.log(item)
				uni.navigateTo({
					url: '../edit/editExperience/editSkill?item=' + encodeURIComponent(JSON.stringify(item)),
				});
			},

			submitForm(form) {
				// 手动提交表单
				console.log(this.resumeData)
				if (this.resumeData.sex === "") {
					this.resumeData.sex = this.sexList[0].key
				}
				if (this.resumeData.expect_position_id === "") {
					this.resumeData.expect_position_id = this.positionList[0].id
					console.log(this.positionList[0].id)
				}
				if (this.resumeData.expect_city_id === "") {
					this.resumeData.expect_city_id = this.cityList[0].id
					console.log(this.cityList[0].id)
				}
				this.school.forEach(item => {
					if (item.eduBackground === "") {
						item.eduBackground = this.eduLevel[0].key
						console.log(this.eduLevel[0].key)
					}
					if (item.eduNature === "") {
						item.eduNature = this.eduType[0].key
						console.log(this.eduType[0].key)
					}
				})
				this.skill.forEach(item => {
					console.log(this.skill)
					if (item.proficiency === "") {
						item.proficiency = this.skillLevel[0].key
						console.log(this.skillLevel[0].key)
					}
				})
				this.$refs.form.submit().then((res) => {
					this.resumeData.work = JSON.stringify(this.work)
					this.resumeData.projects = JSON.stringify(this.projects)
					this.resumeData.school = JSON.stringify(this.school)
					this.resumeData.skills = JSON.stringify(this.skill)
					resume.createResume(this.resumeData).then(res => {
						if (res.code == 200) {
							uni.showToast({
								title: "添加成功!",
							})
							setTimeout(function() {
								uni.reLaunch({
									url: '../list/index'
								})
							}, 1000)
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none',
								duration: 2000,
							});
						}
					}).catch(err => {
						uni.showToast({
							title: err.msg,
							icon: 'none',
							duration: 2000,
						});
					})
				})
			}
		}
	}
</script>
<style lang="scss">
	.resume-item {
		background: #fff;
		margin: 20upx 0;

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
				color: #007aff;
				margin: 0;
				display: flex;
				align-items: center;

				.add-icon {
					margin: 0 8upx;
					text-align: center;
					font-size: 32upx;
				}

				.add-text {
					margin: 0 8upx;
					text-align: center;
					font-size: 30upx;
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
			padding: 24upx;

			.content-item {
				margin-bottom: 20upx;
				border: 2rpx solid #E5E5E5;
				padding: 10rpx;
				border-radius: 10rpx;

				.name_date {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.this_name {
						font-size: 30rpx;
						color: #333;
					}

					.this_date {
						font-size: 24rpx;
						color: #808080;

						.icon-dayu1 {
							font-size: 18rpx;
							margin-left: 6rpx;
						}
					}
				}

				.this_title {
					margin: 20rpx 0 20rpx 0;
					color: #808080;
					font-size: 28rpx;
				}

				.this_description {
					text-indent: 60rpx;
					color: #808080;
					font-size: 28rpx;
				}

				.space_bw {
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: #333;

					.icon-dayu1 {
						font-size: 18rpx;
						margin-left: 6rpx;
					}
				}
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

	.submit-btn {
		width: 400upx;
		margin: 30upx auto;
		color: #fff;
		font-size: 30upx;
		border: 0;
		border-radius: 100upx;
		background-color: $uni-color-primary;
	}

	.submit-btn:after {
		border: 0;
	}

	.tipText {
		color: #808080;
		padding-left: 10px;
	}
</style>
