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
					<canvas id = 'mycanvas' @mousedown="setPoint" @mousewheel="magnifier" width = "1200" height = "800"></canvas>
					<!-- <canvas id = 'off-canvas' @mousemove="magnifier" width = '1200' height = '800' style="display: none"></canvas> -->
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
		offCanvas: null,
		ctx: null,
		offCtx: null,
		img_url: require('./vision.png'),
		centerPoint: {
			x: 0,
			y: 0
		},
		originalRectangle: {
			x: 0, 
			y: 0,
			width: 0,
			height: 0
		},
		originalRadius: 100,
		scale: 2,
		scaleGlassRectangle: {},
		canvasImgSize:{}
	}
  },
  methods:{
	deployCanvas(){
		this.img = document.querySelector('img')
		this.imgNaturalWidth = this.img.naturalWidth
		this.imgNaturalHeight = this.img.naturalHeight
		// console.log(this.imgNaturalWidth)
		// console.log(this.imgNaturalHeight)
		setTimeout(() =>{
			var dialog = document.getElementsByClassName('el-dialog')
			var dialogHeader = document.getElementsByClassName('el-dialog__header')
			var canvasWidth = dialog[0].clientWidth - 40 // 40px of padding
			var canvasHeight = dialog[0].clientHeight - dialogHeader[0].offsetHeight - 60 // 60px of padding
			this.canvasImgSize = this.getImgSize(this.imgNaturalWidth, this.imgNaturalHeight, canvasWidth, canvasHeight)
			// console.log(canvasWidth)
			// console.log(canvasHeight)
			// console.log(canvasImgSize)
			this.canvas = document.getElementById('mycanvas')
			this.canvas.setAttribute("width", canvasWidth)
            this.canvas.setAttribute("height",canvasHeight)

			// this.offCanvas = document.getElementById('off-canvas')
			// this.offCanvas.setAttribute("width", canvasWidth)
            // this.offCanvas.setAttribute("height",canvasHeight)

			this.ctx = this.canvas.getContext('2d')
			this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)

			// this.offCtx = this.offCanvas.getContext('2d')
			// this.offCtx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
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
		// var loc = this.windowToCanvas(event)
		this.centerPoint = this.windowToCanvas(event)
		this.ctx.strokeStyle = "#ca113f"
		this.ctx.lineWidth = 2
		this.ctx.arc(this.centerPoint.x, this.centerPoint.y, 1.5, 0, 2* Math.PI)
		this.pointList.push(this.centerPoint)
		this.ctx.stroke()
		console.log(this.pointList)
	},

	windowToCanvas(event) {
		var bbox = this.canvas.getBoundingClientRect()
		return{
			x: event.clientX - bbox.left, 
			y: event.clientY - bbox.top
		}
	},

	magnifier(event) {
		this.centerPoint =  this.windowToCanvas(event)
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		this.originalRectangle = {
			x: this.centerPoint.x - this.originalRadius,
			y: this.centerPoint.y - this.originalRadius,
			width: this.originalRadius * 2,
			height: this.originalRadius * 2
		}
		// console.log(this.originalRectangle)
		this.drawMagnifier()
	},

	drawMagnifier() {
		// todo
		// const {canvas} = this.$refs
		this.scaleGlassRectangle = {
			x: this.centerPoint.x - this.originalRectangle.width * this.scale / 2,
			y: this.centerPoint.y - this.originalRectangle.height * this.scale / 2,
			width: this.originalRectangle.width * this.scale,
			height: this.originalRectangle.height * this.scale
		}
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.arc(this.centerPoint.x, this.centerPoint.y, this.originalRadius, 0, Math.PI * 2, false)
		this.ctx.clip()
		this.ctx.drawImage(this.canvas,
		this.originalRectangle.x, this.originalRectangle.y,
		this.originalRectangle.width, this.originalRectangle.height,
		this.scaleGlassRectangle.x, this.scaleGlassRectangle.y,
		this.scaleGlassRectangle.width, this.scaleGlassRectangle.height)

		this.ctx.restore()

		this.ctx.beginPath()

		var gradient = this.ctx.createRadialGradient(
			this.centerPoint.x, this.centerPoint.y, this.originalRadius - 5,
			this.centerPoint.x, this.centerPoint.y, this.originalRadius)
		gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)')
		gradient.addColorStop(0.80, 'silver');
        gradient.addColorStop(0.90, 'silver');
        gradient.addColorStop(1.0, 'rgba(150,150,150,0.9)');

		this.ctx.strokeStyle = gradient
		this.ctx.lineWidth = 5
		this.ctx.arc(this.centerPoint.x, this.centerPoint.y, this.originalRadius, 0, Math.PI * 2, false)
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
