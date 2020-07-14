/*
 * @Author: 郭靖 
 * @Date: 2020-06-08 16:28:15 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-10 18:26:23
 */
<template>
  <transition name="ggl-message-fade" @after-leave="handleAfterLeave">
    <div v-show="visible" :class="noticeClass" :style="noticeStyle">
      <ggl-icon class="ggl-message-icon" v-if="icon" :type="icon"></ggl-icon>
      <span v-if="text" class="ggl-margin-left-10">{{text}}</span>
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import GglIcon from '../ggl-icon'
const prefixCls = 'ggl-message'
export default {
  data() {
    return {
      visible: false,
      icon: 'info',
      type: 'info',
      duration: 3000,
      center: false,
      offsetTop: 20,
      closed: false,
      text: ''
    }
  },
  computed: {
    noticeClass() {
      return [
        `${prefixCls}`,
        `${prefixCls}-type-${this.type}`,
        {
          [`${prefixCls}-center`]: this.center
        }
      ]
    },
    noticeStyle() {
      return {
        top: `${this.offsetTop}px`
      }
    }
  },
  mounted() {
    this.startTimer()
  },
  methods: {
    // 离开
    handleAfterLeave() {
      this.$destroy(true)
      this.$el.parentNode.removeChild(this.$el)
    },
    // 开启定时器
    startTimer() {
      if (this.duration > 0) {
        this.clearTimer()
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close()
          }
        }, this.duration)
      }
    },
    // 关闭组件
    close() {
      this.closed = true
      this.visible = false
      this.clearTimer()
      if (typeof this.onClose === 'function')
        this.onClose(this)
    },
    // 清空定时器
    clearTimer() {
      if (this.timer) clearTimeout(this.timer)
      this.timer = null
    }
  },
  components: {
    GglIcon
  }
}
</script>

<style lang="stylus" scoped></style>