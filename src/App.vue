<template>
	<div>
		<h1 class="text-center">Tester</h1>
		<v-select ref="selector" :options="{data: data}" v-on:selected="select2Selected" ></v-select>
		<a href="#" @click.prevnet="change">change options</a>
		{{data}}
	</div>
</template>

<script>
import select2 from 'cpn/select2'


export default {
	data() {
		return {
			data: [{
			    "text": "HKD",
			    "id": 23
			}, {
			    "text": "RMB",
			    "id": 24
			}, {
			    "text": "JPY",
			    "id": 25
			}, {
			    "text": "TWD",
			    "id": 26
			}, {
			    "text": "Bi",
			    "id": 28
			}, {
			    "text": "MOP",
			    "id": 29
			}],
		}
	},
	methods: {
		select2Selected(val) {
			console.log(val)
		},
		change() {
			this.data = [
				{
				    "text": "TWD",
				    "id": 26
				}, {
				    "text": "Bi",
				    "id": 28
				}, {
				    "text": "MOP",
				    "id": 29
				}
			]

			// console.log(this.$refs.selector.options)

			this.$refs.selector.refresh()
		}
	},

	components: {
		'vSelect': select2,
	}
}
</script>

<style lang="scss">
	@import '~style/app';
</style>