import Vue from 'vue'
import {formaTime} from '../utils/utils'

var Bus = new Vue()

function initFilter () {
  Vue.filter('time', formaTime)
}

export {
  Bus,
  initFilter
}
