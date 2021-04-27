<template name="hlUploadImg">
	<view class="hlUploadCnt">
		<view class="imgBox">
			<!-- 图片 -->
			<block v-for="(item,index) in localImages" :key="index">
				<block v-if="(index+1)%columNum==1">
					<view class="imgItem noLeft" :style="styBox">
						<image :src="item" :mode="imgMode" @tap="tapImg(index)" :style="styImg"></image>
						<block v-if="model=='upload'">
							<text v-if="!dIconIsImg&&delBtn.icon" class="delBtn iconfont" :class="[delBtn.icon]" :style="styDelBtn" @tap.stop="delImg(index)"></text>
							<image v-if="dIconIsImg&&delBtn.icon" :src="delBtn.icon" class="delImg" :style="styDelBtn" @tap.stop="delImg(index)"></image>
							<view class="imgMask" v-if="uploadingMask=='imgMask'&& upProgress[index]>-1&&upProgress[index]<100">{{upProgress[index]}}%</view>
						</block>
					</view>
				</block>
				<block v-else-if="(index+1)%columNum==0">
					<view class="imgItem noRight" :style="styBox">
						<image :src="item" :mode="imgMode" @tap="tapImg(index)" :style="styImg"></image>
						<block v-if="model=='upload'">
							<text v-if="!dIconIsImg&&delBtn.icon" class="delBtn iconfont" :class="[delBtn.icon]" :style="styDelBtn" @tap.stop="delImg(index)"></text>
							<image v-if="dIconIsImg&&delBtn.icon" :src="delBtn.icon" class="delImg" :style="styDelBtn" @tap.stop="delImg(index)"></image>
							<view class="imgMask" v-if="uploadingMask=='imgMask'&&upProgress[index]>-1&&upProgress[index]<100">{{upProgress[index]}}%</view>
						</block>
					</view>
				</block>
				<block v-else>
					<view class="imgItem" :style="styBox">
						<image :src="item" :mode="imgMode" @tap="tapImg(index)" :style="styImg"></image>
						<block v-if="model=='upload'">
							<text v-if="!dIconIsImg&&delBtn.icon" class="delBtn iconfont" :class="[delBtn.icon]" :style="styDelBtn" @tap.stop="delImg(index)"></text>
							<image v-if="dIconIsImg&&delBtn.icon" :src="delBtn.icon" class="delImg" :style="styDelBtn" @tap.stop="delImg(index)"></image>
							<view class="imgMask" v-if="uploadingMask=='imgMask'&&upProgress[index]>-1&&upProgress[index]<100">{{upProgress[index]}}%</view>
						</block>
					</view>
				</block>

			</block>
			<!-- 选择按钮 -->
			<block v-if="model=='upload' && localImages.length<maxCount">
				<block v-if="(localImages.length+1)%columNum==1">
					<view class="selectBtn noLeft" :style="styUpBtn" @tap="chooseImg">
						<text class="iconfont" v-if="!sIconIsImg && selectBtn.icon" :class="[selectBtn.icon?selectBtn.icon:'']"></text>
						<image v-if="sIconIsImg && selectBtn.icon" :src="selectBtn.icon" class="selectImg" :style="sIconSty">
						
						<text class="selectText" v-if="selectBtn.text" :style="sTextSty">{{selectBtn.text}}</text>
					</view>
				</block>
				<block v-else-if="(localImages.length+1)%columNum==0">
					<view class="selectBtn noRight" :style="styUpBtn" @tap="chooseImg">
						<text class="iconfont" v-if="!sIconIsImg && selectBtn.icon" :class="[selectBtn.icon?selectBtn.icon:'']"></text>
						<image v-if="sIconIsImg && selectBtn.icon" :src="selectBtn.icon" class="selectImg" :style="sIconSty">
						
						<text class="selectText" v-if="selectBtn.text" :style="sTextSty">{{selectBtn.text}}</text>
					</view>
				</block>
				<block v-else>
					<view class="selectBtn" :style="styUpBtn" @tap="chooseImg">
						<text class="iconfont" v-if="!sIconIsImg && selectBtn.icon" :class="[selectBtn.icon?selectBtn.icon:'']"></text>
						<image v-if="sIconIsImg && selectBtn.icon" :src="selectBtn.icon" class="selectImg" :style="sIconSty">
						<text class="selectText" v-if="selectBtn.text" :style="sTextSty">{{selectBtn.text}}</text>
					</view>
				</block>
			</block>

		</view>
		<!-- 进度条 -->
		<view class="dialogMask" v-if="dialogShow" @touchmove.stop.prevent="noScroll">
			<view class="listBox">
				<view class="title">图片上传中...</view>
				<view class="row" v-for="(item,index) in localImages" :key="index">
					<text class="key">第{{index+1}}张</text>
					<view class="progressBox">
						<view class="progress" :style="{width:upProgress[index]+'%'}"></view>
					</view>
					<text v-if="upProgress[index]>99" class="iconfont icon-roundcheckfill"></text>
					<text v-if="upProgress[index]>-1&&upProgress[index]<100" class="percent ">{{upProgress[index]}}%</text>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import UPD from "./hlUploadImg.js";
	export default {
		name: 'hlUploadImg', //组件名称
		props: {
			model: {
				type: String,
				default: 'upload' //组件模式 upload上传    show展示
			},
			maxCount: {
				type: Number,
				default: 9 //最大上传数量
			},
			columNum: {
				type: Number,
				default: 3 //列数 每行显示几个图片
			},
			overSize: {
				type: Number,
				default: 0 //单张图片大小限制  0不限制
			},
			spaceBetween: {
				type: Number,
				default: 10 //图片间隔 
			},
			autoUpload: {
				type: Boolean,
				default: false //是否开启自动上传
			},
			imgList: { //多图传入图片url数组
				type: Array,
				default: function() {
					return []
				}
			},
			imgMode:{
				type:String,
				default:'aspectFill'			//图片显示模式  aspectFill 默认值
			},
			isAsync: {
				type: Boolean,
				default: false // 是否同步上传  false    true
			},
			tapModel: {
				type: String,
				default: 'none', //点击图片触发操作 none不做任何操作  preview浏览图片 replace替换图片
			},
			uploadingMask: {
				type: String,
				default: 'uniLoading', //上传时遮罩模式  imgMask图片遮罩   uniLoading uniapp的loading  dialogList模态框列表 
			},
			imgStyle: {
				type: Object,
				default: null //图片显示样式
			},
			selectBtn: { //上传按钮设置
				type: Object,
				default: function() {
					return {
						text: '上传图片',
						textSty:null,
						icon: 'icon-add',
						iconSty:null,
						btnSty: null
					}
				}
			},
			delBtn: { //图片删除按钮样式
				type: Object,
				default: function() {
					return {
						icon: 'icon-roundclosefill',
						style: {
							top:'-20rpx'
						}
					}
				}
			}

		},
		computed:{
			sIconIsImg:function(){
				return this.selectBtn.icon.indexOf('/')>-1
			},
			dIconIsImg:function(){
				return this.delBtn.icon.indexOf('/')>-1
			}
		},
		data() {
			return {
				localImages: [], //回显
				waitUploadImg: [], //待上传
				uploadedImages: [], //已上传
				styBox: {},
				styImg: {},
				styUpBtn: {},
				styDelBtn:{},
				upProgress: [0], //上传进度
				dialogShow: false,
				thisUpImg: [],
				sTextSty:{},
				sIconSty:{}
				
			};
		},
		methods: {
			// 移除图片
			delImg: function(e) {
				let _index = parseInt(e);
				let _delImage=this.localImages[_index];
				this.localImages.splice(_index, 1);
				this.waitUploadImg.splice(_index, 1);
				this.upProgress.splice(_index, 1);
				if (this.autoUpload) {
					this.uploadedImages.splice(_index, 1)
				}
				let _data = {
					allImages: this.uploadedImages,
					delImage: _delImage
				}
				this.$emit("delImg",_data)
				if(this.autoUpload){
					this.$emit("uploaded",{
						allImages:this.uploadedImages
					})
				}
				
			},
			// 点击图片
			tapImg: function(e) {
				let _index = parseInt(e)
				if(this.model=='upload'){
					if (this.tapModel == "preview") {
						uni.previewImage({
							urls: this.localImages,
							current: _index
						})
					} else if (this.tapModel == "replace") {
						this.replaceImg(_index)
					}else{
						
					}
					
				}else{
					uni.previewImage({
						urls: this.localImages,
						current: _index
					})
				}
				

			},
			// 替换图片
			replaceImg: function(e) {
				let _option = {
					limitNum: 1,
					selectedNum: 0,
					overSize: this.overSize
				}
				UPD.selectImg(_option).then(res => {
					let _oldImg = this.localImages[e];
					this.localImages[e] = res[0];
					this.waitUploadImg[e] = res[0];
					this.upProgress[e] = -1;
					this.$forceUpdate()
					if (this.autoUpload) {
						this.uploadImg().then(upres => {
							this.$emit("replaceImg", {
								index: e,
								oldImage: _oldImg,
								newImage: res[0],
								uploadedImage: this.thisUpImg[0]
							})
						})
					} else {
						this.$emit("replaceImg", {
							index: e,
							oldImage: _oldImg,
							newImage: res[0],
						})
					}
				}).catch(err => {
					console.error("图片替换失败");
				})
			},
			// 选择图片
			chooseImg: function() {
				return new Promise((resolve, reject) => {
					let _option = {
						limitNum: parseInt(this.maxCount),
						selectedNum: parseInt(this.localImages.length),
						overSize: this.overSize
					}
					UPD.selectImg(_option).then(res => {
						this.waitUploadImg = this.waitUploadImg.concat(res);
						this.localImages = this.localImages.concat(res);
						let _arr = this.waitUploadImg.filter(x => {
							return x != ''
						})
						let _data = {
							allImages: this.localImages,
							thisSelectImages: res,
							waitUploadImages: _arr
						}
						
						res.forEach(x => {
							this.upProgress.push(-1)
						})
						if (this.autoUpload) {
							this.$emit("chooseImg", _data)
							this.uploadImg()
						}
						resolve(_data)
					}).catch(err => {
						reject(err)
					})
				})

			},
			// 上传图片
			uploadImg: function() {
				let _this=this;
				return new Promise((resolve, reject) => {
					this.waitUploadImg.forEach((x, i) => {
						if (x) {
							this.upProgress[i] = 0
						}
					});
					if (this.uploadingMask == 'uniLoading') {
						uni.showLoading({
							title: '图片上传中',
							mask: true
						});
					} else if (this.uploadingMask == 'dialogList') {
						this.dialogShow = true;
					} else {

					}
					this.thisUpImg = [];
					if (this.isAsync) { //同步
						UPD.uploadImg(_this).then(res => {
							if (this.uploadingMask == 'uniLoading') {
								uni.hideLoading()
							} else if (this.uploadingMask == 'dialogList') {
								this.dialogShow = false;
							} else {

							}
							let _arr = [];
							this.waitUploadImg.forEach((x, i) => {
								if (x) {
									_arr.push(this.uploadedImages[i])
								}
							})
							let _data = {
								allImages: this.uploadedImages,
								thisUploadedImages: this.thisUpImg
							}
							if (this.autoUpload) {
								this.$emit("uploaded", _data)
							}
							resolve(_data);
							
						})
					} else { //异步
						let _arr = [];
						this.waitUploadImg.forEach((x, i) => {
							let _promise = UPD.uploadSingleImg(x, i, this).then(res => {

							})
							_arr.push(_promise)

						})
						Promise.all(_arr).then(res => {
							if (this.uploadingMask == 'uniLoading') {
								uni.hideLoading()
							} else if (this.uploadingMask == 'dialogList') {
								this.dialogShow = false;
							} else {

							}
							let _data = {
								allImages: this.uploadedImages,
								thisUploadedImages: this.thisUpImg
							}
							if (this.autoUpload) {
								this.$emit("uploaded", _data)
							}
							resolve(_data);
							
						})
					}
				})

			},
			noScroll() {

			}
		},
		created() {
			this.localImages = this.imgList;
			this.localImages.forEach((x, i) => {
				this.upProgress[i] = 100;
				this.waitUploadImg[i] = ''
			})
			// 异常检测
			if (this.maxCount == 1 && this.imgList.length > 1) {
				console.error("单图模式，传入图片不能超过1张");
				return;
			}
			setTimeout(() => {
				let view = uni.createSelectorQuery().in(this).select(".hlUploadCnt");
				view.fields({
					size: true
				}, data => {

					// 计算图片宽度  向下取整避免出现小数异常
					let _width = Math.floor((data.width - ((this.columNum - 1) * this.spaceBetween )) / this.columNum);
					this.styBox = {
						width: _width + 'px',
						height: _width + 'px',
						marginLeft: (this.spaceBetween/2) + 'px',
						marginRight: (this.spaceBetween/2) + 'px',
						marginBottom: this.spaceBetween + 'px',

					}
					
					this.styImg = {
						width: _width + 'px',
						height: _width + 'px',
						borderRadius: '0px'
					}
					
					// 设定图片展示样式
					if (this.imgStyle) {
						if (this.imgStyle.hasOwnProperty('height')) {
							// 有高度设定，合并对象后重设高度
							Object.assign(this.styImg, this.imgStyle);
							Object.assign(this.styBox, this.imgStyle);
							if (typeof this.imgStyle.height == 'string') {
								// 字符串类型高度 px或upx
								this.styBox.height = this.imgStyle.height
								this.styImg.height = this.imgStyle.height
							} else if (typeof this.imgStyle.height == 'number') {
								// 比例
								this.styBox.height = Math.floor(_width * this.imgStyle.height) + 'px'
								this.styImg.height = Math.floor(_width * this.imgStyle.height) + 'px'
							}
						} else {
							// 没有设定高度 直接合并对象
							this.styImg = Object.assign(this.styImg, this.imgStyle);
							this.styBox = Object.assign(this.styBox, this.imgStyle);
						}
					}
					
					// 设定选择按钮样式
					if (this.selectBtn.hasOwnProperty("btnSty") && (!!this.selectBtn.btnSty)) {
						Object.assign(this.styUpBtn, this.styBox, this.selectBtn.btnSty);
					} else {
						Object.assign(this.styUpBtn, this.styBox)
					}
					this.styDelBtn=this.delBtn.style;
					this.sIconSty=this.selectBtn.iconSty;
					this.sTextSty=this.selectBtn.textSty;
					
					// 小程序需要将对象转换为字符串
					this.styBox=UPD.ergodicObject(this.styBox)
					this.styImg=UPD.ergodicObject(this.styImg)
					this.styUpBtn=UPD.ergodicObject(this.styUpBtn)
					this.styDelBtn=UPD.ergodicObject(this.styDelBtn)
					this.sIconSty=this.sIconSty?UPD.ergodicObject(this.sIconSty):null
					this.sTextSty=this.sTextSty?UPD.ergodicObject(this.sTextSty):null
					this.$forceUpdate();
				}).exec();
			}, 0)

		}
	}
