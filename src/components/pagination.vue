<template>
<nav v-if="meta && sections > 1">
    <ul class="pagination " role="navigation" aria-label="Pagination">
        <li>
            <a href="#" @click.prevent="switched(meta.current_page - 1)">&laquo;</a>
        </li>

        <template v-if="section > 1">
            <li>
                <a href="#" @click.prevent="switched(1)">1</a>
            </li>

            <li>
                <a href="#" @click.prevent="goBackASection">...</a>
            </li>
        </template>
        
        <li v-for="page in pages" :class="{current: meta.current_page === page}">
            <template v-if="meta.current_page === page">
                <span>{{page}}</span>
            </template>
            <template v-else>
                <a href="#" @click.prevent="switched(page)">{{page}}</a>
            </template>
        </li>

        <template v-if="section < sections">
            <li>
                <a href="#" @click.prevent="goForwardASection">...</a>
            </li>
            <li>
                <a href="#" @click.prevent="switched(meta.total_pages)">{{meta.total_pages}}</a>
            </li>
        </template>

        <li>
            <a href="#" @click.prevent="switched(meta.current_page + 1)">&raquo;</a>
        </li>
       
    </ul>
</nav>
</template>

<script>
import {range} from 'lodash'

export default {
    props: ['meta'],
    data() {
        return {
            numberPerSection: 7
        }
    },
    computed: {
        section() {
            return Math.ceil(this.meta.current_page / this.numberPerSection)
        },
        sections() {
            return Math.ceil(this.meta.total_pages / this.numberPerSection)
        },
        lastPage() {
            let lastPage = (this.section - 1) * this.numberPerSection + this.numberPerSection

            if (this.section === this.sections) {
                lastPage = this.meta.total_pages
            }

            return lastPage
        },
        pages() {
            return range(
                (this.section - 1) * this.numberPerSection + 1, 
                this.lastPage + 1
            )
        }

    },
    methods: {
        switched(page) {
            if (page <= 0 || page > this.meta.total_pages) {
                return 
            }

            this.$emit('pagination:switched', page)
        },

        goBackASection() {
            this.switched(
                this.firstPageOfSection(this.section - 1)
            )
        },

        goForwardASection() {
            this.switched(
                this.firstPageOfSection(this.section + 1)
            )
        },

        firstPageOfSection(section) {
            return (section - 1) * this.numberPerSection + 1
        }
    }
}
</script>
