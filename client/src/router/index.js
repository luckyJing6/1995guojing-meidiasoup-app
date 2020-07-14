/*
 * @Author: 郭靖 
 * @Date: 2020-05-20 16:23:48 
 * @Last Modified by: 郭靖
 * @Last Modified time: 2020-05-20 18:17:43
 */

import Vue from 'vue'
import Router from 'vue-router'
import RouterGenerator from '../models/router-generator'

Vue.use(Router)

const router = RouterGenerator.create(Router)
export default router