</script>

<style>
	@import "@/static/hl-uploadImg/iconfont.css";

	.hlUploadCnt {
		position: relative;
	}
	.hlUploadCnt .imgBox {
		display: flex;
		flex-wrap: wrap;
		position: relative;
	
		
	}
	.hlUploadCnt .imgBox .imgItem {
		box-sizing: border-box;
		position: relative;
		flex-grow: 0;
		flex-shrink: 0;
	}
	.hlUploadCnt .imgBox .imgItem image {
		width: 100%;
		height: 100%;
	
	}
	/*  字体图标删除按钮样式 */
	.hlUploadCnt .imgBox .imgItem .delBtn {
		position: absolute;
		z-index: 3;
		right: -20rpx;
		font-size: 40rpx;
		color: #F56C6C;
	}
	
	.hlUploadCnt .imgBox .imgItem .imgMask {
		position: absolute;
		z-index: 2;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.5);
		color: #FFFFFF;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	/*  图片删除按钮样式 */
	.hlUploadCnt .imgBox .imgItem .delImg{
		position: absolute;
		z-index: 3;
		width: 40upx;
		height: 40upx;
		right: -20upx;
	}
	.hlUploadCnt .imgBox .noLeft {
		margin-left: 0 !important;
	}
		
	.hlUploadCnt .imgBox .noRight {
		margin-right: 0 !important;
	}
		
	/*  选择按钮样式 */
	.hlUploadCnt .imgBox .selectBtn {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border: 1px solid #E9E9E9;
		color: #333333;
		
		
	}
	/*  图标样式 */
	.hlUploadCnt .imgBox .selectBtn .iconfont {
		color: inherit;
		font-size: 60rpx;
	}
	
	/*  文字样式 */
	.hlUploadCnt .imgBox .selectBtn .selectText {
		color: inherit;
		font-size: 28rpx;
	}
	.hlUploadCnt .imgBox .selectBtn .selectImg{
		width: 60upx;
		height: 60upx;
	}
	/*  上传遮罩层 */
	.dialogMask {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999999;
		display: flex;
		justify-content: center;
		align-items: center;
	
		
	}
	/*  列表容器 */
	.dialogMask .listBox {
		width: 80%;
		background-color: #FFFFFF;
		border-radius: 6upx;
		box-shadow: 0px 0px 13px 0px rgba(35, 24, 21, 0.13);
		display: flex;
		flex-direction: column;
		align-items: stretch;
		padding: 20upx 30upx;
		color: #333333;
	}
	.dialogMask .listBox .title {
		font-size: 28rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
	}
	
	.dialogMask .listBox .row {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;
	}
	/*  第N张 */
	.dialogMask .listBox .row .key {
		width: 15%;
		font-size: 24rpx;
	}
		
	.dialogMask .listBox .row .progressBox {
		flex-grow: 1;
		height: 10rpx;
		/* 进度条背景色 */
		background-color: #E9E9E9;
		
		
		
	}
	.dialogMask .listBox .row .progressBox .progress {
		height: 100%;
		/*  进度条前景色 */
		background-color: #409EFF;
	}	
	/* 成功图标 */
	.dialogMask .listBox .row .iconfont {
		width: 12%;
		text-align: center;
		color: #67C23A;
		font-size: 28rpx;
	}
		
	/*  百分比 */
	.dialogMask .listBox .row .percent {
		width: 12%;
		text-align: right;
		font-size: 24rpx;
	}
</style>
