<template>
    <select :multiple="multiple">
        <option v-if="placeholder"></option>
        <option v-for="item in list" :value="item.id" :key="item.id">{{ item.text }}</option>
    </select>
</template>

<script>
import {extend, filter} from 'lodash'

export default {
    props: ['options', 'data-url', 'multiple', 'placeholder', 'value'],
    data() {
        return {
            list: [],
            select2: null
        }
    },
    
    methods: {
        bind(options) {
            return new Promise((resolve, reject) => {
                let self = this
                let data = options.data
                

                // Map any select2 "data" params to the list data array, so vue can bind the list data.
                if (data) {
                    this.list = data
                    options.data = undefined
                }
                
                let select2 = $(this.$el).select2(options).on('change', function() {
                    // Notify the listeners that the values have changed
                    self.notify($(this).val())
                })

                // Populate the list via ajax if "data-url" prop has been defined.
                if (this.dataUrl !== undefined) {
                    this.getList(this.dataUrl)
                        .then(() => {
                            resolve(select2)
                        })
                }else {
                    resolve(select2)
                }
            })

        },
        initValue(select2) {
            let val = this.value
            if (val) {
                select2.val(val).trigger('change')
            }

            this.select2 = select2
        },
        getList(url) {
            return axios.get(url)
                .then(resp => {
                    this.list = resp.data
                })
        },
        flattenArray(key) {
            let list = this.list
            let flattened = []
            for (let i = 0; i < list.length; i++) {
                let value = list[i][key]
                flattened[i] = value.toString()
            }
            return flattened
        },
        filterSelected(filterArray) {
            let ids = this.flattenArray('id')
            // Return all selected values that were pre-loaded (i.e. are in this.list).

            let filtered = filter(ids, x => Array(filterArray).indexOf(x) >= 0)
            return this.multiple? filtered: filtered[0]
        },
        filterCreated(filterArray) {
            let ids = this.flattenArray('id')
            // Return all tags that have been created (i.e. are not in this.list)
            return filter(filterArray, x => ids.indexOf(x) < 0)
        },
        notify(value) {
            this.notifySelected(value)
            this.notifyTagCreated(value)
        },
        notifySelected(value) {
            this.$emit('input', this.filterSelected(value))
        },
        notifyTagCreated(tags) {
            this.$emit('tag-created', this.filterCreated(tags))
        },

        preset() {
            let options = extend({
                theme: "foundation",
                placeholder: this.placeholder,
            }, this.options)
            
            this.bind(options)
                .then(this.initValue)
        },
        destroy() {
            $(this.$el).select2('destroy')
        },  
        refresh() {
            this.destroy()
            this.preset()
        }
    },

    watch: {
        options() {
            this.refresh()
        },

        dataUrl() {
            this.refresh()
        }
    },

    mounted() {
        this.preset()
    },
}
</script>
