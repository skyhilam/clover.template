
<template>
  <div class="autocomplete-wrapper">
    <input  type="text"
            :id="id"
            class="autocomplete-input"
            :placeholder="placeholder"
            :name="name"
            v-model="type"
            @input="input(type)"
            @dblclick="showAll"
            @blur="hideAll"
            @keydown="keydown"
            @focus="focus"
            :autofocus="autofocus"
            autocomplete="off"  />

    <div class="autocomplete transition autocomplete-list" v-show="showList">
      <ul>
        <li v-for="(data, i) in list"
            transition="showAll"
            :class="activeClass(i)">

          <a  href="#"
              @click.prevent="selectList(data)"
              @mousemove="mousemove(i)">
            <b>{{ data[anchor] }}</b>
            <span>{{ data[label] }}</span>
          </a>

        </li>
        <li v-if="loading">
          <a href="#" class="disabled"><span><b>Loading...</b></span></a>
        </li>
        <li v-if="!list.length && !loading">
          <a href="#" class="disabled"><span><b>Nothing...</b></span></a>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
  import debounce from 'lodash'
  export default {

    props: {
      id: String,
      className: String,
      placeholder: String,
      name: String,
      autofocus: Boolean,
      debounceTime: {
        Type: Number,
        default: 500
      },

      // Intial Value
      initValue: {
        type: String,
        default: ""
      },

      // Anchor of list
      anchor: {
        type: String,
        required: true
      },

      // Label of list
      label: String,

      // ajax URL will be fetched
      url: {
        type: String,
        required: true
      },

      // query param
      param: {
        type: String,
        default: 'q'
      },

      // Custom Params
      customParams: Object,

      // minimum length
      min: {
        type: Number,
        default: 0
      },

      // maxmum length
      max: {
        type: Number,
        default: 10
      },

      // Callback
      onInput: Function,
      onShow: Function,
      onBlur: Function,
      onHide: Function,
      onFocus: Function,
      onSelect: Function,
      onBeforeAjax: Function,
      onAjaxProgress: Function,
      onAjaxLoaded: Function,

    },

    data() {
      return {
        showList: false,
        type: "",
        json: [],
        focusList: "",
        loading: false,
      };
    },


    methods: {

      // Netralize Autocomplete
      clearInput() {
        this.showList = false
        this.type = ""
        this.json = []
        this.focusList = ""
      },

      // Get the original data
      cleanUp(data){
        return JSON.parse(JSON.stringify(data));
      },
      
      input: debounce(val => {
        this.showList = true;

        // Callback Event
        this.onInput ? this.onInput(val) : null
        this.$emit('input', val);

        // Get The Data
        this.getData(val)
      }, this.debounceTime),

      showAll(){
        this.json = [];

        this.getData("")

        // Callback Event
        this.onShow ? this.onShow() : null

        this.showList = true;
      },

      hideAll(e){
        // Callback Event
        this.onBlur ? this.onBlur(e) : null

        setTimeout(() => {

          // Callback Event
          this.onHide ? this.onHide() : null

          this.showList = false;
        },250);
      },

      focus(e){
        this.focusList = 0;

        // Callback Event
        this.onFocus ? this.onFocus(e) : null
      },

      mousemove(i){
        this.focusList = i;
      },

      keydown(e){
        let key = e.keyCode;
        // Disable when list isn't showing up
        if(!this.showList) return;

        switch (key) {
          case 40: //down
            this.focusList++;
          break;
          case 38: //up
            this.focusList--;
          break;
          case 13: //enter
            this.selectList(this.list[this.focusList])
            this.showList = false;
            e.preventDefault();
          break;
          case 27: //esc
            this.showList = false;
          break;
        }

        // When cursor out of range
        let listLength = this.list.length - 1;
        this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;

      },

      // keydownEnter(e) {
      //   if (this.showList) {
      //     this.selectList(this.list[this.focusList])
      //     this.showList = false;
      //     e.preventDefault();
      //   }
      // },


      activeClass(i){
        return {
          'focus-list' : i == this.focusList
        };
      },

      selectList(data){
        let clean = this.cleanUp(data);

        // Put the selected data to type (model)
        this.type = clean[this.anchor];

        this.showList = false;

        /**
        * Callback Event
        * Deep clone of the original object
        */
        this.onSelect ? this.onSelect(clean) : null
      },

      getData(val){
        let self = this;

        if (val.length < this.min) return;

        if(this.url != null){

          // Callback Event
          this.onBeforeAjax ? this.onBeforeAjax(val) : null



          let params = ""
          if(this.customParams) {
            Object.keys(this.customParams).forEach((key) => {
              params += `&${key}=${this.customParams[key]}`
            })
          }

          this.loading = true

          axios.get(`${this.url}?${this.param}=${val}${params}`, {
            diabledloader: true,
            onDownloadProgress(progressEvent) {
              this.onAjaxProgress ? this.onAjaxProgress(data) : null
            }
          })
            .then(resp => {
              this.loading = false

              let json = resp.data;
              // Callback Event
              this.onAjaxLoaded ? this.onAjaxLoaded(json) : null;

              this.json = json;

            })
            .catch(error => {
              this.loading = false
            });

        }
      },

      setValue(val) {
        this.type = val
      }
    },
    
    created(){
      // Sync parent model with initValue Props
      this.type = this.initValue ? this.initValue : ''
    },

    computed: {
      list() {
        var filterKey = String(this.type).toLowerCase();
        return this.json.filter(item => {
          return String(item[this.anchor]).toLowerCase().match(filterKey) || String(item[this.label]).toLowerCase().match(filterKey);
        }).slice(0, this.max);
      }
    },

  }

</script>


<style lang="scss" scoped>
$medium-gray: #cacaca;
$dark-gray: #8a8a8a;
$input-border-focus: 1px solid $dark-gray;
$input-shadow-focus: 0 0 5px $medium-gray;
$primary-color: #1779ba;

.transition, .autocomplete, .showAll-transition, .autocomplete ul, .autocomplete ul li a{
  transition:all 0.1s ease-out;
  -moz-transition:all 0.1s ease-out;
  -webkit-transition:all 0.1s ease-out;
  -o-transition:all 0.1s ease-out;
}

.autocomplete ul{
  font-family: sans-serif;
  position: absolute;
  list-style: none;
  background: #f8f8f8;
  padding: 10px 0;
  top: 55px;
  margin: 0;
  margin-top: rem-calc(-17);
  border: $input-border-focus;
  box-shadow: $input-shadow-focus;
  display: inline-block;
  width: 100%;
  z-index: 999;
  
}



.autocomplete ul li a{
  text-decoration: none;
  display: block;
  background: #f8f8f8;
  color: #2b2b2b;
  padding: 5px;
  padding-left: 10px;

  &.disabled {
    cursor: default;
  }
}

.autocomplete ul li a:not(.disabled):hover, .autocomplete ul li.focus-list a:not(.disabled){
  color: white;
  background: $primary-color;
}

.autocomplete ul li a span{
  display: block;
  margin-top: 3px;
  color: grey;
  font-size: 13px;
}

.autocomplete ul li a:not(.disabled):hover span, .autocomplete ul li.focus-list a:not(.disabled) span{
  color: white;
}

.showAll-transition{
  opacity: 1;
  height: 50px;
  overflow: hidden;
}

.showAll-enter{
  opacity: 0.3;
  height: 0;
}

.showAll-leave{
  display: none;
}

.autocomplete-wrapper {
  position: relative;
}
</style>