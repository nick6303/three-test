import http from '@api/http'
import { removeEmpty } from '@/utils'

export default {
  getList() {
    return http({
      url: '/esmanageapi/assetsmanager/rack-model/',
      method: 'get',
    })
  },
  getItemById(id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-model/${id}/`,
      method: 'get',
    })
  },
  addItem(data) {
    return http({
      url: '/esmanageapi/assetsmanager/rack-model/',
      method: 'post',
      data,
    })
  },
  update(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-model/${id}/`,
      method: 'put',
      data,
    })
  },
  updatePartOf(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-model/${id}/`,
      method: 'patch',
      data: removeEmpty(data),
    })
  },
  delete(id) {
    return http({
      url: `/esmanageapi/assetsmanager/rack-model/${id}/`,
      method: 'delete',
    })
  },
}
