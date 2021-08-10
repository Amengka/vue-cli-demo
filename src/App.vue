<template>
  <div id="app">
	<router-view/>
	<EchartDemo/>
	<elementUITableDemo/>
  </div>
</template>

<script>
import EchartDemo from './components/EchartDemo.vue'
import elementUITableDemo from './components/elementUITableDemo.vue'

// import axios from 'axios'

export default {
  name: 'App',
  components: {
	EchartDemo, 
	elementUITableDemo
  }, 

  created(){
	// axios.get('/api/get/news').then(res=>{
	// 	console.log(res)
	// 	})
	// axios.post('/api/post/news').then(res=>{
	// 	console.log(res)
	// 	})
	}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
