Vue.component("sm-combobox", {
    data: function() {
        return {
            wybrane: null,
            listaPozycji: [],
        };
    },
    props: {
        label: {
            default: "Etykieta"
        },
    },
    methods: {
        loadComboBoxData(nowePozycje, domyslna){
            this.listaPozycji = nowePozycje;
            this.wybrane = domyslna.wartosc;
        },
        change: function() {
            this.$emit('on-change', this.wybrane);
        },
    },
    computed:{
        pozycje(){
            return Object.keys(this.clients).map(k => {
                let p = this.listaPozycji[k]
                return `${p}`
            })
        }
    },
    template: `
        <div class="sm-combobox" ref="combo">
            <label for="cars">{{label}}</label>
            <select class="select" v-model="wybrane" v-on:change="change">
                <option v-for="pozycja in listaPozycji" :value="pozycja.wartosc">{{pozycja.nazwa}}</option>
            </select>
        </div>
    `
})