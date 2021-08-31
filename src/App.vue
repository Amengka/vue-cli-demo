<template>
  <div id="app">
	<el-row>
         <el-col>
			<router-view/>
		</el-col>
	</el-row>
	<el-row>
		<el-col>
			<Steps/>
		</el-col>
	</el-row>
	<el-row>
		<el-col :span="12">
			<div class = "echart">
				<EchartDemo/>
			</div>
		</el-col>
		<el-col :span="12">
			<div style="width: 100%">
				<!-- <canvas id = 'mycanvas' width="919" height="525"></canvas> -->
				<img :src="img_url" alt="" @click="handleImageClick" id = "image">
				<el-dialog title="收货地址" :visible.sync="dialogTableVisible" width="90%">
					<canvas id = 'mycanvas' @mousedown="setPoint" width="1200" height="800"></canvas>
				</el-dialog>
			</div>
		</el-col>
	</el-row>
	<el-row>
		<el-col>
			<elementUITableDemo/>
		</el-col>
	</el-row>
  </div>
</template>

<script>
// import axios from 'axios'
import EchartDemo from './components/EchartDemo.vue'
import elementUITableDemo from './components/elementUITableDemo.vue'
import Steps from './components/steps.vue'


export default {
  name: 'App',
  components: {
	EchartDemo, 
	elementUITableDemo,
    Steps
  }, 
  data(){
	return{
		dialogTableVisible: false,
		pointList: [],
		canvasWidth: 0,
		canvasHeight: 0,
		imgNaturalWidth: 0,
		imgNaturalHeight: 0,
		img: null,
		canvas: null,
		ctx: null,
		img_url: require('./vision.png')
	}
  },
  methods:{
	deployCanvas(){
		this.img = document.querySelector('img')
		this.imgNaturalWidth = this.img.naturalWidth
		this.imgNaturalHeight = this.img.naturalHeight
		console.log(this.imgNaturalWidth)
		console.log(this.imgNaturalHeight)
		setTimeout(() =>{
			var dialog = document.getElementsByClassName('el-dialog')
			var dialogHeader = document.getElementsByClassName('el-dialog__header')
			var canvasWidth = dialog[0].clientWidth - 40 // 40px of padding
			var canvasHeight = dialog[0].clientHeight - dialogHeader[0].offsetHeight - 60 // 60px of padding
			var canvasImgSize = this.getImgSize(this.imgNaturalWidth, this.imgNaturalHeight, canvasWidth, canvasHeight)
			console.log(canvasWidth)
			console.log(canvasHeight)
			console.log(canvasImgSize)
			this.canvas = document.getElementById('mycanvas')
			this.canvas.setAttribute("width", canvasWidth)
            this.canvas.setAttribute("height",canvasHeight)
			this.ctx = this.canvas.getContext('2d')
			this.ctx.drawImage(this.img, 0, 0, canvasImgSize.width, canvasImgSize.height)
		}, 500)
	},

	handleImageClick(){
		this.dialogTableVisible = true
		this.deployCanvas()
	},

	getImgSize(naturalWidth, naturalHeight, canvasWidth, canvasHeight){
		var scaleWidth = (naturalWidth / canvasWidth).toFixed(2)
		var scaleHeight = (naturalHeight / canvasHeight).toFixed(2)
		if(scaleWidth >= scaleHeight){
			return{
				width: parseFloat((naturalWidth / scaleWidth).toFixed(2)),
				height: parseFloat((naturalHeight / scaleWidth).toFixed(2)),
				scale: parseFloat(scaleWidth)
			}
		}
		else{
			return{
				width: parseFloat((naturalWidth / scaleHeight).toFixed(2)),
				height: parseFloat((naturalHeight / scaleHeight).toFixed(2)),
				scale: parseFloat(scaleHeight)
			}
		}
	},

	setPoint(event) {
		var bbox = this.canvas.getBoundingClientRect()
		var loc = {x: event.clientX - bbox.left, y: event.clientY - bbox.top}
		this.ctx.strokeStyle = "#ca113f"
		this.ctx.lineWidth = 2
		this.ctx.arc(loc.x, loc.y, 1.5, 0, 2* Math.PI)
		this.pointList.push(loc)
		this.ctx.stroke()
	}
  }, 

  created(){
	},
	mounted(){
		// this.deployCanvas()
		// console.log(document.dialog)
		// console.log(document.body.clientHeight)
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

#image{
	max-height: 90%;
	max-width: 90%;
}

.el-dialog {
     /* display: flex;
     flex-direction: column; */
     margin:0 !important;
     position:absolute;
     top:50%;
     left:50%;
     transform:translate(-50%,-50%);
     /*height:600px;*/
     max-height:calc(100% - 5%);
     max-width:calc(100% - 5%);
}
.el-dialog .el-dialog__body {
     flex:1;
     /* overflow: auto; */
}
</style>
