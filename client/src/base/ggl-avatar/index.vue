/*
 * @Author: 郭靖 
 * @Date: 2020-06-03 14:58:43 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-03 15:52:01
 */
<template>
  <div @click="avatarTap" :class="avatarClass" :style="avatarStyle">
    <img class="ggl-avatar-img" :src="src" />
  </div>
</template>

<script>

const prefixCls = 'ggl-avatar'

export default {
  name: 'ggl-avatar',
  props: {
    // 是否圆形
    circle: {
      type: Boolean,
      default: true
    },
    // 大小px
    size: {
      type: [Number, String],
      default: 50
    },
    // url
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    avatarClass() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-is-circle`]: this.circle
        }
      ]
    },
    avatarStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`
      }
    }
  },
  methods: {
    avatarTap() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="stylus" scoped></style>