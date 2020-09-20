import Vue from 'vue'
import { VNode } from 'vue/types/umd'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: (h): VNode => h(App)
}).$mount('#app')
