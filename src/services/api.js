import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function accountLogin(params) {
  return request('/api/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function register(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function changePassword(params) {
  return request('/api/user/change_password', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function getCPUInfo() {
  return request('/api/system/cpu');
}

export async function getMemInfo() {
  return request('/api/system/mem');
}

export async function getIP() {
  return request('/api/system/ip');
}

export async function getPPS() {
  return request('/api/system/pps');
}

export async function getSystemInfo() {
  return request('/api/system/all');
}

export async function taskPreCheck(params) {
  return request('/api/task/pre_check', {
    method: 'POST',
    data: params,
  });
}

export async function submitTask(params) {
  return request('/api/task/add', {
    method: 'POST',
    data: params,
  });
}

export async function getTaskList(params) {
  return request(`/api/task/list?${stringify(params)}`);
}

export async function getTaskDetail(id) {
  return request(`/api/task/detail?taskid=${id}`);
}

export async function getTaskDetailServices(id) {
  return request(`/api/task/detail/services?taskid=${id}`);
}

export async function getTaskDetailVulnerabilities(id) {
  return request(`/api/task/detail/vulnerabilities?taskid=${id}`);
}

export async function getPayloadsList() {
  return request('/api/payloads/all');
}
