import Vue from 'vue'
import Vuex from 'vuex'
import rootState from './root-state'
import createLogger from 'vuex/dist/logger'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  ...rootState,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
