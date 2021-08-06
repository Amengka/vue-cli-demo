<template>
	<el-table :data = 'tableData' style = 'width: 50%'>
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
</style>

<script>
  export default {
    data() {
      return {
        tableData: [{
          id: '12987122',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987123',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987125',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }, {
          id: '12987126',
          name: '好滋好味鸡蛋仔',
          category: '江浙小吃、小吃零食',
          desc: '荷兰优质淡奶，奶香浓而不腻',
          address: '上海市普陀区真北路',
          shop: '王小虎夫妻店',
          shopId: '10333'
        }]
      }
    }
  }
</script>