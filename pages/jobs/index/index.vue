<template>
	<view>
		<uni-search-bar :radius="100" placeholder="搜索你想找的职位" cancelButton="none" @input="search"></uni-search-bar>
		<sl-filter :ref="'slFilter'" :isTransNav="true" :navHeight="0" :color="titleColor" :themeColor="themeColor" :menuList="menuList"
		 @result="result"></sl-filter>
		
		<mescroll-uni @init="mescrollInit" @down="downCallback" @up="upCallback" :up="upOption" class="message" height="100%">
			<view class="job-list">
				<navigator class="job-list-item" v-for="(job,index) in jobList" :url="'../detail/index?id=' + job.id" :key="index">
					<view class="job-title">
						<text class="title">{{ job.name }}</text>
						<text class="money">{{ job.salary_type_text }}: {{ job.salary_range_before }} ~ {{ job.salary_range_after }}</text>
					</view>
					<view class="job-info">
						<view class="base-info">
							<text class="icon-Frame1 iconfont" style="font-size: 26rpx; margin-right: 5rpx;"></text>
							<text class="info">{{ job.city.name }}</text>
							<!-- <text class="info" v-if="job.experience_range_before">{{ job.experience_range_before }}~{{ job.experience_range_after }}
							年工作经验</text> -->
							<text class="info">{{ job.edu_background_text }}</text>
						</view>
						<text class="time">{{ job.publish_at }}</text>
					</view>
					<view class="job-other">
						<uni-tag :text="job.company" size="small" :inverted="true" :circle="true" />
						<text class="state" v-if="job.has_posted === 1">已投递</text>
						<text class="nostate" v-else>未投递</text>
					</view>
				</navigator>
			</view>
		</mescroll-uni>
		<!-- <uni-load-more :status="more" style="margin-bottom: 80px;"></uni-load-more> -->

	</view>
</template>

