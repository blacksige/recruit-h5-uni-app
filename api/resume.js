import { request } from '@/util/request.js'

const resume = {}
// 新增/编辑简历
resume.createResume = params => request(`/api/job/resume/createResume`, 'POST', params, false, true)
// 简历详情
resume.getResumeDetail = params => request(`/api/job/resume/getResumeDetail`, 'get', params, false, true)
// 简历列表
resume.getMyResumeList = params => request(`/api/job/resume/getMyResumeList`, 'get', params, false, true)
//获取地区
resume.getRegion = params =>request(`/api/job/common/getRegion`,'get',params,false,true)
//期望职位
resume.getExpectPosition = params =>request(`/api/job/common/getExpectPosition`,'get',params,false,true)
//上传简历
resume.resumeUpload = params =>request(`/api/job/resume/resumeUpload`,'POST',params,false,true)
//删除简历
resume.delResume = params =>request(`/api/job/resume/delResume`,'POST',params,false,true)

//简历新增（基本信息）
resume.createResumeBasic = params =>request(`/api/job/resume/createResumeBasic`,'POST',params,false,true)
//简历新增（工作经历）
resume.createResumeWork = params =>request(`/api/job/resume/createResumeWork`,'POST',params,false,true)
//简历新增（项目经历）
resume.createResumeProject = params =>request(`/api/job/resume/createResumeProject`,'POST',params,false,true)
//简历新增（教育经历）
resume.createResumeEdu = params =>request(`/api/job/resume/createResumeEdu`,'POST',params,false,true)
//简历新增（技能经历）
resume.createResumeSkill = params =>request(`/api/job/resume/createResumeSkill`,'POST',params,false,true)


//删除经历（项目）
resume.delResumeProject = params =>request(`/api/job/resume/delResumeProject`,'POST',params,false,true)
//删除经历（技能）
resume.delResumeSkill = params =>request(`/api/job/resume/delResumeSkill`,'POST',params,false,true)
//删除经历（工作）
resume.delResumeWork = params =>request(`/api/job/resume/delResumeWork`,'POST',params,false,true)
//删除经历（教育）
resume.delResumeSchool = params =>request(`/api/job/resume/delResumeSchool`,'POST',params,false,true)

export default resume