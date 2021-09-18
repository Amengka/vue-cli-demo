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
				<el-dialog title="图片标注" :visible.sync="dialogTableVisible" width="80%">
					<div slot="title" class = 'dialogHeader'>
						<el-popconfirm
							confirmButtonText='不取消'
							cancelButtonText='取消'
							icon = 'el-icon-info'
							title = '确定取消标注吗？'>
						<el-button slot = 'reference' style="float: left">close</el-button>
						</el-popconfirm>
						<el-popconfirm
							confirmButtonText='提交'
							cancelButtonText='取消'
							@confirm = 'sendData'
							icon = 'el-icon-info'
							title = '确定提交标注吗？'>
							<el-button slot = 'reference' style="float: right">√提交标注</el-button>
						</el-popconfirm>
					</div>
					<canvas id = 'mycanvas' 
					@mousedown="mouseDown" 
					@mouseup="mouseUp"
					@mousemove="mouseMove"
					width = "1200" height = "800"></canvas>
					<canvas id = 'offcanvas' style="display: none"></canvas>
					<div slot="footer" class="dialogFooter">
						<button style="float: left" @click="addRect">拖拽添加选框</button>
						<el-button :disabled = 'undo === 0'
												@click = "handleUndo">撤销</el-button>
						<el-button :disabled = 'redo === 0'
												@click  = 'handleRedo'>还原</el-button>
						<el-button type="warning" 
												icon="el-icon-delete" 
												:disabled = 'canDelete'
												@click="handleDelete"> 删除</el-button>
					</div>
					<!-- <canvas id = 'off-canvas' @mousemove="mouseWheel" width = '1200' height = '800' style="display: none"></canvas> -->
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
		offcanvas: null,
		ctx: null,
		offctx: null,
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
		originalRadius: 30,
		scale: 2,
		scaleGlassRectangle: {},
		canvasImgSize:{},

		rectList: [],
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		isSelected: false,
		isDrawing: false,
		isClicking: false,
		isDragging: false,
		vertexRadius: 5,
		vertex: [],
		movingVertex: null,
		undo: 0,
		redo: 0,
		canDelete: true,
		undoArray: [],
		redoArray: [],
		activeRect: null
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
			this.offcanvas = document.getElementById('offcanvas')
			this.canvas.setAttribute("width", canvasWidth)
            this.canvas.setAttribute("height",canvasHeight)
			this.offcanvas.setAttribute("width", canvasWidth)
			this.offcanvas.setAttribute("height", canvasHeight)
			this.ctx = this.canvas.getContext('2d')
			this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
			this.offctx = this.offcanvas.getContext('2d')
			this.offctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		}, 500)
		this.undoArray.push(this.deepClone(this.rectList))
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

	mouseDown(event) {
		var loc = this.windowToCanvas(event)
		this.isClicking = true
		if((this.isDrawing && this.isClicking) || (this.isDragging && this.isClicking)){
			this.startX = loc.x
			this.startY = loc.y
		}
		if(!this.isDrawing){
			var selectedRect = this.isHover(loc.x, loc.y)
			this.movingVertex= this.isDraggingVertex(loc.x, loc.y)
			// console.log(this.movingVertex)
			if(selectedRect === null && this.movingVertex === -1){
				this.rectList.forEach(element => {
					element.isSelected = false
				})
				this.isDragging = false
				this.activeRect = []
			}
			else this.isDragging = true
			// console.log(this.movingVertex)
			// if(this.isDragging) this.undoArray.push(this.deepClone(this.rectList))
			console.log(this.activeRect.isSelected)
			this.drawRect()
			// console.log(selectedRect)
		}
	},

	mouseUp(event) {
		if(this.isDrawing && this.isClicking){
			var loc = this.windowToCanvas(event)
			this.endX = loc.x
			this.endY = loc.y
			// this.undoArray.push(this.deepClone(this.rectList))
			// this.undo = this.undoArray.length
			// console.log(this.startX, this.startY, this.endX, this.endY)
			if(this.redoArray.length !== 0){
				this.undoArray.push(this.deepClone(this.rectList))
				this.redoArray = []
			}
			var newRect = this.rect(this.startX, this.startY, this.endX, this.endY, true)
			this.rectList.unshift(newRect)
			this.activeRect = newRect
			this.undoArray.push(this.deepClone(this.rectList))
			this.undo = this.undoArray.length
			// console.log('undo', this.undoArray)
			// console.log('redo', this.redoArray)
			this.canDelete = false
			// console.log(this.rectList)
			this.ctx.beginPath()
			this.ctx.moveTo(this.startX, this.startY)
			this.ctx.lineTo(this.endX, this.startY)
			this.ctx.lineTo(this.endX, this.endY)
			this.ctx.lineTo(this.startX, this.endY)
			this.ctx.lineTo(this.startX, this.startY)
			this.ctx.strokeStyle = '#14F098'
			this.ctx.lineWidth = 1
			this.ctx.stroke()
			this.ctx.fillStyle = 'rgba(20, 240, 152, 0.2)'
			this.ctx.fill()
			this.isDrawing = false
			this.drawRect()
			// this.drawVertex()
		}
		else if(this.isDragging && this.movingVertex !== -1){
			// console.log(this.activeRect)
			// console.log(this.rectList)
			this.undoArray.push(this.deepClone(this.rectList))
			this.undo = this.undoArray.length
			// console.log(this.undoArray)
		}
		this.isClicking = false
	},

	mouseMove(event) {
		// console.log(this.isClicking, this.isDragging, this.movingVertex)
		if(this.isClicking && this.isDrawing){
			var loc = this.windowToCanvas(event)
			this.endX = loc.x
			this.endY = loc.y
			// this.drawRect()
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
			this.ctx.beginPath()
			this.ctx.moveTo(this.startX, this.startY)
			this.ctx.lineTo(this.endX, this.startY)
			this.ctx.lineTo(this.endX, this.endY)
			this.ctx.lineTo(this.startX, this.endY)
			this.ctx.lineTo(this.startX, this.startY)
			this.ctx.strokeStyle = '#14F098'
			this.ctx.lineWidth = 1
			this.ctx.stroke()
			this.ctx.fillStyle = 'rgba(20, 240, 152, 0.2)'
			this.ctx.fill()
			this.ctx.closePath()
		}
		else if(this.isClicking && this.isDragging && this.movingVertex !== -1){
			// todo
			// loc = this.windowToCanvas(event)
			// this.endX = loc.x
			// this.endY = loc.y
			// this.drawRect()
			// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			// this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
			loc = this.windowToCanvas(event)
			this.endX = loc.x
			this.endY = loc.y
			var diffX = this.endX - this.startX
			var diffY = this.endY - this.startY
			this.activeRect.corrd[this.movingVertex * 2] += diffX
			this.activeRect.corrd[this.movingVertex * 2 + 1] += diffY			
			this.startX = loc.x
			this.startY = loc.y
			this.drawRect()
			this.centerPoint =  this.windowToCanvas(event)
			// this.drawRect()
			this.originalRectangle = {
				x: this.centerPoint.x - this.originalRadius,
				y: this.centerPoint.y - this.originalRadius,
				width: this.originalRadius * 2,
				height: this.originalRadius * 2
			}
			// this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			// this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
			this.drawMagnifier()
			this.drawVertex()
		}
	},

	drawRect() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		for (let i = 0; i < this.rectList.length; i++) {
			let rect = this.rectList[i]
			this.ctx.beginPath()
			this.ctx.moveTo(rect.corrd[0], rect.corrd[1])
			this.ctx.lineTo(rect.corrd[2], rect.corrd[3])
			this.ctx.lineTo(rect.corrd[4], rect.corrd[5])
			this.ctx.lineTo(rect.corrd[6], rect.corrd[7])
			this.ctx.lineTo(rect.corrd[0], rect.corrd[1])
			this.ctx.strokeStyle = '#14F098'
			this.ctx.lineWidth = 1
			this.ctx.stroke()
			this.ctx.fillStyle = 'rgba(20, 240, 152, 0.2)'
			this.ctx.fill()
			this.ctx.closePath()
			if(rect.isSelected) {
				this.ctx.strokeStyle = '#14F098'
				this.ctx.lineWidth = 3
				this.ctx.stroke()
				this.vertex = rect.corrd
				// this.ctx.closePath()
				this.drawVertex()
			}
		}
	},

	drawVertex(){
		var vertexCorrd = []
		for(var i = 0; i < this.vertex.length; i = i + 2){
			vertexCorrd.push({x: this.vertex[i], y: this.vertex[i + 1]})
		}
		vertexCorrd.forEach(element => {
			// consider each vertex as a single circle
			this.ctx.beginPath()
			this.ctx.arc(element.x, element.y, this.vertexRadius, 0, Math.PI * 2)
			this.ctx.stroke()
			this.ctx.fillStyle = 'white'
			this.ctx.fill()
			this.ctx.closePath()
		})
		// console.log(this.vertex)
		// this.vertex = []
	},

	windowToCanvas(event) {
		var bbox = this.canvas.getBoundingClientRect()
		return{
			x: event.clientX - bbox.left, 
			y: event.clientY - bbox.top
		}
	},

	mouseWheel(event) {
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
		this.ctx.arc(this.centerPoint.x + this.originalRadius, this.centerPoint.y - this.originalRadius, this.originalRadius, 0, Math.PI * 2, false)
		this.ctx.clip()
		this.ctx.drawImage(this.offcanvas,
		this.originalRectangle.x, this.originalRectangle.y,
		this.originalRectangle.width, this.originalRectangle.height,
		this.scaleGlassRectangle.x + this.originalRadius, this.scaleGlassRectangle.y - this.originalRadius,
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
		this.ctx.lineWidth = 3
		this.ctx.arc(this.centerPoint.x + this.originalRadius, this.centerPoint.y - this.originalRadius, this.originalRadius, 0, Math.PI * 2, false)
		this.ctx.stroke()
		this.ctx.closePath()
	},

	rect(startX, startY, endX, endY, isSelected){
		var xMin = Math.min(startX, endX)
		var xMax = Math.max(startX, endX)
		var yMin = Math.min(startY, endY)
		var yMax = Math.max(startY, endY)
		return{
			// [x1, y1, x2, y2, x3, y3, x4, y4]
			corrd: [xMin, yMin, xMax, yMin, xMax, yMax, xMin, yMax],
			isSelected: isSelected,
		}
	},

	addRect(){
		this.isDrawing = true
		this.rectList.forEach(element => {
			element.isSelected = false
		})
	},

	isHover(x, y){
		for(var i = 0; i < this.rectList.length; i++){
			var rect = this.rectList[i]
			if(x > rect.corrd[0] && x < rect.corrd[2] && y > rect.corrd[1] && y < rect.corrd[5]){
				this.rectList.forEach(element => {
					element.isSelected = false
				})
				this.rectList[i].isSelected = true
				this.canDelete = false
				this.activeRect = this.rectList[i]
				return this.rectList[i]
			}
		}
		return null
	},

	isDraggingVertex(x, y){
		// 0: upperleft 1: upperright 2: lowerright 3: lowerleft
		for(var i = 0; i < this.vertex.length; i = i + 2){
			var res = Math.pow(x - this.vertex[i], 2) + Math.pow(y - this.vertex[i + 1], 2)
			if(res <= Math.pow(this.vertexRadius, 2)){
				return i / 2
			}
		}
		return -1
	},

	handleDelete(){
		for(var i = 0; i < this.rectList.length; i++){
			if(this.rectList[i].isSelected === true){
				this.rectList.splice(i, 1)
				this.canDelete = true
				this.undoArray.push(this.deepClone(this.rectList))
				console.log('undoArray in delete', this.undoArray)
				console.log(this.rectList)
				break
			}
		}
		this.drawRect()
	},

	handleUndo(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		if(this.redoArray.length === 0){
			this.redoArray.push(this.undoArray.pop())
			this.rectList = this.undoArray.pop()
			// this.redoArray.push(this.deepClone(this.rectList))
			this.redo = this.redoArray.length
		}
		else {
			this.redoArray.push(this.deepClone(this.rectList))
			this.rectList = this.undoArray.pop()
			this.redo = this.redoArray.length
		}
		this.drawRect()
		console.log('clicking undo')
		console.log('undo', this.undoArray)
		console.log('redo', this.redoArray)
		console.log('rectList', this.rectList)
	}, 

	handleRedo(){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.ctx.drawImage(this.img, 0, 0, this.canvasImgSize.width, this.canvasImgSize.height)
		this.undoArray.push(this.deepClone(this.rectList))
		this.rectList = this.redoArray.pop()
		this.undo = this.undoArray.length
		if(this.redoArray.length === 0) {
			this.undoArray.push(this.deepClone(this.rectList))
		}
		this.drawRect()
		console.log('clicking redo')
		console.log('undo', this.undoArray)
		console.log('redo', this.redoArray)
		console.log('rectList', this.rectList)
	},

	sendData(){
		console.log('senddata')
		// this.$bus.$emit('calibrationData', this.rectList)
		// axios.post('http://10.157.2.190:5016/sendCalibrationData')
		// .then(response => {
		// 	this.rectList = response
		// })
		// .catch(error => console.log(error))
	},

	deepClone(obj){
		if (obj === null) return null
		let clone = Object.assign({}, obj)
		Object.keys(clone).forEach(
			key =>
			(clone[key] =
			typeof obj[key] === 'object' ? this.deepClone(obj[key]) : obj[key])
		)
		if (Array.isArray(obj)) {
			clone.length = obj.length;
			return Array.from(clone);
		}
		return clone;
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
