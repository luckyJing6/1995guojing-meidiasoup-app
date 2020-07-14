/*
 * @Author: 郭靖 
 * @Date: 2020-06-09 14:06:08 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-16 11:31:19
 */
<template>
  <div :class="modalClass">
    <div>
      <transition name="ggl-modal-opacity">
        <div v-show="visible" class="ggl-modal-dask"></div>
      </transition>
      <transition @after-leave="handleAfterLeave" name="ggl-modal-fade">
        <div v-show="visible" class="ggl-modal-main">
          <div class="ggl-modal-title">
            <div class="ggl-modal-title-main">
              <ggl-icon :color="iconColor" v-if="icon" :type="icon" class="ggl-modal-icon"></ggl-icon>
              <span class="ggl-modal-title-text">{{title}}</span>
            </div>
            <ggl-icon @click="close" v-if="closable" type="close" class="ggl-modal-close"></ggl-icon>
          </div>
          <div class="ggl-modal-content">
            <slot v-if="$slots.content" name="content"></slot>
            <div v-else>
              <div>{{content}}</div>
              <div class="ggl-modal-input" v-if="type === 'prompt'">
                <ggl-input v-model="value"></ggl-input>
              </div>
            </div>
          </div>
          <div>
            <slot v-if="$slots.footer" name="footer"></slot>
            <div v-else class="ggl-modal-footer">
              <ggl-button
                v-if="type !== 'alert'"
                :round="round"
                :shadow="shadow"
                @click="cancelTap"
                size="small"
                :type="cancelBtnType"
                class="ggl-modal-btn"
              >{{cancelBtnText}}</ggl-button>
              <ggl-button
                :round="round"
                :shadow="shadow"
                @click="okTap"
                size="small"
                :type="okBtnType"
              >{{okBtnText}}</ggl-button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import GglIcon from '../ggl-icon'
import GglButton from '../ggl-button'
import GglInput from '../ggl-input'

const prefixCls = 'ggl-modal'
export default {
  name: 'ggl-modal',
  props: {
    // alert confirm prompt
    type: {
      type: String,
      default: 'prompt'
    },
    // 图标
    icon: {
      type: String,
      default: 'info'
    },
    // 图标颜色
    iconColor: {
      type: String,
      default: '#2d8cf0'
    },
    // 是否显示关闭按钮
    closable: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: '标题名称'
    },
    // 内容
    content: {
      type: String,
      default: '我是测试内容'
    },
    // 确定按钮
    okBtnText: {
      type: String,
      default: '确定'
    },
    // 确定按钮样式
    okBtnType: {
      type: String,
      default: 'primary'
    },
    // 取消按钮
    cancelBtnText: {
      type: String,
      default: '取消'
    },
    // 确定按钮样式
    cancelBtnType: {
      type: String,
      default: 'default'
    },
    // button的样式
    round: {
      type: Boolean,
      default: false
    },
    // btn shadow
    shadow: {
      type: Boolean,
      default: false
    },
    // 剧中显示
    center: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      removed: false,
      visible: false,
      value: ''
    }
  },
  computed: {
    modalClass() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-center`]: this.center
        }
      ]
    }
  },
  methods: {
    // 离开
    handleAfterLeave() {
      if (this.removed) {
        this.$destroy(true)
        this.$el.parentNode.removeChild(this.$el)
      }
    },
    // 展开
    show() {
      this.visible = true
    },
    // 关闭
    close() {
      this.visible = false
      if (typeof this.onClose === 'function')
        this.onClose(this)
    },
    // remove
    remove() {
      if (!this.removed) {
        this.visible = false
        this.removed = true
      }
    },
    // 点击取消按钮
    cancelTap() {
      this.$emit('cancelTap', this.value)
      if (typeof this.onCancelTap === 'function')
        this.onCancelTap(this)
    },
    // 点击确定按钮
    okTap() {
      console.log('modal ok tap')
      this.$emit('okTap', this.value)
      if (typeof this.onOkTap === 'function')
        this.onOkTap(this)
    }
  },
  components: {
    GglButton,
    GglInput,
    GglIcon
  }
}
</script>

<style lang="stylus" scoped></style>