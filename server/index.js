// const Ws = require('ws')

// ;((Ws) => {
// 	const server = new Ws.Server({port: 8000})

// 	const init = () => {
// 		bindEvent()
// 	}

// 	function bindEvent(){
// 		server.on('open', handleOpen)
// 		server.on('close', handleClose)
// 		server.on('error', handleError)
// 		server.on('connection', handleConnection)
// 	}

// 	function handleOpen(){
// 		console.log('BE: Websocket open')
// 	}

// 	function handleClose(){
// 		console.log('BE: Websocket close')
// 	}

// 	function handleError(){
// 		console.log('BE: WebSocket error')
// 	}

// 	function handleConnection(ws){
// 		console.log('BE: WebSocket connection')

// 		ws.on('message', handleMessage)
// 	}

// 	function handleMessage(msg){
// 		server.clients.forEach((c) => {
// 			c.send(msg)
// 		})
// 	}

// 	init();
// })(Ws);