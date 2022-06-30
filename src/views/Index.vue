<template lang="pug">
.index
  h1 基本
  router-link(to="/hello") 旋轉方塊
  h1 苦力怕
  router-link(to="/light") 光影
  router-link(to="/head") 轉動
  router-link(to="/walk") 走動
  h1 光點
  router-link(to="/point") 基本點點
  router-link(to="/snow") 雪花
  h1 苦力怕與光點
  router-link(to="/manandsnow") 苦力怕與雪
  h1 爆炸
  router-link(to="/explose") 爆炸
  router-link(to="/withExplose") 苦力怕爆炸
  h1 機房
  router-link(to="/server") 機房
</template>
<script>
export default {
  name: 'index',
}
</script>

<style lang="sass" scoped>
.index
  +size(100%,100%)
  a
    margin: 0 10px
</style>
