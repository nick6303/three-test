import { createStore } from 'vuex'
import roomApi from '@api/dataCenter'
import rackApi from '@api/rackModel'
import rackMountApi from '@api/rackMount'

const SET_ROOM_LIST = 'SET_ROOM_LIST'
const SET_RACK_LIST = 'SET_RACK_LIST'
const SET_RACKMOUNT_LIST = 'SET_RACKMOUNT_LIST'

export default createStore({
  state: {
    roomList: [],
    rackList: [],
    rackMountList: [],
  },
  mutations: {
    [SET_ROOM_LIST](state, val) {
      state.roomList = val
    },
    [SET_RACK_LIST](state, val) {
      state.rackList = val
    },
    [SET_RACKMOUNT_LIST](state, val) {
      state.rackMountList = val
    },
  },
  actions: {
    async setRoomList({ commit }) {
      const res = await roomApi.getList()
      commit(SET_ROOM_LIST, res)
    },
    async setRackList({ commit }) {
      const res = await rackApi.getList()
      commit(SET_RACK_LIST, res)
    },
    async setRackMountList({ commit }) {
      const res = await rackMountApi.getList()
      commit(SET_RACKMOUNT_LIST, res)
    },
  },
})
