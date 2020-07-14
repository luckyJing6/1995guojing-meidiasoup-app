/*
 * @Author: 郭靖 
 * @Date: 2020-05-21 10:12:32 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-08 10:03:24
 */
<template>
  <div class="ggl-circle" :style="moonStyle">
    <ggl-avatar :size="width" v-if="url" :src="url"></ggl-avatar>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 60
    },
    bgcolor: {
      type: String,
      default: 'white'
    },
    shadowColor: {
      type: String,
      default: 'white'
    },
    shadowWidth: {
      type: Number,
      default: 15
    },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    moonStyle() {
      return {
        width: `${this.width}px`,
        height: `${this.width}px`,
        background: this.bgcolor,
        boxShadow: `0 0 ${this.shadowWidth}px ${this.shadowColor}`
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
