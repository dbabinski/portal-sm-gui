Vue.component("view-kody-jednorazowe", {
    data() {
        return {
            kody: [],
            limit: 20,
            liczbaDostepnychRekordow: 0
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.kody.length == this.liczbaDostepnychRekordow;
        }
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.filter.focus();
    },
    methods: {
        loadData() {
            this.kody = [];
            this.appendData();
        },
        refreshData(insert = false) {
            this.appendData(true);
        },
        appendData(refresh = false) {
            let self = this;
            self.$nextTick(function() {
                app.showLoadingToast();
                let params = {
                    filter: self.$refs.filter.value,
                    limit: self.limit,
                    offset: self.kody.length,
                    refresh: refresh
                };
                if(refresh === true) {
                    self.kody = [];
                }
                fetch("/euslugi-zarzadzanie-server/jednorazowe-kody-dostepu/lista", {
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
                            self.liczbaDostepnychRekordow =
                                json.dane.liczbaDostepnychRekordow;
                            json.dane.kody.forEach(kod => {
                                self.kody.push(kod);
                            });
                        }
                    });
            });
        },
        addItem() {
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
            // pobieranie świeżych danych
            fetch("/euslugi-zarzadzanie-server/jednorazowe-kody-dostepu/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.kod = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        confirmDeleteItem(object) {
            this.$refs.dialogUsun
                .setMessage("Czy usunąć kod: <i>" + object.kod + "</i> ?")
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/jednorazowe-kody-dostepu/" + object.id,
                null,
                this.refreshData
            );
        },
        saveItem(object) {
            fetch("/euslugi-zarzadzanie-server/jednorazowe-kody-dostepu/", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(object)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Kod został zapisany");
                        this.$refs.formularz.clear();
                        this.$refs.formDialog.hide();
                    }
                    this.refreshData();
                });
        },
        closeForm() {
            this.$refs.formDialog.hide();
        },
        filter(value) {
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
    <div class='view-kody-jednorazowe'>
        <sm-filter ref='filter' class='filter' label='Filtr' placeholder="kod lub PESEL" @on-submit="filter"></sm-filter>

        <table class='kody'>
            <tr class='border-bottom'>
                <th class='lp'>Lp.</th>
                <th>Kod</th>
                <th>PESEL</th>
                <th>Ważny do</th>
                <th>Czas utworzenia</th>
                <th>Czas użycia</th>
                <th class='button-td'>
                    <span>Dodaj nowy kod</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy kod' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='(kod, index) in kody' :key="kod.id" :id="'kod-' + kod.id">
                <td class='lp'><span>Lp.</span>{{index + 1}}</td>
                <td class='monospace'><span>Kod</span>{{kod.kod}}</td>
                <td class='monospace'><span>PESEL</span>{{kod.pesel}}</td>
                <td><span>Ważny do</span>{{kod.waznyDo}}</td>
                <td><span>Czas utworzenia</span>{{kod.znacznikCzasuUtworzenia}}</td>
                <td><span>Czas użycia</span>{{kod.znacznikCzasuUzycia}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń kod" :object="kod" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="kod" title='Edytuj kod' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{kody.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>

        <sm-form-dialog ref='formDialog' label="Kod jednorazowy">
            <form-kod-jednorazowy ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-kod-jednorazowy>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});
