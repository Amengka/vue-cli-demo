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

const data = [1, 2]
Mock.mock('/api/get/tables', 'get', ()=>{
	return{
		status: 200, 
		message: 'successful in getting table data', 
		list: Mock.mock({
			"list|10-12":[
				{
					"id": "@increment", 
					"name": "@name(3-5)", 
					"category": Mock.Random.integer(1, 6),  
					"desc": "@csentence(10)", 
					"address": "@city(true)", 
					"shop": "@cword(5)", 
					// "shopId": Mock.Random.integer(1, 2)
					"shopId|1": data
				}
			]
		})
	}
})


Mock.mock('/api/get/imgs', 'get', () => {
	return {
      status: 200,
      message: 'successful in getting img',
    //   img_url: "@image('250x250', '#FF83FA', '#FCFCFC', 'png', 'Armui')", 
	img_url: Mock.Random.image('250x250','#FF83FA', '#FCFCFC', 'png', 'Armui')
	}
  })

//首页相关
//Mock.mock(/\/home\/getData/, "get", homeApi.getStatisticalData);