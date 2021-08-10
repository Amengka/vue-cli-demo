import Mock from 'mockjs'
//import homeApi from './home'


//设置200-2000毫秒延迟数据
// Mock.setup({
// 	timeout: "200-2000"
// })

// let chartData = Mock.mock({
// 		"cartOneOverall": Mock.Random.float(5, 8, 1, 1),
// 		"cartOneProgress": Mock.Random.float(1, 4, 1, 1),  
// 		"cartTwoOverall": Mock.Random.float(6, 9, 1, 1),
// 		"cartTwoProgress": Mock.Random.float(3, 5, 1, 1),  
// })


Mock.mock('/api/get/charts', 'get', ()=>{
	return{
		status: 200, 
		message: "successful in getting chart data", 
		list: Mock.mock({
			"cartOneOverall": Mock.Random.float(5, 8, 1, 1),
			"cartOneProgress": Mock.Random.float(1, 4, 1, 1),  
			"cartTwoOverall": Mock.Random.float(6, 9, 1, 1),
			"cartTwoProgress": Mock.Random.float(3, 5, 1, 1), 
		}), 
		total: 50
	}
})

Mock.mock('/api/post/news', 'post',()=> {
	return{
		status: 200, msg: 'post is successful'
	}
})

Mock.mock('/api/get/tables', 'get', ()=>{
	return{
		status: 200, 
		message: 'successful in getting table data', 
		list: Mock.mock({
			"list|4-6":[
				{
					"id": "@increment", 
					"name": "@name(3-5)", 
					"category": Mock.Random.integer(1, 6),  
					"desc": "@csentence(10)", 
					"address": "@city(true)", 
					"shop": "@cword(5)", 
					"shopID": Mock.Random.integer(1, 100)
				}
			]
		})
	}
})

//首页相关
//Mock.mock(/\/home\/getData/, "get", homeApi.getStatisticalData);

// id: '12987122',
// name: '好滋好味鸡蛋仔',
// category: '江浙小吃、小吃零食',
// desc: '荷兰优质淡奶，奶香浓而不腻',
// address: '上海市普陀区真北路',
// shop: '王小虎夫妻店',
// shopId: '10333'