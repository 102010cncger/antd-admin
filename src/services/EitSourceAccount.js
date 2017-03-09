import { request } from '../utils'

export async function query (params) {
  return request('/api-base/findByList', {
    method: 'get',
    data: params
  })
}

export async function create (params) {
  return request('/api-base/EitSourceAccountService', {
    method: 'post',
    data: params
  })
}

export async function remove (params) {
  return request('/api-base/EitSourceAccountService', {
    method: 'delete',
    data: params
  })
}

export async function update (params) {
  return request('/api-base/EitSourceAccountService', {
    method: 'put',
    data: params
  })
}
