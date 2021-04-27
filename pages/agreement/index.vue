<template>
	<view class="agreement-content">
		<view class="content">
			<text class="text">
				1月28日0-24时，黑龙江省新增新冠肺炎确诊病例21例，其中由哈尔滨市呼兰区无症状感染者转为确诊病例1例（绥化市望奎县12例，哈尔滨市呼兰区8例，哈尔滨市南岗区1例）；当日新增治愈出院确诊病例22例；当日新增无症状感染者16例（绥化市望奎县10例，哈尔滨市呼兰区3例，哈尔滨市利民开发区1例，哈尔滨市南岗区2例）；当日解除无症状感染者医学观察4例。

				自2021年1月10日以来，黑龙江省累计确诊病例554例，累计无症状感染者558例；累计治愈确诊病例出院59例；现有确诊病例495例（危重型2例，重型25例，普通型322例，轻型146例）；尚在医学观察无症状感染者537例。

				上述所有新增确诊病例和无症状感染者均是在集中隔离医学观察期间及开展扩大核酸检测主动筛查发现的，经当地专家组会诊后明确诊断，现已转至定点医疗机构进行隔离治疗或隔离医学观察。当地有关部门已对所有排查出的密切接触者落实管控措施。

				提醒大家要严格遵守新冠肺炎疫情防控各项要求，一旦出现发热、咳嗽等症状，请及时到当地定点医疗机构发热门诊就诊。要提高个人防护意识，保持良好防疫卫生习惯。（央视）
			</text>
		</view>
		<view class="bottom">
			<button class="btn1" @click="cacl()">取消</button>
			<button class="btn2" @click="ok()">确定</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods:{
			cacl(){
				uni.navigateTo({
					url: '../index/index'
				});
			},
			ok(){
				uni.navigateBack({
					//uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			},
		}
	}
</script>

<style lang="scss">
	.agreement-content {

		.content {
			margin: 24rpx;

			.text {
				text-indent: 30rpx;
			}
		}

		.bottom {
			display: flex;
			justify-content: space-between;
			background-color: #FFFFFF;
			position: fixed;
			width: 100%;

			.btn1 {
				height: 80rpx;
				line-height: 80rpx;
				width: 280rpx;
			}

			.btn2 {
				height: 80rpx;
				line-height: 80rpx;
				width: 360rpx;
				background-color: #56C4BD;
				color: white;
			}
		}
	}
</style>
