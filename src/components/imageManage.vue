<template>
<div>
	<div class="panel-cover" @click="cancel"></div>
	
	<div class="panel manage">
		<div class="panel-heading">
			<b>Image manage</b>
			<a @click.prevent="cancel" class="float-right">Cancel</a>
		</div>
		<div class="panel-body" v-if="upload.active">
			<div class="uploading">
				Uploading...
			</div>
		</div>
		<div class="panel-body" v-else>
			<form @submit.prevent="submit(url)">
				<label for="url">URL</label>
				<div class="input-group">
					<input type="text" class="input-group-field" v-model="url">
					<div class="input-group-button">
						<button type="submit" class="button">Submit</button>
					</div>
				</div>
			</form>

			<form @submit.prevent="submit(selected)">
				<div class="callout secondary">
					<div class="row medium-up-6">
						<div class="column" v-for="record in response.records.data" >
							<div class="image" :class="{active: selected == record.url}" :key="record.id" @click="selected = record.url" v-on:dblclick="submit(record.url)">
								<img :src="record.url">
							</div>
							<br>
						</div>
					</div>

					<p v-if="!response.records.data">No data.</p>
				</div>
				<div class="row">
					<div class="columns medium-3">
						<button type="submit" class="button">Submit</button>
						<button type="button" class="button" @click="cancel">Cancel</button>
					</div>
					<div class="columns medium-9 text-right">
						<button type="button" class="button" @click="selectImage">Upload</button>
						<button type="button" class="button" @click="getRecords(provPage)" :disabled="!hasProv">&laquo;</button>
						<button type="button" class="button" @click="getRecords(nextPage)" :disabled="!hasNext">&raquo;</button>
					</div>
				</div>

				<div class="row">
					<div class="columns">
						<span class="form-error is-visible" v-if="error">
                            {{ error }}
                        </span>
					</div>
				</div>
			</form>
		</div>

	</div>
</div>


</template>

<script>
import Quill from 'quill'
import Delta from 'quill-delta'
import objectToFormData from 'object-to-formdata'

export default {
	props: {
		quill: Object,
		close: {
			type: Function
		},
		endpoint: {
			type: String,
			default: '/api/datatable/images'
		}
	},
	data() {
		return {
			selected: '',
			url: '',
			response: {
				records: {}
			},
			error: '',
			upload: {
				active: false,
			}
		}
	},
	methods: {
		submit(url) {
			this.insertImage(url)
			this.cancel()
		},

		cancel() {
			if (!this.upload.active) this.close()
		},

		insertImage(url) {
			let range = this.quill.getSelection(true);
			this.quill.updateContents(new Delta()
	            .retain(range? range.index: 0)
	            .delete(range? range.length: 0)
	            .insert({ image: url })
	        )
		},

		imageAutosize() {
			$('.image').height($('.image').width())
		},

		selectImage() {
			
			let input = document.createElement('input')
			input.setAttribute('type', 'file')

			input.addEventListener('change', this.selectedFiles)
			input.click()

		},

		selectedFiles(e) {
			let files = e.target.files || e.dataTransfer.files

			if (!files.length) {
				this.error = '不能留空'
			}else {
				this.upload.active = true
				axios.post(this.endpoint, objectToFormData({image: files[0]}))
					.then(resp => {
						this.upload.active = false
						this.insertImage(resp.data.url)
						this.cancel()
					})
					.catch(error => {
						this.upload.active = false
						if (error.response.status == 422) {
							this.error = error.response.data.errors.image[0]
						}else {
							alert('error')
						}
					})
			}
		},

		getRecords(page) {
			axios.get(this.endpoint, {params: {page: page}})
				.then(resp => {
					this.response = resp.data
				})
				.then(() => {
					this.imageAutosize()
				})
		}
	},

	computed: {
		hasProv() {
			const meta = this.response.records.meta
			return !meta? false: meta.pagination.current_page - 1 < 1? false: true
		},
		hasNext() {
			const meta = this.response.records.meta
			return !meta? false: meta.pagination.current_page + 1 > meta.pagination.total_pages? false: true
		},
		provPage() {
			return this.hasProv? this.response.records.meta.pagination.current_page - 1: 1
		},
		nextPage() {
			return this.hasNext? this.response.records.meta.pagination.current_page + 1: 1
		}
	},

	mounted() {
		this.getRecords()
	}
}
</script>

<style lang="scss" scoped>
.image {
	background-color: white;
	border: 5px solid white;
	&.active {
		border-color: #1779ba;
	}
}

.uploading {
	text-transform: uppercase;
	font-size: 48px;
	text-align: center;
	line-height: 256px;
	letter-spacing: 2px;
}
</style>