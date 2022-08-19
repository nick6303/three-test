<template lang="pug">
main
  router-view
</template>

<script>
import router from '@/router'
export default {
  name: 'App',
  setup() {
    const access_token = router.currentRoute.value.query.access_token
    if (access_token) {
      localStorage.setItem('access_token', access_token)
    }
    return {}
  },
}
</script>

<style>
body {
  margin: 0;
}
</style>
