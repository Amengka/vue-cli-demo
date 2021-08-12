<template>
	<div>
		<div id = 'myChart'></div>
		<button @click="updateData" style = "color: red; border-color: red">BIG RED BUTTON! </button>
	</div>
</template>

<script>
import axios from 'axios'
let myChart
export default {
	name: 'EchartDemo', 
	data(){
		return {
			num: 3, 
			overall: [], 
			progress: [], 
			emphasisStyle: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0,0,0,0.3)'
				}
			}, 

			option: {
				legend: {
					data: ['bar', 'bar2', 'bar3', 'bar4'],
					left: '10%'},
					toolbox: {
						feature: {
							magicType: {
								//若type为数组，将会显示为可切换的提示栏组件
								//type: ['stack', 'tiled']
								//toolbox.feature.brush下也有一部分相应设置（见上面注释）
								type: 'stack'
							},
						}
					},
					tooltip: {},
					xAxis: {
						data: [],
						name: 'X Axis',
						axisLine: {onZero: true},
						splitLine: {show: false},
						splitArea: {show: false}
					},
					yAxis: {},
					grid: {
						bottom: 100
					},
					series: [
						{
							name: 'bar',
							color: 'red', 
							type: 'bar',
							stack: 'one',
							emphasis: this.emphasisStyle,
							data: []
						},
						{
							name: 'bar2',
							type: 'bar',
							color: 'green', 
							stack: 'one',
							emphasis: this.emphasisStyle,
							data: []
						}
					]
			}
		}
	}, 
	mounted(){
		this.showChart()
	}, 
	created(){
		this.generateData()
	}, 
	methods: {
		// generateData(){
		// 	for (var i = 0; i < this.num; i++) {
		// 		// this.option.xAxis.data.push('Class' + i);
		// 		this.option.series[0].data.push((Math.random() * 2).toFixed(2));
		// 		this.option.series[1].data.push((Math.random() * 5).toFixed(2));
		// 	}
		// }, 
		async generateData(){
			// axios.get("/api/get/news").then(res => (this.tableData = res.data.list));
			const result = await axios.get("/api/get/charts")

			this.overall.push(result.data.list.cartOneOverall)
			this.overall.push(result.data.list.cartTwoOverall)
			this.progress.push(result.data.list.cartOneProgress)
			this.progress.push(result.data.list.cartTwoProgress)

			this.option.series[0].data = this.overall
			this.option.series[1].data = this.progress

			myChart.setOption(this.option);
		}, 

		updateData(){
			//this.option.xAxis.data = []
			// this.option.series[0].data = []
			// this.option.series[1].data = []
			this.overall = []
			this.progress = []
			this.generateData()
			myChart.setOption(this.option);
		}, 

		showChart(){
			const chartDom = document.getElementById('myChart')
			myChart = this.$echarts.init(chartDom)

			for(var i  = 0; i < this.num; i++){
				this.option.xAxis.data.push('Class' + i);
			}

			// 使用刚指定的配置项和数据显示图表
			myChart.setOption(this.option);
			window.onresize = function(){
				myChart.resize();
			}
		}
	}
}
</script>

<style scoped>
#myChart{
	width: 800px;
	height: 500px;
	margin: 0; 
	padding: 0;
}
</style>