<template>
	<div class = 'home'>
		<input type = 'text' placeholder = "please input username" v-model = 'username'>
		<button @click = 'handleEnterBtnClick'>Entering Chat Room</button>
	</div>
</template>

<script>
export default {
	name: 'Login', 
	data() {
		return{
			username: ''
		}
	}, 
	mounted(){
		const username = localStorage.getItem('username')
		if(username){
			this.$router.push('/')
			return
		}
	}, 
	methods: {
		handleEnterBtnClick(){
			const username = this.username.trim()

			if(username.length < 6)
			{
				alert('the length of username must be more than 6')
				return
			}

			localStorage.setItem('username', username)
			this.$router.push('/')
		}
	}
}
</script>