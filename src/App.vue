<template lang="pug">
main
  router-view
</template>

<script>
import { computed, watch, onBeforeMount } from 'vue'
import router from '@/router'
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const access_token = computed(
      () => router.currentRoute.value.query.access_token
    )

    const setToken = (val) => {
      if (val) {
        localStorage.setItem('access_token', val)
      }
    }

    watch(access_token, (val) => {
      setToken(val)
    })

    onBeforeMount(async () => {
      setToken(access_token.value)
      await store.dispatch('setRoomList')
      await store.dispatch('setRackList')
      await store.dispatch('setRackMountList')
    })

    return {}
  },
}
</script>

<style>
body {
  margin: 0;
}
</style>
