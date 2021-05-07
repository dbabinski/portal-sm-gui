Vue.component("view-logowania-do-systemu", {
    data: function() {
        return {
            logowania: [],
            limit: 20,
            liczbaDostepnychRekordow: 0
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.logowania.length == this.liczbaDostepnychRekordow;
        }
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.filter.focus();
    },
    methods: {
        loadData() {
            this.logowania = [];
            this.appendData();
        },
        appendData(refresh) {
            this.$nextTick(function() {
                app.showLoadingToast();
                let params = {
                    filterText: this.$refs.filter.textValue,
                    filterDataOd: this.$refs.filter.dataOdValue,
                    filterDataDo: this.$refs.filter.dataDoValue,
                    limit: this.limit,
                    offset: this.logowania.length,
                    refresh: refresh != undefined ? refresh : false,
                    sort: "DESC"
                };
                if(refresh === true) {
                    this.logowania = [];                    
                }
                fetch("/euslugi-zarzadzanie-server/logowania", {
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
                            json.dane.logowania.forEach(logowania => {
                                this.logowania.push(logowania);
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
        filter(valueText, valueDataOd, ValueDataDo) {
            this.loadData();
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
    template: `
    <div class='view-logowania-do-systemu'>
        <div class='view-header'>Logowania do systemu</div>

        <sm-filter-dates ref='filter' class='filter' label='Filtr' placeholder=" ID, Adres IP, Opis, Konto" @on-submit="filter"></sm-filter-dates>

        <table class='logowania'>
            <tr class='border-bottom'>
                <th>ID</th>                
                <th>Data</th>
                <th>Czas</th>
                <th>Adres IP</th>
                <th>Opis</th>
                <th>Konto</th>
                <th></th>
            </tr>

            <tr v-for='(logowania, index) in logowania' :key="logowania.id" :id="'logowania-' + logowania.id">                
                <td><span>ID</span>{{logowania.id}}</td>
                <td><span>Data</span>{{logowania.data}}</td>
                <td><span>Czas</span>{{logowania.czas}}</td>
                <td class='monospace'><span>Adres</span>{{logowania.ip}}</td>
                <td><span>Konto</span>{{logowania.opis}}</td>
                <td><span>Konto</span>{{logowania.uuidKonta}}</td>
                <td class='button-td'><sm-button label='<i class="fas fa-list-ul"></i>' :object="logowania" title='Szczegóły' @on-click='showItem'></sm-button></td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{logowania.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>

        <sm-form-dialog ref='formLogowania' label="Szczegółowe informacje">
            <form-logowania ref='formularzLogowania' @on-cancel='closeForm'></form-logowania>
        </sm-form-dialog>
    </div>
    `
});
