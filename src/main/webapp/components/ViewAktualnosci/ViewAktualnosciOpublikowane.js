Vue.component("view-aktualnosci-opublikowane", {
    data() {
        return {
            aktualnosci: []
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load: function() {
            fetch("/euslugi-zarzadzanie-server/portal/aktualnosci/opublikowane")
                .then(res => {
                    return app.handleErrors(res);
                })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        console.log(json.komunikat);
                    } else {
                        this.aktualnosci = json.dane.aktualnosci;
                    }
                });
        }
    },
    template: `
    <div class='view-aktualnosci-opublikowane'>
        <div v-for='artykul in aktualnosci' :key="artykul.id" class='article'>            
            <div class='title'>
                {{artykul.tytul}}
            </div>
            <div class='meta'>
                {{artykul.dataPublikacji}} {{artykul.autor}}
            </div>
            <div class='content' v-html='artykul.tresc'>
            </div>
        </div>       
    </div>
    `
});