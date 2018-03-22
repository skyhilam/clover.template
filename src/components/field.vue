<template>
	<div>
		<slot ></slot>
		<span class="form-error is-visible" v-if="error">{{ error[0] }}</span>
	</div>
</template>


<script>
	export default {
		props: ['error']
	}
</script>