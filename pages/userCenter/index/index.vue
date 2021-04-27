<template>
  <view class="">
    <view class="header-bar">
      <view class="welcome-title">
        <view
          class="avatar"
          @click="openChooseImg"
        >
          <image
            :src="image_url"
            class="img-avatar"
          ></image>
        </view>
        <view
          class=""
          v-if="list[1].value"
        >Hi，{{ list[1].value }}</view>
        <view
          class=""
          v-else
        >Hi，{{ list[2].value }}</view>
      </view>
    </view>
    <uni-list class="opration-list">
      <uni-list-item
        v-for="(item,index) in list"
        :key="index"
        :title="item.title"
        :thumb="item.thumb"
        thumb-size="medium"
        :rightText='item.value'
        :to="item.url"
        :link="item.title === '我的简历' ? 'switchTab' : 'navigateTo'"
      ></uni-list-item>
      <uni-list-item
        title="退出登录"
        thumb="/static/imgs/编组 8@2x.png"
        thumb-size="medium"
        clickable
        @click="quit"
      ></uni-list-item>
    </uni-list>
  </view>
</template>

<script>
import user from '../../../api/user.js'
export default {
  data () {
    return {
      resume_id: '',
      image_url: '/static/imgs/avatar-violet.png',
      copyRightUrl: '',

      thisUrl: '',
      isWeixin: false,
      list: [{
        title: '我的简历',
        thumb: '/static/imgs/编组 2@2x.png',
        url: '/pages/resume/list/index',
        value: ''
      }, {
        title: '修改姓名',
        thumb: '/static/imgs/编组 3@2x.png',
        url: '/pages/userCenter/editName/index',
        value: '王某某'
      }, {
        title: '联系方式',
        thumb: '/static/imgs/编组 4@2x.png',
        url: '/pages/userCenter/editPhone/index',
        value: '1578886852'
      }, {
        title: '修改密码',
        thumb: '/static/imgs/编组 5@2x.png',
        url: '/pages/userCenter/editPassword/index',
        value: ''
      }, {
        title: '修改邮箱',
        thumb: '/static/imgs/编组 6@2x.png',
        url: '/pages/userCenter/editEmail/index',
        value: '946455381@qq.com'
      },
        // {
        // 	title: '员工认证',
        // 	thumb: '/static/imgs/编组 7@2x.png',
        // 	url: '/pages/userCenter/certification/index',
        // 	value: ''
        // },
      ]
    }
  },
  onLoad () {
    this.init()
  },
  onShow () {
    this.init()
  },
  mounted () {

  },
  methods: {
    jump () {
      this.copyRightUrl = 'https://beian.miit.gov.cn/'
      window.location.href = this.copyRightUrl
    },
    init () {
      user.getUserInfo().then(res => {
        if (res.code == 200) {
          if (res.data.avatar) {
            this.image_url = res.data.avatar
          }
          this.user_id = res.data.id
          this.list[1].value = res.data.true_name
          this.list[2].value = res.data.mobile.toString()
          this.list[4].value = res.data.email
        } else if (res.code == 601) {
          uni.reLaunch({
            url: '../../index/index'
          })
        }

      })
    },
    // 上传图片

    openChooseImg () {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], //从相册选择，和摄像头功能，默认二者都有
        success: res => {
          // console.log(res)
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
                user.uploadHeadAvatar({
                  file_url: imgData.data.url,
                }).then(suv => {
                  if (suv.code == 200) {
                    this.image_url = imgData.data.url
                    uni.showToast({
                      title: "上传成功!",
                    })
                    console.log(this.image_url)
                  } else {
                    uni.hideLoading()
                    uni.showToast({
                      title: suv.msg,
                      icon: 'none'
                    })
                  }
                })
              } else {
                uni.showToast({
                  icon: 'none',
                  title: imgData.msg,
                })
                uni.hideLoading()
              }

            },
            fail: (err) => {
              console.log('错误的文件类型')
              uni.hideLoading()
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

    quit () {
      uni.showModal({
        title: '提示',
        content: '确定退出吗？',
        success: function (tip) {
          if (tip.confirm) {
            console.log('用户点击确定');
            user.logout().then(res => {
              uni.showToast({
                title: res.msg
              })
              if (res.code === 200) {
                setTimeout(function () {
                  uni.reLaunch({
                    url: '../../index/index'
                  })
                }, 1000)
              }
            }).catch(err => { })
          } else if (tip.cancel) {
            console.log('用户点击取消');
            uni.showToast({
              title: '已取消',
              icon: 'none'
            })
          }
        }
      });


    }
  }

}
</script>

<style lang="scss">
.welcome-title {
  display: flex;
  align-items: center;
  color: #fff;
  background-image: url(../../../static/imgs/背景.png);
  background-repeat: no-repeat;
  background-size: cover;

  .avatar {
    width: 250upx;
    height: 250upx;

    display: flex;
    justify-content: center;
    align-items: center;

    .img-avatar {
      width: 125rpx;
      height: 125rpx;
      border-radius: 50%;
    }
  }
}

.opration-list {
  /deep/ .uni-list-item__container {
    padding: 15px 15px;
  }
}

.copy-right {
  position: absolute;
  bottom: 15px;
  width: 100%;
  color: #9a9898;
  font-size: 14px;
  text-align: center;
}
</style>
