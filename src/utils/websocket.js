import {EventBus} from './eventBus'

const ws = new WebSocket('ws://127.0.0.1:5004/homepage_ws')
function initWebSocket(){
	if(typeof(WebSocket) === "undefined"){
		alert("Your broswer does not support websocket")
	}

	ws.onopen = websocketonopen;
	ws.onmessage = websocketonmessage;
	ws.onerror = websocketonerror;
	ws.onclose = websocketclose;
}
function websocketonopen() {
	console.log("WebSocket连接成功");
	// 添加心跳检测，每30秒发一次数据，防止连接断开（这跟服务器的设置有关，如果服务器没有设置每隔多长时间不发消息断开，可以不进行心跳设置）
	// let self = this;
	// this.timer = setInterval(() => {
	// 	try {
	// 		self.websock.send('test')
	// 		console.log('发送消息');
	// 	}catch(err){
	// 		console.log('断开了：' + err);
	// 		self.connection()
	// 	}
	// }, 30000)
}

//接收后端返回的数据，可以根据需要进行处理
function websocketonmessage(e) {
	let dataJson = JSON.parse(e.data);
	// console.log(dataJson);
	EventBus.$emit('tableData', dataJson)
	// this.$eventBus.$emit('tableData', dataJson)
}

//连接建立失败重连
function websocketonerror(e) {
	console.log(`连接失败的信息：`, e);
	initWebSocket(); // 连接失败后尝试重新连接
}

//关闭连接
function websocketclose(e) {
	console.log("断开连接", e);
}


function closeWebsocket(){
	ws.close()
}

initWebSocket()

export default {
	initWebSocket,
	closeWebsocket
}