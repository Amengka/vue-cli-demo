<template>
	<div class = 'steps'>
		<el-steps :active="active" finish-status="success">
			<el-step title="步骤 1"></el-step>
			<el-step title="步骤 2"></el-step>
			<el-step title="步骤 3"></el-step>
			<el-step title="步骤 4"></el-step>
			<el-step title="步骤 5"></el-step>
		</el-steps>
		<el-button style="margin-top: 12px;" @click="next">下一步</el-button>
	</div>
</template>

<style scoped>
.steps{
	text-align: left;
}
.steps >>> .el-step__head.is-process{
	color: #efa73b;
	border-color: #efa73b
}
.steps >>> .el-step__head.is-process > .el-step__icon{
	background: #efa73b;
	color: #fff;
	animation: scaleout 1s infinite ease-in-out
}
.steps >>> .el-step__title.is-process {
  color: #efa73b;
}

.steps >>> .el-step__head.is-success {
  /* color: #efa73b;
  border-color: #efa73b; */
  animation: blink 1s 3;
}

.steps >>> .el-step__head.is-success > .el-step__line > .el-step__line-inner {
  width: 100% !important;
  border-width: 1px !important;
}

</style>

<script>
export default ({
	data(){
		return{
			active: 1
		}
	}, 
	methods:{
		next(){
			if (this.active++ > 4) this.active = 0;
		}
	}
})
</script>
