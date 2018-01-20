<template>
	<div>
		<h1 class="text-center">Tester</h1>
		<v-pagination :meta="meta" ></v-pagination>
	</div>
</template>

<script>
import pagination from 'cpn/pagination'

export default {
	data() {
		return {
			meta: {
                "current_page": 1,
                "total_pages": 2,
			}
		}
	},
	methods: {
		getData(page) {
			this.meta.current_page = page
		}
	},
	components: {
		'vPagination': pagination,
	}
}
</script>

<style lang="scss">
	@import '~style/app';
</style>