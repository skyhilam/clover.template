<template>
	<canvas></canvas>
</template>

<script>
import Chart from 'chart.js'

export default {
	props: {
		type: {
			type: String,
		},
		labels: {
			type: Array,
		},
		datasets: {
			type: Array,
		}
	},
	data() {
		return {
			mychart: null
		}
	},

	watch: {
		labels(labels) {
			this.mychart.data.labels = labels
			this.mychart.update()
		},
		datasets(datasets) {
			this.mychart.data.datasets = datasets
			this.mychart.update()
		}
	},

	mounted() {
		var ctx = this.$el.getContext('2d');
		this.mychart = new Chart(ctx, {
		    type: this.type,
		    data: {
		        labels: this.labels,
		        datasets: this.datasets
		    },
		    options: {
		        scales: {
		            yAxes: [{
		                ticks: {
		                    beginAtZero:true
		                }
		            }]
		        }
		    }
		});
	}
}
</script>

