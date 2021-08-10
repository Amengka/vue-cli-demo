import Vue from 'vue'
import App from './App.vue'
import * as echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'
import router from './router'
//import './mock'
import './mock/index.js'
//import http from './api/config'
import axios from 'axios'

//elementui
Vue.use(ElementUI, {locale})
//echart
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
//axios
Vue.prototype.axios = axios

new Vue({
	router, 
	render: h => h(App),
}).$mount('#app')
