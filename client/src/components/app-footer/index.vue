/*
 * @Author: 郭靖 
 * @Date: 2020-05-21 09:26:30 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-21 10:07:53
 */
<template>
  <div class="ggl-flex ggl-flex-align">
    <div :style="lineStyle" class="ggl-flex-1"></div>
    <div :style="textStyle" class="ggl-padding-0-20 ggl-text-center">
      <span>开源作者：1995郭靖</span>
      <span @click="itemTap" class="ggl-pointer-h ggl-margin-left-10">桂ICP备18001214号-1</span>
    </div>
    <div :style="lineStyle" class="ggl-flex-1"></div>
  </div>
</template>

<script>
export default {
  props: {
    lineColor: {
      type: String,
      default: 'rgba(250,250,250,0.2)'
    },
    textColor: {
      type: String,
      default: 'white'
    }
  },
  data() {
    return {

    }
  },
  computed: {
    lineStyle() {
      return {
        background: this.lineColor,
        height: '1px',
        width: '100px'
      }
    },
    textStyle() {
      return { textColor: this.textColor }
    }
  },
  methods: {
    itemTap() {
      window.open('http://www.beian.miit.gov.cn')
    }
  }
}
</script>

<style lang="stylus" scoped></style>
