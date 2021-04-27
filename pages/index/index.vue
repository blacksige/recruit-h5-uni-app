<template>
  <view class="index-box">
    <view class="index-form">
      <!-- <button class="opration-btn wx-btn">微信登录</button> -->
      <button
        class="opration-btn phone-btn"
        @click="phoneLogin()"
      >手机登录</button>
      <navigator
        class="tip"
        url="../register/index"
      >还没有账号？点击立刻注册</navigator>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      copyRightUrl: ''
    }
  },
  methods: {
    phoneLogin () {
      uni.navigateTo({
        url: '/pages/login/index'
      });
    },
  }
}
</script>

<style lang="scss">
.index-box {
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(../../static/bgtest.jpg);
}

.index-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 500upx;
}

.opration-btn {
  width: 80%;
  background: #ff65a3;
  color: #fff;
  border: 0;
  border-radius: 100upx;
  font-size: 36upx;
  margin-bottom: 60upx;
}

.opration-btn:after {
  border: 0;
}

.wx-btn,
.phone-btn {
  font-size: 34upx;
}
.wx-btn {
  background-color: $uni-color-success;
}

.phone-btn {
  background-color: $uni-color-primary;
}

.tip {
  text-align: center;
  font-size: 28upx;
  color: #a7b6d0;
}

.copy-right {
  position: absolute;
  bottom: 15px;
  width: 100%;
  color: #a7b6d0;
  font-size: 14px;
  text-align: center;
}
</style>
