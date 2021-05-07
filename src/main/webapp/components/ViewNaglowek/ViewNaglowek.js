Vue.component("view-naglowek", {
    data() {
        return {
            content: null
        }
    },
    mounted() {
        let self = this;
        fetch(
            "/euslugi-zarzadzanie-server/portal/naglowek", {
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            })
            .then(res => app.handleErrors(res))
            .then(res => res.json())
            .then(json => {
                if(json.blad === true){
                    console.log(json.komunikat);
                } else {
                    self.content = json.dane.naglowek;
                    if(!utils.isNull(self.content)) {
                        this.$refs.naglowek.classList.remove('hidden');
                    }
                }
            });
    },
    methods: {
    },
    template: `
    <div ref='naglowek' class='hidden view-naglowek' v-html='content'></div>
    `
});