Vue.component("view-wersja", {
    data() {
        return {
            exist: false,
            content: null
        }
    },
    mounted() {
        let self = this;
        fetch(
            "/euslugi-zarzadzanie-server/wersja", {
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
                    self.content = json.dane.version + " (" + json.dane.date + ")" ;
                    if(!utils.isNull(self.content)) {
                        this.exist = true;                        
                    }
                }
            });         
    },
    methods: {
    },
    template: `
    <div ref='wersja' v-show='exist' class='view-wersja' v-html='content'></div>
    `
});