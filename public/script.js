const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        results: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {

        appendItem() {
            if (this.items.length < this.results.length) {
                let append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
                this.items = this.items.concat(append);
            }
        },

        onSubmit() {
            if (this.newSearch.length) {
                this.items = [];
                this.loading = true;
    
                this.$http.get(`/search/${this.newSearch}`)
                    .then(res => {
                        this.lastSearch = this.newSearch;
                        this.results = res.data;
                        this.appendItem();
                        this.loading = false
                    })
            }
        },

        addItem(index) {
            this.total += PRICE;
            const pos = this.cart.find(item => item.title == this.items[index].title);

            if (pos) {
                pos.qty += 1
            } else {
                this.cart.push({
                    id: index,
                    title: this.items[index].title,
                    qty: 1,
                    price: PRICE
                });
            }
        },


        inc(item) {
            item.qty++;
            this.total += PRICE;
        },


        dec(item) {
            item.qty--;
            this.total -= PRICE;
            const updatingBasket = (item.qty == 0) ? this.cart.splice(this.cart.indexOf(item), 1) : false;
        }
    },

    computed: {

        noMoreItems() {
            return this.items.length === this.results.length && this.results.length > 0;
        }

    },

    filters: {
        currency(price) {
            return `$ ${price.toFixed(2)}`;
        }
    },

    mounted() {
        this.onSubmit();

        const vueInstance = this;
        const elem = document.getElementById('product-list-bottom');
        const watcher = scrollMonitor.create(elem);
        watcher.enterViewport(() => {
            vueInstance.appendItem();
        });
    }
});