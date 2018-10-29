const PRICE = 9.99;

new Vue({
    el: '#app',
    data: {
        total: 0,
        items: [],
        cart: [],
        newSearch: 'anime',
        lastSearch: '',
        loading: false,
        price: PRICE
    },
    methods: {

        onSubmit() {
            this.items = [];
            this.loading = true;

            this.$http.get(`/search/${this.newSearch}`)
                .then(res => {
                    this.lastSearch = this.newSearch;
                    this.items = res.data;
                    this.loading = false
                })
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

    filters: {
        currency(price) {
            return `$ ${price.toFixed(2)}`;
        }
    },

    mounted() {
        this.onSubmit();
    }
});