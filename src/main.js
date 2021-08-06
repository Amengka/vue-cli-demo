import Vue from 'vue'
import App from './App.vue'
import * as echarts from 'echarts'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import router from './router'

Vue.use(ElementUI, {locale})
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

new Vue({
	router, 
	render: h => h(App),
}).$mount('#app')
