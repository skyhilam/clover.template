<template>
  <div id="quillWrapper">
      
      <div ref="quillContainer" id="quill-container" :style="{'min-height': styleHeight, height: 'auto'}"></div>

      <button v-if="useSaveButton" class="button"
        :class="buttonClass"
        @click="saveContent">
        {{ buttonText ? buttonText : 'Save Content' }}
      </button>

      <div v-if="showPreview" ref="livePreview" class="ql-editor"></div>
      <v-image-manage v-if="manage.active" :close="() => {manage.active = false}" :quill="quill"></v-image-manage>

  </div>
</template>

<script>
import Quill from 'quill'

import ImageResize from './imageResize'
import imageManage from './imageManage'


var defaultToolbar = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'list': 'ordered'}, { 'list': 'bullet' }],

  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['link', 'image'],

  ['clean']
]

export default {
  name: 'vue-editor',
  props: {
    value: String,
    placeholder: String,
    buttonText: String,
    buttonClass: String,
    editorToolbar: Array,
    useSaveButton: {
      type: Boolean,
      default () {
        return false
      }
    },
    showPreview: {
      type: Boolean,
      default () {
        return false
      }
    },
    styleHeight: {
      type: String,
      default: '400px'
    }
  },

  data () {
    return {
      quill: null,
      editor: null,
      manage: {
        active: false
      },
      toolbar: this.editorToolbar ? this.editorToolbar : defaultToolbar
    }
  },

  watch: {
    value (val) {
      this.editor.innerHTML = val
    },
    
  },

  methods: {
    saveContent (value) {
      this.$emit('save-content', this.editor.innerHTML)
    },
    getContent() {
      return this.editor.innerHTML
    },
    set() {
      this.quill = new Quill(this.$refs.quillContainer, {
        modules: {
          toolbar: {
            container: this.toolbar,
            handlers: {
              image: () => {
                this.manage.active = !this.manage.active
              }
            }
          },
          imageResize: {
            displaySize: true,
          }
        },
        placeholder: this.placeholder ? this.placeholder : '',
        theme: 'snow'
      })

      this.editor = $(this.$el).find('.ql-editor')[0]

      this.editor.style['min-height'] = this.styleHeight
    }
  },

  mounted () {
    this.set()

    if (this.value) this.editor.innerHTML = this.value
  },

  components: {
    'vImageManage': imageManage
  }
}
</script>

<style lang="scss" >
@import 'node_modules/quill/dist/quill.core';
@import 'node_modules/quill/dist/quill.snow';

#quill-container {
  font-size: 1rem;
}


</style>