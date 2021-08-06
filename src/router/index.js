import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(Router)

const routes = [
	{
		path: '/login', 
		name : 'Login', 
		component: Login
	}, 
	{
		path: '/', 
		name: 'Home', 
		component: () => import(/* webpackChunkName: "Home" */ '../views/Home.vue')
	}
]

const router = new Router({
	mode: 'history', 
	base: process.env.BASE_URL, 
	routes
})

export default router