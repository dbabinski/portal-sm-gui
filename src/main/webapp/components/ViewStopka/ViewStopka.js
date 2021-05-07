Vue.component("view-stopka", {
    data() {
        return {
            exist: false,
            content: null
        }
    },
    mounted() {
        let self = this;
        fetch(
            "/euslugi-zarzadzanie-server/portal/stopka", {
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
                    self.content = json.dane.stopka;
                    if(!utils.isNull(self.content)) {
                        this.exist = true;
                    }
                }
            });
    },
    methods: {
    },
    template: `
    <div ref='stopka' v-show='exist' class='view-stopka' v-html='content'></div>
    `
});