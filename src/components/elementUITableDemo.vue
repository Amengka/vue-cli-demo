<template>
<div id = "tabs">
	<el-tabs :tab-position="tabPosition" style="height: 200px;">
			<el-tab-pane label="当前订单数据">
				<el-table :data = 'tableData.filter(this.isCompleted)' style = 'width: 50%'>
			<el-table-column type = 'expand'>
				<template slot-scope="props">
					<el-form label-position = 'left' inline class = 'demo-table-expand'>
						<el-form-item label = 'Item Name' label-width = '200px'>
							<span>{{props.row.name}}</span>
						</el-form-item>
						<el-form-item label = 'Origin' label-width = '200px'>
							<span>{{props.row.shop}}</span>
						</el-form-item>
						<el-form-item label = 'Item ID' label-width = '200px'>
							<span>{{props.row.id}}</span>
						</el-form-item>
						<el-form-item label = 'Origin ID' label-width = '200px'>
							<span>{{props.row.shopId}}</span>
						</el-form-item>
						<el-form-item label = 'Item Category' label-width = '200px'>
							<span>{{props.row.category}}</span>
						</el-form-item>
						<el-form-item label = 'Address' label-width = '200px'>
							<span>{{props.row.address}}</span>
						</el-form-item>
						<el-form-item label = 'description' label-width = '200px'>
							<span>{{props.row.desc}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column 
			label = "Item ID"
			prop = 'id'>
			</el-table-column>
			<el-table-column
			label = 'Item Name'
			prop = 'name'>
			</el-table-column>
			<el-table-column
			label = 'Description'
			prop = 'desc'>
			</el-table-column>
		</el-table>
			</el-tab-pane>
			<el-tab-pane label="历史订单数据">
				<el-table :data = 'tableData.filter(this.isNotCompleted)' style = 'width: 50%'>
			<el-table-column type = 'expand'>
				<template slot-scope="props">
					<el-form label-position = 'left' inline class = 'demo-table-expand'>
						<el-form-item label = 'Item Name' label-width = '200px'>
							<span>{{props.row.name}}</span>
						</el-form-item>
						<el-form-item label = 'Origin' label-width = '200px'>
							<span>{{props.row.shop}}</span>
						</el-form-item>
						<el-form-item label = 'Item ID' label-width = '200px'>
							<span>{{props.row.id}}</span>
						</el-form-item>
						<el-form-item label = 'Origin ID' label-width = '200px'>
							<span>{{props.row.shopId}}</span>
						</el-form-item>
						<el-form-item label = 'Item Category' label-width = '200px'>
							<span>{{props.row.category}}</span>
						</el-form-item>
						<el-form-item label = 'Address' label-width = '200px'>
							<span>{{props.row.address}}</span>
						</el-form-item>
						<el-form-item label = 'description' label-width = '200px'>
							<span>{{props.row.desc}}</span>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column 
			label = "Item ID"
			prop = 'id'>
			</el-table-column>
			<el-table-column
			label = 'Item Name'
			prop = 'name'>
			</el-table-column>
			<el-table-column
			label = 'Description'
			prop = 'desc'>
			</el-table-column>
		</el-table>
			</el-tab-pane>
  </el-tabs>
</div>
	
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .el-table{
      overflow: auto;
  } 
</style>

<script>
import axios from 'axios'
  export default {
    data() {
      return {
		tableData: [], 
		img: '', 
		tabPosition: "top", 
      }
    }, 
	methods:{
		async getData(){
			const result = await axios.get("/api/get/tables")
			const armuiData = await axios.get("/apiv2/depalletize")
			this.tableData = result.data.list.list
			console.log(armuiData.data)
		}, 
		isCompleted(element){
			return element.shopId === 1
		}, 
		isNotCompleted(element){
			return element.shopId === 2
		}
	}, 
	created(){
		this.getData()
	}
  }
</script>