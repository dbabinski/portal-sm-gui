Vue.component("view-logi", {
    data: function() {
        return {
            logi: [],
            limit: 20,
            liczbaDostepnychRekordow: 0
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.logi.length == this.liczbaDostepnychRekordow;
        }
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.filter.focus();
    },
    methods: {
        loadData() {
            this.logi = [];
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
                    offset: this.logi.length,
                    refresh: refresh != undefined ? refresh : false,
                    sort: "DESC"
                };
                if(refresh === true) {
                    this.logi = [];                    
                }
                fetch("/sm-portal-server/logi", {
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
                            json.dane.logi.forEach(log => {
                                this.logi.push(log);
                            });                            
                        }
                    });
            });
        },
        refreshData() {
            this.appendData(true);
        },
        showItem(object) {
            this.$refs.formularzLog.clear();
            this.$refs.formularzLog.log = utils.copyJSON(object);
            this.$refs.formularzLog.focus();
            this.$refs.formLogi.show();
        },
        closeForm() {
            this.$refs.formLogi.hide();
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
    <div class='view-logi'>
        <div class='view-header'>Logi systemu</div>

        <sm-filter-dates ref='filter' class='filter' label='Filtr' placeholder=" ID, Adres IP, Obiekt, ID obiektu, PID, Typ oeracji, Konto" @on-submit="filter"></sm-filter-dates>

        <table class='logi'>
            <tr class='border-bottom'>
                <th>ID</th>                
                <th>Data</th>
                <th>Czas</th>
                <th>Adres IP</th>
                <th>Obiekt</th>
                <th>ID obiektu</th>
                <th>PID</th>
                <th>Typ operacji</th>
                <th>Konto</th>
                <th></th>
            </tr>

            <tr v-for='(logi, index) in logi' :key="logi.id" :id="'logi-' + logi.id">                
                <td><span>ID</span>{{logi.id}}</td>
                <td><span>Data</span>{{logi.data}}</td>
                <td><span>Czas</span>{{logi.czas}}</td>
                <td class='monospace'><span>Adres</span>{{logi.ip}}</td>
                <td><span>Obiekt</span>{{logi.tabelaObiektu}}</td>
                <td class='monospace'><span>ID obiektu</span>{{logi.idObiektu}}</td>
                <td class='monospace'><span>PID</span>{{logi.pid}}</td>
                <td><span>Typ operacji</span>{{logi.typOperacji}}</td>
                <td><span>Konto</span>{{logi.uuidKonta}}</td>
                <td class='button-td'><sm-button label='<i class="fas fa-list-ul"></i>' :object="logi" title='Szczegóły' @on-click='showItem'></sm-button></td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{logi.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>

        <sm-form-dialog ref='formLogi' label="Szczegółowe informacje">
            <form-logi ref='formularzLog' @on-cancel='closeForm'></form-logi>
        </sm-form-dialog>
    </div>
    `
});
