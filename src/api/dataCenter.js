import http from '@api/http'
import { removeEmpty } from '@/utils'

export default {
  getList() {
    return http({
      url: `/esmanageapi/assetsmanager/data-center/`,
      method: 'get',
    })
  },
  getItemById(id) {
    return http({
      url: `/esmanageapi/assetsmanager/data-center/${id}/`,
      method: 'get',
    })
  },
  addItem(data) {
    return http({
      url: '/esmanageapi/assetsmanager/data-center/',
      method: 'post',
      data,
    })
  },
  update(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/data-center/${id}/`,
      method: 'put',
      data,
    })
  },
  updatePartOf(data, id) {
    return http({
      url: `/esmanageapi/assetsmanager/data-center/${id}/`,
      method: 'patch',
      data: removeEmpty(data),
    })
  },
  delete(id) {
    return http({
      url: `/esmanageapi/assetsmanager/data-center/${id}/`,
      method: 'delete',
    })
  },
  assetsCount() {
    return http({
      url: '/esmanageapi/assetsmanager/assets-count-by-dep/',
      method: 'get',
    })
  },
}
