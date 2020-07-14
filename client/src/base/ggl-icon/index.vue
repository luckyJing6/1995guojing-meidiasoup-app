/*
 * @Author: 郭靖 
 * @Date: 2020-06-03 11:24:19 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-03 17:09:36
 */
<template>
  <i :class="iconClass" :style="iconStyle" @click="iconTap"></i>
</template>

<script>
const prefixCls = 'ggl-icon'
export default {
  name: 'ggl-icon',
  props: {
    // icon类型
    type: {
      type: String,
      default: ''
    },
    // icon大小单位px
    size: {
      type: [String, Number],
      default: ''
    },
    // icon 颜色
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {

    }
  },
  computed: {
    iconClass() {
      return [
        `${prefixCls}`,
        `icon-${this.type}`
      ]
    },
    iconStyle() {
      return {
        color: this.color,
        fontSize: `${this.size}px`
      }
    }
  },
  methods: {
    iconTap() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="stylus" scoped></style>