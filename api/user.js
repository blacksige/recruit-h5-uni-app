import { request } from '@/util/request.js'

const user = {}
// 注册
user.register = params => request(`/api/job/user/register`, 'POST', params, false, true)
// 发送短信接口
user.sendSMS = params => request(`/api/job/user/sendSMS`, 'POST', params, false, true)
// 登录
user.login = params => request(`/api/job/user/login`, 'POST', params, false, true)
// 退出登录
user.logout = params => request(`/api/job/user/logout`, 'get', params, false, true)
// 获取用户信息
user.getUserInfo = params => request(`/api/job/user/getUserInfo`, 'get', params, false, true)
// 修改姓名
user.setTrueName = params => request(`/api/job/user/setTrueName`, 'POST', params, false, true)
// 设置联系方式
user.setMobile = params => request(`/api/job/user/setMobile`, 'POST', params, false, true)
// 设置密码
user.setPassword = params => request(`/api/job/user/setPassword`, 'POST', params, false, true)
// 设置邮箱
user.setEmail = params => request(`/api/job/user/setEmail`, 'POST', params, false, true)

// 上传头像
user.uploadHeadAvatar = params => request(`/api/job/user/uploadHeadAvatar`, 'POST', params, false, true)

export default user