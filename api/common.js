import { request } from '@/util/request.js'

const common = {}
// 上传附件
common.upload = params => request(`/api/job/common/upload`, 'POST', params, false, true)

//企业文化接口
common.getEnterpriseCulture = params => request(`/api/job/common/getEnterpriseCulture`, 'get', params, false, true)
export default common