import { request } from '@/util/request.js'

const job = {}
// 投递简历
job.postPosition = params => request(`/api/job/position/postPosition`, 'POST', params, false, true)
// 获取职位详情
job.getPositionDetail = params => request(`/api/job/position/getPositionDetail`, 'GET', params, false, true)
// 职位列表
job.getPositionList = params => request(`/api/job/position/getPositionList`, 'GET', params, false, true)
// 获取职位分类
job.getPositionType = params => request(`/api/job/common/getPositionType`, 'GET', params, false, true)
// 获取期望职位
job.getExpectPosition = params => request(`/api/job/common/getExpectPosition`, 'GET', params, false, true)
// 获取地区
job.getRegion = params => request(`/api/job/common/getRegion`, 'GET', params, false, true)

export default job