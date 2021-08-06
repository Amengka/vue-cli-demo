<template>
	<div id = 'myChart'></div>
</template>

<script>
export default {
	name: 'EchartTest', 

	mounted(){
		this.showChart()
	}, 
	methods: {
		showChart(){
			var myChart = this.$echarts.init(document.getElementById('myChart'))
			myChart.setOption({
                title: { text: '在Vue项目中使用echarts'},
                tooltip: {},
                xAxis: {
                    data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data:  [5, 20, 36, 10, 10, 20],
                    smooth: false, 
					color: 'blue'
                }]
            })
		}
	}
}
</script>

<style scoped>
#myChart{
	width: 500px;
	height: 300px;
	margin: 0; 
	padding: 0;
}
</style>