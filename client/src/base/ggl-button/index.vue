/*
 * @Author: 郭靖 
 * @Date: 2020-05-21 11:53:50 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-10 18:03:07
 */
<template>
  <button @click="itemTap" :disabled="disabled" :class="buttonClass" class="ggl-btn">
    <ggl-icon class="ggl-btn-icon" :color="iconColor" v-if="icon" :type="icon"></ggl-icon>
    <slot></slot>
  </button>
</template>

<script>
import GglIcon from '../ggl-icon'
import { oneOf } from 'common/js/util'
// 前缀
const prefixCls = 'ggl-btn'
export default {
  name: 'ggl-button',
  props: {
    // 路由跳转
    to: {
      type: String,
      default: ''
    },
    // 圆角
    round: {
      type: Boolean,
      default: false
    },
    // 圆形
    circle: {
      type: Boolean,
      default: false
    },
    // 主题
    type: {
      validator(value) {
        return oneOf(value, ['default', 'primary', 'success', 'warning', 'error'])
      },
      default: 'default'
    },
    // 大小
    size: {
      validator(value) {
        return oneOf(value, ['small', 'large', 'default'])
      },
      default: 'default'
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否存在阴影
    shadow: {
      type: Boolean,
      default: false
    },
    // icon
    icon: {
      type: String,
      default: ''
    },
    // iconColor
    iconColor: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  computed: {
    buttonClass() {
      return [
        `${prefixCls}-size-${this.size}`,
        `${prefixCls}-type-${this.type}`,
        {
          [`${prefixCls}-is-round`]: this.round,
          [`${prefixCls}-is-disabled`]: this.disabled,
          [`${prefixCls}-is-shadow`]: this.shadow,
          [`${prefixCls}-is-circle`]: this.circle
        }
      ]
    }
  },
  methods: {
    // 点击事件
    itemTap() {
      if (this.to && this.to !== '') {
        return this.$router.push(this.to)
      }
      this.$emit('click')
    }
  },
  components: {
    GglIcon
  }
}
</script>

<style lang="stylus" scoped></style>