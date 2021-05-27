Vue.component("view-aktualnie-zalogowani", {
    data: function() {
        return {
            logowania: [],
            limit: 20,
            liczbaDostepnychRekordow: 0,
            czasAutoOdswierzania : 5,
            listaPozycjiComboBox: [
                { nazwa: "1 sekunda", wartosc:1}, 
                { nazwa: "5 sekund", wartosc: 5}, 
                { nazwa: "10 sekund", wartosc: 10}, 
                { nazwa: "15 sekund", wartosc: 15}, 
                { nazwa: "30 sekund", wartosc: 30}, 
                { nazwa: "brak", wartosc: -1}, 
            ],
            domyslnaPozycjaComboBox: { nazwa: "brak", wartosc: -1},
            comboWybrane: -1,
            licznikCzasu: '',
            filterValue: null,
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.logowania.length == this.liczbaDostepnychRekordow;
        },
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.combo.loadComboBoxData(this.listaPozycjiComboBox, this.domyslnaPozycjaComboBox);
        this.$refs.filter.focus();
        this.wyznaczInterwal();
    },
    created() {
        this.timer
    },
    methods: {
        wyznaczInterwal(){
            if(this.comboWybrane == -1){
                this.wylaczInterval();
            } else {
                this.wylaczInterval();
                this.licznikCzasu = setInterval(function(){
                    this.loadData();
                }.bind(this), (this.comboWybrane * 1000));
            }
        },
        wylaczInterval(){
            clearInterval(this.licznikCzasu);
        },
        loadData() {
            this.logowania = [];
            this.appendData();
        },
        appendData(refresh) {
            this.$nextTick(function() {
                app.showLoadingToast();
                let params = {
                    filterText: this.filterValue,
                    limit: this.limit,
                    offset: this.logowania.length,
                    refresh: refresh != undefined ? refresh : false,
                    sort: "DESC"
                };
                if(refresh === true) {
                    this.logowania = [];                    
                }
                fetch("/sm-portal-server/zalogowani", {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(params)
                })
                    .then(res => {
                        app.hideLoadingToast();
                        return app.handleErrors(res);
                    })
                    .then(res => res.json())
                    .then(json => {
                        if (json.blad === true) {
                            app.getMessageDialog()
                                .setMessage(json.komunikat)
                                .show();
                        } else {
                            this.liczbaDostepnychRekordow =
                                json.dane.liczbaDostepnychRekordow;
                            json.dane.aktualnieZalogowani.forEach(aktualnieZalogowani => {
                                this.logowania.push(aktualnieZalogowani);
                            });                            
                        }
                    });
            });
        },
        refreshData() {
            this.appendData(true);
        },
        showItem(object) {
            this.$refs.formularzLogowania.clear();
            this.$refs.formularzLogowania.logowanie = utils.copyJSON(object);
            this.$refs.formularzLogowania.focus();
            this.$refs.formLogowania.show();
        },
        closeForm() {
            this.$refs.formLogowania.hide();
        },
        filter(value) {
            this.filterValue = value;
            this.wyznaczInterwal();
            this.loadData();
        },
        change(valueChange){
            this.comboWybrane = valueChange;
        },
        scroll() {
            window.onscroll = function() {
                let element = this.$el;
                if(utils.isInViewport(this.$el)) {
                    let bottomOfWindow =
                        document.documentElement.scrollTop + window.innerHeight ===
                        document.documentElement.offsetHeight;
                    if (bottomOfWindow) {
                        this.appendData();
                    }
                }
            }.bind(this);
        }
    },
    beforeDestroy () {
        this.wylaczInterval();
    },
    template: `
    <div class='view-aktualnie-zalogowani'>
        <div class='view-header'>Aktualnie zalogowane konta</div>
        <div class='filterContainer'>
            <sm-combobox class='combo' ref='combo' label='Automatyczne odświerzanie co:' @on-change="change"></sm-combobox>
            <sm-filter ref='filter' class='filter' label='Filtr' placeholder="Konto, Email konta, Adres IP, Czas wygaśnięcia, Aplikacja" @on-submit="filter"></sm-filter>
        </div>
        <table class='zalogowani'>
            <tr class='border-bottom'>
                <th>Konto</th>
                <th>Email konta</th>                
                <th>Adres IP</th>
                <th>Czas wygaśnięcia</th>
                <th>Aplikacja</th>
            </tr>

            <tr v-for='(logowania, index) in logowania' :key="logowania.id" :id="'logowania-' + logowania.id">                
                <td>{{logowania.uuid}}</td>
                <td>{{logowania.email}}</td>
                <td>{{logowania.ip}}</td>
                <td>{{logowania.dataWygasniecia}}</td>
                <td>{{logowania.aplikacja}}</td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{logowania.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>
    </div>
    `
});
