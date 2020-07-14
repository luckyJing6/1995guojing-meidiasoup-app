/*
 * @Author: 郭靖 
 * @Date: 2020-03-19 10:01:22 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-07-13 22:20:56
 */
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  redirect: '/login',
  data() {
    return {

    }
  }
}
</script>

<style lang="stylus" scoped></style>
