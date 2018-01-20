<template>
	<div>
		<h1 class="text-center">Tester</h1>

	</div>
</template>

<script>
import editor from 'cpn/editor'

export default {
	data() {
		return {
			meta: {
                "current_page": 1,
                "total_pages": 100,
			}
		}
	},
	methods: {
		getData(page) {
			this.meta.current_page = page
		}
	},
	components: {
		'vEditor': editor,
	}
}
</script>

<style lang="scss">
	@import '~style/app';
</style>