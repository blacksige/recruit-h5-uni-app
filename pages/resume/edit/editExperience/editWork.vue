<template>
	<view>
			<view class="resume-item">
				<view class="resume-item-content">
					<view class="content-item" v-for="(item,index) in work" :key="index">
						<view class="time-pickers">
							<picker class="time-picker" mode="date" placeholder="请选择起始日期" :value="item.start_at" :end="item.other" @change="workBindDateChange1">
								<view class="uni-input" v-if="item.start_at">{{item.start_at}}</view>
								<view v-else class="tipText">请选择开始时间</view>
							</picker>
							<view style="line-height: 36px;color: #808080">~</view>
							<picker class="time-picker" mode="date" :value="item.end_at" :start="item.start_at" @change="workBindDateChange2">
								<view class="uni-input" v-if="item.end_at">{{item.end_at}}</view>
								<view v-else class="tipText">请选择结束时间</view>
							</picker>
						</view>
						<uni-easyinput style="margin: 10upx 0; " type="text" v-model="item.company_name" placeholder="请填写公司名称(必填)" />
						<textarea v-model="item.description" :auto-height="true" maxlength=500 placeholder="请填写工作内容,文字描述不超过500字" />
						</view>
				</view>
				<view class="btn-style">
					<button type="warn" class="deleted" @click="deleted">删除此项</button>
					<button type="primary" class="sure" @click="edited">确认修改</button>
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
				edItem:"",
				work: [
					{
							start_at: '',
							end_at: '',
							description:'',
							company_name:''
					}
				],
				other:currentDate,
			};
		},
		onLoad: function (option) {
		    const item = JSON.parse(decodeURIComponent(option.item));
			this.edItem = item
			console.log(this.edItem)
			this.work[0].start_at = this.edItem.start_at
			this.work[0].end_at = this.edItem.end_at
			this.work[0].description = this.edItem.description
			this.work[0].company_name = this.edItem.company_name
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
			workBindDateChange1(e) {
				let val = e.target.value
				this.work.forEach(item=>{
				
						item.start_at = val
				
				})
			},
			workBindDateChange2(e) {
				let val = e.target.value
				this.work.forEach(item=>{
				
						item.end_at = val
				
				})
			},
			deleted(){
				resume.delResumeWork({
					resume_id:this.edItem.resume_id,
					work_id:this.edItem.id
				}).then(res=>{
					uni.showToast({
						title:res.msg ,
					})
					uni.navigateBack({
						//uni.navigateTo跳转的返回，默认1为返回上一级
						delta: 1
					});
				}).catch(err=>{
					uni.showToast({
						title:err.msg ,
					})
				})
			},
			edited() {
				let work = JSON.stringify(this.work)
				resume.createResumeWork({
					resume_id:this.edItem.resume_id,
					id:this.edItem.id,
					work:work
				}).then(res=>{
					if(res.code==200){
						uni.showToast({
							title:'修改成功' ,
						})
						this.work = []
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
				.tipText{
					color: #808080;
					padding-left: 10px;
				}
			}
			.uni-forms{
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
	.btn-style{
		display: flex;
		align-items: center;
		justify-content: space-between;
		.deleted{
			width: 30%;
			margin: 30upx auto;
			color: #fff;
			font-size: 30upx;
			border: 0;
		}
		.sure{
			width: 30%;
			margin: 30upx auto;
			font-size: 30upx;
			border: 0;
		}
	}
</style>
