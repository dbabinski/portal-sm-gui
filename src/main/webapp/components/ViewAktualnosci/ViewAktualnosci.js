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
        fetch("/euslugi-zarzadzanie-server/serwis/konfiguracja/domena")
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
        <div class='margin-top-2x margin-bottom-2x'>
            <a :href='rejestracjaURL' target='_blank' tabindex='-1'><sm-button class='button' label='e-Rejestracja'></sm-button></a>
            <a :href='wynikiURL' target='_blank' tabindex='-1'><sm-button class='button' label='e-Wyniki'></sm-button></a>
        </div>
        <view-aktualnosci-lista class='tabela-aktualnosci' v-show='logged'></view-aktualnosci-lista>
        <view-aktualnosci-opublikowane></view-aktualnosci-opublikowane>
    </div>
    `
});