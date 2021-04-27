<template>
	<view>
		<image class="zai-logo"  src="../../static/wufenjin.jpg"></image>
		<view class="culture-text">
			远信集团一直对员工的培训与发展非常重视。除了提供专业的学习平台外，还遵循着相对完善的培训机制。
		</view>
		<view class="culture-text">
			2017年11月11日，远信学院正式成立，标志着远信员工培训发展工作进入新的里程碑，意味着远信集团对人才培养的重视。远信学院始终以挖掘培养人才为目标，通过开展各类课程与培训，努力成为远信员工的成长顾问与业务团队的发展伙伴，为远信的现在培养人才，更为远信的明天培养人才。
		</view>
	</view>
</template>

<script>
	import common from '../../api/common.js'
	export default {
		data() {
			return {
				src: ''
			}
		},
		onLoad() {
			common.getEnterpriseCulture().then(res=>{
				if(res.code == 200){
					console.log(res)
				}else if(res.code == 601){
					uni.reLaunch({
						url:'../index/index'
					})
				}
				
			})
		},
		methods: {
			imageError: function(e) {
			    console.error('image发生error事件，携带值为' + e.detail.errMsg)
			}
		}
	}
</script>

<style>
	.zai-logo{
		width: 100%;
		height: 248upx;
	}
	.culture-text {
		text-indent: 70upx;
		line-height: 1.5;
		padding: 10upx 30upx;
		font-size: 30rpx;
	}
</style>
