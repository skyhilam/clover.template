import Vue from 'vue'
import App from './App.vue'

window.$ = window.jQuery = require('jquery')
require('select2')
window.axios = require('axios')
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'


new Vue({
	el: '#app',
	render: h => h(App),
})



