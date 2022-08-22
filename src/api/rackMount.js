import http from '@api/http'
import { removeEmpty } from '@/utils'

export default {
  getList() {
    return http({
      url: '/esmanageapi/assetsmanager/rack-mount/',
      method: 'get',
    })
  },
  getItemById(id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-mount/${id}/`,
      method: 'get',
    })
  },
  addItem(data) {
    return http({
      url: '/esmanageapi/assetsmanager/rack-mount/',
      method: 'post',
      data,
    })
  },
  update(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-mount/${id}/`,
      method: 'put',
      data,
    })
  },
  updatePartOf(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-mount/${id}/`,
      method: 'patch',
      data: removeEmpty(data),
    })
  },
  delete(id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-mount/${id}/`,
      method: 'delete',
    })
  },
}
