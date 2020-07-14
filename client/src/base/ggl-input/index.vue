/*
 * @Author: 郭靖 
 * @Date: 2020-06-09 15:06:20 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-06-12 15:10:23
 */
<template>
  <div :class="inputClass">
    <!-- 前置图标 -->
    <ggl-icon v-if="prefixIcon" class="ggl-input-icon ggl-prefix-icon" :type="prefixIcon"></ggl-icon>
    <input
      :disabled="disabled"
      :value="value"
      @input="inputChange"
      class="ggl-input-inner"
      :type="type"
    />
    <!-- 后置图标 -->
    <ggl-icon class="ggl-input-icon ggl-suffix-icon" :type="suffixIcon" v-if="suffixIcon"></ggl-icon>
  </div>
</template>

<script>
import GglIcon from '../ggl-icon'

const prefixCls = 'ggl-input'
export default {
  name: 'ggl-input',
  props: {
    // 文本类型
    type: {
      type: String,
      default: 'text'
    },
    // v-modal的值
    value: {
      type: [String, Number],
      default: ''
    },
    // 最大输入长度
    maxlength: {
      type: Number
    },
    // 占位文本
    placeholder: {
      type: String,
      default: ''
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 大小 large, default, small
    size: {
      type: String,
      default: 'default'
    },
    // 头部图标
    prefixIcon: {
      type: String,
      default: ''
    },
    // 尾部图标
    suffixIcon: {
      type: String,
      default: ''
    },
    // 自动聚焦
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {

    }
  },
  computed: {
    inputClass() {
      return [
        `${prefixCls}`,
        `${prefixCls}-${this.size}`,
        {
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-prefix`]: this.prefixIcon,
          [`${prefixCls}-suffix`]: this.suffixIcon
        }
      ]
    }
  },
  methods: {
    // input 内容发生改变时候
    inputChange(e) {
      this.$emit('change', e.target.value)
    }
  },
  components: {
    GglIcon
  }
}
</script>

<style lang="stylus" scoped></style>