<template>
	<div class = 'home'>
		{{data}}
		<!-- <input type="text" placeholder="Please input message" v-model = "msg">
		<button @click = 'handleSendBtnClick'>Send</button>
		<button @click = 'disconnect'>Disconnect</button>
		<ul>
			<li 
			v-for = "msg in msgList"
			:key = "msg.id"
			>
			<p>
				<span>  {{msg.user}}  </span>
				<span>{{new Date(msg.dateTime)}}</span>
			</p>
			<p>Message: {{msg.msg}}</p>
			</li>
		</ul> -->
	</div>
</template>

<script>
import axios from 'axios'

// const ws = new WebSocket('ws://127.0.0.1:5004/homepage_ws')
// import {EventBus} from '../utils/eventBus'
// import {initWebSocket} from '../utils/websocket'
// import '../utils/websocket'

export default {
	name: 'Home', 
	data(){
		return{
			ws: null,
			data: null
		}
	}, 
	mounted(){},
	created(){
		this.websocket.initWebSocket()
		axios.get('https://yapi.mcd.megvii-inc.com/mock/2962/getArmStatus')
		.then(response => (this.data = response.data))
		.catch(error => console.log(error))
		// initWebSocket()
	},
	destroyed(){
		// if(this.ws){
		// 	this.ws.close()
		// }
		this.websocket.closeWebsocket()
	},
	methods: {
		// initWebSocket(){
		// 	if(typeof(WebSocket) === "undefined"){
		// 		alert("Your broswer does not support websocket")
		// 	}
		// 	this.ws = new WebSocket('ws://127.0.0.1:5004/homepage_ws')
		// 	this.ws.onopen = this.websocketonopen;
		// 	this.ws.onmessage = this.websocketonmessage;
		// 	this.ws.onerror = this.websocketonerror;
		// 	this.ws.onclose = this.websocketclose;
		// },
		// websocketonopen() {
		// 	console.log("WebSocket连接成功");
		// 	// 添加心跳检测，每30秒发一次数据，防止连接断开（这跟服务器的设置有关，如果服务器没有设置每隔多长时间不发消息断开，可以不进行心跳设置）
		// 	// let self = this;
		// 	// this.timer = setInterval(() => {
		// 	// 	try {
		// 	// 		self.websock.send('test')
		// 	// 		console.log('发送消息');
		// 	// 	}catch(err){
		// 	// 		console.log('断开了：' + err);
		// 	// 		self.connection()
		// 	// 	}
		// 	// }, 30000)
		// },
		// //接收后端返回的数据，可以根据需要进行处理
		// websocketonmessage(e) {
		// 	let dataJson = JSON.parse(e.data);
		// 	console.log(dataJson);
		// 	EventBus.$emit('tableData', dataJson)
		// 	// this.$eventBus.$emit('tableData', dataJson)
		// },
		// //连接建立失败重连
		// websocketonerror(e) {
		// 	console.log(`连接失败的信息：`, e);
		// 	this.initWebSocket(); // 连接失败后尝试重新连接
		// },
		// //关闭连接
		// websocketclose(e) {
		// 	console.log("断开连接", e);
		// }
	}
}
</script>