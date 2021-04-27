<template>
	<view>
			<view class="resume-item">
				<view class="resume-item-content">
					<view class="content-item" v-for="(item,index) in school" :key="index">
						<uni-forms :value="item" ref="form1">
							<uni-forms-item label="学校名称" name="name" :required = 'true'>
								<uni-easyinput type="text" v-model="item.schName" placeholder="请输入学校名称" />
							</uni-forms-item>
							<uni-forms-item label="在校时间" name="name" :required = 'true'>
								<view class="time-pickers">
									<picker class="time-picker" mode="date" placeholder="请选择起始日期" :value="item.start_at" :end="item.other" @change="stBindDateChange1">
										<view class="uni-input" v-if="item.start_at">{{item.start_at}}</view>
										<view v-else class="tipText">请选择开始时间</view>
									</picker>
									<view style="line-height: 36px;color: #808080">~</view>
									<picker class="time-picker" mode="date" :value="item.end_at" :start="item.start_at" @change="stBindDateChange2">
										<view class="uni-input" v-if="item.end_at">{{item.end_at}}</view>
										<view v-else class="tipText">请选择结束时间</view>
									</picker>
								</view>
							</uni-forms-item>
							<uni-forms-item label="学历" name="eduBackground" :required = 'true'>
								<picker @change="edbindPickerChange" :value="stindex" :range="eduLevel" range-key="label">
									<view class="uni-input">{{eduLevel[stindex].label}}</view>
								</picker>
							</uni-forms-item>
							<uni-forms-item label="是否统招" name="eduNature" :required = 'true'>
								<picker @change="nabindPickerChange" :value="naindex" :range="eduType" range-key="label">
									<view class="uni-input">{{eduType[naindex].label}}</view>
								</picker>
							</uni-forms-item>
							<uni-forms-item label="履历描述" name="description">
								<textarea v-model="item.description" :auto-height="true" maxlength=500 placeholder="请填写履历描述,文字描述不超过500字" />
								</uni-forms-item>
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
				thisResume_id:"",
				school: [
					{
								start_at: '',
								end_at: '',
								schName:'',
								edu_background	:'',
								background_type:'',
								description:'',
					},
				],
				other:currentDate,
				naindex:0,
				stindex:0,
				
				
				eduLevel: [
				{
					key:1000,
					label:'初中以下'
				},
				{
					key:1001,
					label:'初中'
				},
				{
					key:1002,
					label:'中专'
				},
				{
					key:1003,
					label:'高中'
				},
				{
					key:1004,
					label:'大专'
				},
				{
					key:1005,
					label:'本科'
				},
				{
					key:1006,
					label:'研究生'
				},
				{
					key:1007,
					label:'博士及以上'
				},
				],
				
				eduType: [{
					key:1001,
					label:'全日制'
				},{
					key:1002,
					label:'非全日制'
				},],
			};
		},
		onLoad() {
			this.thisResume_id = this.$route.query.id
		},
		onNavigationBarButtonTap() {
			this.school.forEach(item => {
					
				if (item.edu_background === "") {
					item.edu_background = this.eduLevel[0].key
					console.log(this.eduLevel[0].key)
				}
				if (item.background_type === "") {
					item.background_type = this.eduType[0].key
					console.log(this.eduType[0].key)
				}
			})
			let school = JSON.stringify(this.school)
			let thisResume_id = parseInt(this.thisResume_id) 
			resume.createResumeEdu({
				resume_id:thisResume_id,
				school:school
			}).then(res=>{
				if(res.code==200){
					// uni.showModal({
					// 	title: res.msg,
					// 	content: '是否继续添加？',
					// 	success: function (resu) {
					// 		if (resu.confirm) {
					// 			this.school = []
					// 		} else if (resu.cancel) {
					// 			uni.navigateBack({  //uni.navigateTo跳转的返回，默认1为返回上一级
					// 					delta: 1
					// 				});
					// 		}
					// 	}
					// });
					uni.showToast({
						title:"添加成功!" ,
					})
					this.school = []
					uni.navigateBack({  
						//uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				}else{
					uni.showToast({
						title:res.msg ,
					})
				}
			})
			// uni.navigateTo({
			// 	url: '../edit/index?id=' + this.resumeDetail.id
			// })
		
		},
		methods:{
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
			stBindDateChange1(e) {
				let val = e.target.value
				this.school.forEach(item=>{
						item.start_at = val
				})
			},
			stBindDateChange2(e) {
				let val = e.target.value
				this.school.forEach(item=>{
						item.end_at = val
				})
			},
			
			edbindPickerChange(e){
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.stindex = e.target.value
				this.school[0].edu_background = this.eduLevel[e.target.value].key
			},
			nabindPickerChange(e){
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.naindex = e.target.value	
				this.school[0].background_type = this.eduType[e.target.value].key
				
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
		.avatar-style{
			display: flex;
			justify-content: space-between;
			flex-direction: row;
			height: 80rpx;
			line-height: 80rpx;
			.avatar-content{
				margin-right: 34rpx;
				.addPhoto{
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
					.centerTitle{
						text-align: center;
					}
					.avatar{
						border-radius: 50%;
						width: 80rpx;
						height: 80rpx;
					}
				}
			}
			 
		}
		.resume-item-content {
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
				.tipText{
					color: #808080;
					padding-left: 10px;
				}
			}
			.uni-forms{
				padding: 0;
			/deep/	.uni-forms-item{
						.uni-forms-item__inner{
							align-items: center;
							.uni-forms-item__label{
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