<script>
	import job from '../../../api/job.js'
	import wybDropDown from '@/components/wyb-drop-down/wyb-drop-down.vue'
	import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue";
	export default {
		components: {
			wybDropDown
		},
		data() {
			return {
				more: 'noMore',
				titleColor: '#444',
				themeColor: '#4CA6F3',
				filterResult: '',
				menuList: [{
						'title': '工作地点',
						'key': 'region',
						'isMutiple': true,
						'detailTitle': '请选择工作范围（可多选）',
						'detailList': [{
							'title': '不限',
							'value': ''
						}, ]
					},
					{
						'title': '职位类型',
						'key': 'jobType',
						'isMutiple': true,
						'detailTitle': '请选择职位类型（可多选）',
						'detailList': [{
							'title': '不限',
							'value': ''
						}, ]
					}
				],
				jobList: [],
				cityList: ['中国', '美国', '巴西', '日本'],
				isLast: false,
				currentPage: 1,

				options: [{
						header: '栏目一',
						// contents在自定义开启时可以不用传
						custom: true // 该栏目开启自定义模式
					},
					{
						header: '栏目二',
						contents: ['选项5', '选项6', '选项7', '选项8'],
					}
				],
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					native: false // 启用系统自带的下拉组件,默认false;仅mescroll-body生效,mescroll-uni无效
				},
				upOption: {
					use: true, // 是否启用上拉加载; 默认true
					auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
					page: {
						num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
						size: 10 // 每页数据的数量,默认10
					},
					noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
					empty: {
						tip: '暂无数据'
					}
				},
				inputvalue:'',
				province_id:'',
				position_type_id:''
			}
		},
		onLoad() {
			job.getRegion().then(res => {
				if (res.code == 200) {
					this.menuList[0].detailList.push(...res.data.map(item => {
						return {
							title: item.name,
							value: item.id
						}
					}))
				} else if (res.code == 601) {
					uni.reLaunch({
						url: '../../index/index'
					})
				}

			}).catch(err => {})

			job.getPositionType().then(res => {

				res.data.forEach(item => {
					if (item.name != null) {
						this.menuList[1].detailList.push({
							title: item.name,
							value: item.id
						})
					}
				})
			}).catch(err => {})
			this.getPositionList()
		},
		methods: {
			// 获取产品列
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
			},
			// 下拉回调
			downCallback() {
				this.mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
			},
			// // 上拉回调
			upCallback(page) {
				var that = this;
				uni.showLoading({
					title: "数据加载中"
				})
				let pageNum = page.num; // 页码, 默认从1开始
				let pageSize = page.size; // 页长, 默每页10条
				// $api.request('post', '/api/commentsList', {
				// 	size: pageSize, //分页数量
				// 	page: pageNum, //  当前页数  
				// 	type: that.current
				// }, function(res) {
				// 	if (res.code === 200) {
				// 		let arr = res.data.list
				// 		uni.hideLoading()
				// 		//设置列表数据
				// 		if (page.num == 1) {
				// 			that.listData = []; //如果是第一页需手动置空列表
				// 		}
				// 		that.listData = that.listData.concat(arr); //追加新数据
				// 		that.mescroll.endByPage(arr.length, res.data.count);
				// 		// console.log(res.data.list)
				// 	} else {

				// 	}
				// }, function(err) {
				// 	console.log(err)
				// })

				job.getPositionList({
					page: pageNum,
					size: pageSize,
					name: that.inputvalue,
					province_id: that.province_id,
					position_type_id: that.position_type_id
				}).then(res => {
					if (res.code == 200) {
						// this.jobList.push(...res.data.list)
						// this.isLast = res.data.is_last
						// this.currentPage = res.data.page
						let arr = res.data.list
						uni.hideLoading()
						//设置列表数据
						if (page.num == 1) {
							that.jobList = []; //如果是第一页需手动置空列表
						}
						that.jobList = that.jobList.concat(arr); //追加新数据
						that.mescroll.endByPage(arr.length, res.data.total);
					} else if (res.code == 601) {
						uni.reLaunch({
							url: '../../index/index'
						})
					}
				}).catch(err => {})
			},




			search(val) {
				this.inputvalue = val.value
				this.mescroll.resetUpScroll(false);
			},
			getPositionList() {
				job.getPositionList().then(res => {
					if (res.code == 200) {
						this.jobList.push(...res.data.list)
						this.isLast = res.data.is_last
						this.currentPage = res.data.page
					} else if (res.code == 601) {
						uni.reLaunch({
							url: '../../index/index'
						})
					}
				}).catch(err => {})
			},
			result(val) {
				// console.log('filter_result:' + JSON.stringify(val));
				// this.filterResult = JSON.stringify(val, null, 2)
				this.position_type_id = val.jobType
				this.province_id = val.region
				this.mescroll.resetUpScroll(false);
			},
			getFilterPositionList(val) {
				job.getPositionList({
					name: val.value,
				}).then(res => {
					this.jobList.push(...res.data.list)
					this.isLast = res.data.is_last
					this.currentPage = res.data.page
				}).catch(err => {})
			},
		}
	}
</script>

<style lang="scss">
	uni-page-body {
		height: 100%;
		background-color: rgba($color: #efefef, $alpha: 0.5);
	}

	.pick-bar {
		display: flex;
		background: #eee;
		padding: 10px;

		uni-picker {
			width: 200upx;
		}
	}

	.job-list {
		padding-top: 20upx;

		.job-list-item {
			padding: 20upx 26upx;
			margin: 0 26upx 20upx;
			border-radius: 10upx;
			overflow: hidden;
			background-color: #fff;
			box-shadow: 0 0 5px 1px rgba($color: #000000, $alpha: 0.08);
		}

		// .job-list-item:last-child{
		// 	margin-bottom: 120rpx;
		// }
		.job-title,
		.job-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.job-title {
			font-size: 30upx;

			.title {
				// font-weight: bold;
				color: #333333;
			}

			.money {
				color: #1487D9;
				font-weight: bold;
				font-size: 28upx;
			}
		}

		.job-info {
			font-size: 18upx;
			// font-weight: bold;
			color: #777;
			margin: 10upx 0;

			.time {
				color: #999;
				font-size: 22upx;
			}

			.base-info {
				margin-top: 20upx;

				.info {
					margin-right: 20upx;
					font-size: 26upx;
				}
			}

		}

		.job-other {
			text-align: right;
			font-size: 26upx;
			font-weight: bold;

			.state {
				color: #AAAAAA;
			}

			.nostate {
				color: #ff557f;
			}
		}
	}
</style>
