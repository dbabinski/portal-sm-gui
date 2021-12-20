import request from '@/utils/reques'

export function login(data) {
  return request({
    url: '/sm-portal-server/autentykacja/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/sm-portal-server/autentykacja/logout',
    method: 'post'
  })
}
