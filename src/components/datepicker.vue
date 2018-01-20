<template>
	<input type="date" @input="typeing" >	
</template>


<script>
require('foundation-sites')
require('foundation-datepicker/js/foundation-datepicker')
require('foundation-datepicker/js/locales/foundation-datepicker.zh-TW')

export default {
	props: {
		start: String,
		end: String,
		startView: String,
		minView: String,
		maxView: String,
		format: {
			type: String,
			default: 'yyyy-mm-dd'
		},
		pickTime: {
			type: Boolean,
			default: false,
		}
	},

	methods: {
		typeing(e) {
			this.$emit('input', e.target.value)
		}
	},

	

	mounted() {
		let vm = this, el = this.$el
		$(el).fdatepicker({
			format: vm.format,
			leftArrow:'<<',
			rightArrow:'>>',
			language: 'zh-TW',
			pickTime: vm.pickTime,
			startView: vm.startView,
			minView: vm.minView,
			maxView: vm.maxView,
			onRender: function(date) {
				if (vm.start) {
					let data = new Date(vm.start).valueOf()
					return date.valueOf() < data ? 'disabled' : ''
				}

				if (vm.end) {
					let data = new Date(vm.end).valueOf()
					return date.valueOf() > data ? 'disabled' : ''
				}
			}
		}).on('changeDate', function(e) {
			vm.$emit('input', $(this).val())
		}).data('datepicker')

		if (el.value) vm.$emit('input', el.value)
	}
}
</script>
