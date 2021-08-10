<template>
	<div class = 'home'>
		<input type="text" placeholder="Please input message" v-model = "msg">
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
		</ul>
	</div>
</template>

<script>

const ws = new WebSocket('ws://localhost:8000')

export default {
	name: 'Home', 
	data(){
		return{
			msg: '', 
			username: '', 
			msgList: [], 
		}
	}, 
	mounted(){
		this.username = localStorage.getItem('username');

		if(!this.username){
			this.$router.push('/login')
			return
		}

		ws.onopen = this.handleWsOpen.bind(this)
		ws.onclose = this.handleWsClose.bind(this)
		ws.onerror = this.handleWsError.bind(this)
		ws.onmessage = this.handleWsMessage.bind(this)
		// ws.addEventListener('open', this.handleWsOpen.bind(this), false)
		// ws.addEventListener('close', this.handleWsClose.bind(this), false)
		// ws.addEventListener('error', this.handleWsError.bind(this), false)
		// ws.addEventListener('message', this.handleWsMessage.bind(this), false)
	}, 
	methods: {
		handleSendBtnClick(){
			const msg = this.msg
			if(!msg.trim().length){
				return
			}
			//发送信息
			const dataString = JSON.stringify({
				id: new Date().getTime(), 
				user: this.username, 
				dateTime: new Date().getTime(), 
				msg: this.msg
			})
			ws.send(dataString)

			this.msg = ''
		}, 
		handleWsOpen(e){
			console.log('FE: WEBSOCKET OPEN', e)
		}, 
		handleWsClose(e){
			console.log('FE: WEBSOCKET CLOSE', e)
		}, 
		handleWsError(e){
			console.log('FE: WEBSOCKET ERROR', e)
		}, 
		handleWsMessage(e){
			const msg = JSON.parse(e.data)
			this.msgList.push(msg)
		}, 

		disconnect(){
			if(ws.readyState === WebSocket.OPEN){
				ws.close()
			}
		}
	}
}
</script>