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
				<el-dialog title="图片标注" :visible.sync="dialogTableVisible" width="90%">
					<canvas id = 'mycanvas' 
					@mousedown="setRectStartPoint" 
					@mouseup="setRectEndPoint"
					@mousemove="rectTransform"
					@mousewheel="magnifier"  
					width = "1200" height = "800"></canvas>
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
		canvasImgSize:{},

		rectList: [],
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		isSelected: false,
		isDrawing: false
	}
  },
  methods:{
	deployCanvas(){
		this.img = document.querySelector('img')
		this.imgNaturalWidth = this.img.naturalWidth
		this.imgNaturalHeight = this.img.naturalHeight
		setTimeout(() =>{
			var dialog = document.getElementsByClassName('el-dialog')
			var dialogHeader = document.getElementsByClassName('el-dialog__header')
			var canvasWidth = dialog[0].clientWidth - 40 // 40px of padding
			var canvasHeight = dialog[0].clientHeight - dialogHeader[0].offsetHeight - 60 // 60px of padding
			this.canvasImgSize = this.getImgSize(this.imgNaturalWidth, this.imgNaturalHeight, canvasWidth, canvasHeight)
			this.canvas = document.getElementById('mycanvas')
			this.canvas.setAttribute("width", canvasWidth)
            this.canvas.setAttribute("height",canvasHeight)
			this.ctx = this.canvas.getContext('2d')
			this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
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

	// setPoint(event) {
	// 	this.centerPoint = this.windowToCanvas(event)
	// 	this.ctx.strokeStyle = "#ca113f"
	// 	this.ctx.lineWidth = 2
	// 	this.ctx.arc(this.centerPoint.x, this.centerPoint.y, 1.5, 0, 2* Math.PI)
	// 	this.pointList.push(this.centerPoint)
	// 	this.ctx.stroke()
	// 	console.log(this.pointList)
	// },

	// mousedown
	setRectStartPoint(event) {
		var loc = this.windowToCanvas(event)
		this.startX = loc.x
		this.startY = loc.y
		this.isDrawing = true
	},

	// mouseup
	setRectEndPoint(event) {
		var loc = this.windowToCanvas(event)
		this.endX = loc.x
		this.endY = loc.y
		this.rectList.unshift(this.rect(this.startX, this.startY, this.endX, this.endY, false))
		console.log(this.rectList)
		this.ctx.beginPath()
		// this.ctx.globalAlpha = 0.3 // 透明度
		this.ctx.moveTo(this.startX, this.startY)
		this.ctx.lineTo(this.endX, this.startY)
		this.ctx.lineTo(this.endX, this.endY)
		this.ctx.lineTo(this.startX, this.endY)
		this.ctx.lineTo(this.startX, this.startY)
		this.ctx.strokeStyle = 'black'
		this.ctx.lineWidth = 1
		this.ctx.stroke()
		this.isDrawing = false
	},

	// mousemove
	rectTransform(event) {
		var loc = this.windowToCanvas(event)
		this.endX = loc.x
		this.endY = loc.y
		if(this.isDrawing){
			this.drawRect()
			this.ctx.beginPath()
			this.ctx.moveTo(this.startX, this.startY)
			this.ctx.lineTo(this.endX, this.startY)
			this.ctx.lineTo(this.endX, this.endY)
			this.ctx.lineTo(this.startX, this.endY)
			this.ctx.lineTo(this.startX, this.startY)
			this.ctx.strokeStyle = 'black'
			this.ctx.lineWidth = 1
			this.ctx.stroke()
		}
	},

	drawRect() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		for (let i = 0; i < this.rectList.length; i++) {
			let rect = this.rectList[i]
			this.ctx.beginPath()
			this.ctx.moveTo(rect.startX, rect.startY)
			this.ctx.lineTo(rect.endX, rect.startY)
			this.ctx.lineTo(rect.endX, rect.endY)
			this.ctx.lineTo(rect.startX, rect.endY)
			this.ctx.lineTo(rect.startX, rect.startY)
			this.ctx.strokeStyle = 'black'
			this.ctx.lineWidth = 1
			this.ctx.stroke()
			if(rect.isSelected) {
				this.ctx.strokeStyle = 'black'
				this.ctx.lineWidth = 1
				this.ctx.stroke()
			}
		}
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
		this.drawRect()
		this.originalRectangle = {
			x: this.centerPoint.x - this.originalRadius,
			y: this.centerPoint.y - this.originalRadius,
			width: this.originalRadius * 2,
			height: this.originalRadius * 2
		}
		this.drawMagnifier()
	},

	drawMagnifier() {
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
	},

	rect(startX, startY, endX, endY){
		return{
			startX: startX,
			startY: startY,
			endX: endX,
			endY: endY,
			isSelected: false,
		}
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
