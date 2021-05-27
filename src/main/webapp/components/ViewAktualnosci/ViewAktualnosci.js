Vue.component("view-aktualnosci", {
    data() {
        return {
            rejestracjaURL: null,
            wynikiURL: null
        };
    },
    computed: {
        logged() {
            return !utils.isNull(store.getters.email);
        }
    },    
    methods: {      
    },
    mounted() {
        let self = this;
        fetch("/sm-portal-server/serwis/konfiguracja/domena")
            .then(res => res.json())
            .then(json => {
                self.rejestracjaURL = location.protocol + "//rejestracja" + json.dane.domena;
                self.wynikiURL = location.protocol + "//wyniki" + json.dane.domena;
            })
            .catch(error => {
                console.log(error);
            });
    },
    template: `
    <div class='view-aktualnosci'>
        <view-aktualnosci-lista class='tabela-aktualnosci' v-show='logged'></view-aktualnosci-lista>
        <view-aktualnosci-opublikowane></view-aktualnosci-opublikowane>
    </div>
    `
});