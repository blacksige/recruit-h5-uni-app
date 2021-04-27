<template>
	<view v-if="isShowModal">
		<view class="masking" v-if="showMasking" :style="{'background-color': bgColor}" @click="showMask"></view>
		<view class="model-wraper">
			<view class="modal-title" v-if="modalTitle !== ''">
				{{modalTitle}}
			</view>
			<view class="modal-body">
				<slot></slot>
			</view>
			<view style="display: flex;">
				<view class="btn cancel" :style="{'color': cancelTextColor}" @click="handleCancel" v-if="bottontype">{{cancelText}}</view>
				<view class="btn confirm" :style="{'color': confirmTextColor}" @click="handleConfirm">{{confirmText}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否显示蒙层
			showMasking: {
				type: Boolean,
				default: true
			},
			// 蒙层背景色
			bgColor: {
				type: String,
				default: 'rgba(0,0,0,.6)'
			},
			// 模态框标题
			modalTitle: {
				type: String,
				default: ''
			},
			// 取消按钮文字
			cancelText: {
				type: String,
				default: ''
			},
			// 确定按钮文字
			confirmText: {
				type: String,
				default: ''
			},
			// 取消按钮文字颜色
			cancelTextColor: {
				type: String,
				default: '#5999FF'
			},
			// 确定按钮文字颜色
			confirmTextColor: {
				type: String,
				default: '#5999FF'
			},
			
		},
		data() {
			return {
				isShowModal: false,
				bottontype:false,
			}
		},
		methods: {
			showMask(){
				this.isShowModal = false
			},
			showModal() {
				this.isShowModal = true
				
			},
			showBotton(type){
				if(type == true){
					this.bottontype = true
				}else{
					this.bottontype = false
				}
				
			},
			handleCancel() {
				this.isShowModal = false
				this.$emit('onClickCancel', 'handleCancel')
			},
			handleConfirm() {
				this.isShowModal = false
				this.$emit('onClickConfirm', 'handleConfirm')
			}
		}
	}
</script>

<style scoped>
	.masking {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.model-wraper {
		width: 80%;
		background-color: #fff;
		border-radius: 16rpx;
		position: fixed;
		z-index: 1000;
		top: 50%;
		left: 50%;
		margin-top: -161rpx;
		margin-left: -300rpx;
		/* box-shadow: #dcdcdc 0px 0px 20rpx; */
	}
	.modal-title {
		height: 90rpx;
		line-height: 90rpx;
		width: 100%;
		text-align: center;
		font-size: 32rpx;
		color: #666;
	}
	.modal-body {
		padding: 30rpx 20rpx 40rpx 20rpx;
	}
	.btn {
		flex: 1;
		height: 90rpx;
		text-align: center;
		line-height: 90rpx;
		font-size: 32rpx;
		border-top: 1rpx solid #ddd;
	}
	.btn.cancel {
		flex: 1;
		border-right: 1rpx solid #dcdcdc;
	}
</style>
