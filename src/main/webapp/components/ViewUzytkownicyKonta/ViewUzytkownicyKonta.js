Vue.component("view-uzytkownicy-konta", {
    data() {
        return {
            konta: [],
            limit: 20,
            liczbaDostepnychRekordow: 0
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.konta.length == this.liczbaDostepnychRekordow;
        }
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.filter.focus();
        // let self = this;
        // fetch("/sm-portal-server/uzytkownicy/konta/niepowiazane", {
        //     method: 'GET',
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     }
        // })
        //     .then(res => {
        //         return app.handleErrors(res);
        //     })
        //     .then(res => res.json())
        //     .then(json => {
        //         if (json.blad === true) {
        //             app.getMessageDialog()
        //                 .setMessage(json.komunikat)
        //                 .show();
        //         } else {
        //             let niepowiazane = json.dane.konta;
        //             niepowiazane.forEach(function(niepowiazany) {
        //                 niepowiazany.etykieta =
        //                     (!utils.isNull(niepowiazany.login) ? niepowiazany.login : "") +
        //                     (!utils.isNull(niepowiazany.email) ? " (" + niepowiazany.email + ")" : "")
        //             });
        //             self.$refs.formularzWybor.lista = niepowiazane;
        //         }
        //     });
    },
    methods: {
        loadData() {
            this.konta = [];
            this.appendData();
        },
        refreshData() {
            this.appendData(true);
        },
        appendData(refresh) {
            this.$nextTick(function() {
                app.showLoadingToast();
                let params = {
                    filter: this.$refs.filter.value,
                    limit: this.limit,
                    offset: this.konta.length,
                    refresh: refresh != undefined ? refresh : false
                };
                if(refresh === true) {
                    this.konta = [];
                }
                fetch("/sm-portal-server/uzytkownicy/konta/lista", {
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
                            json.dane.konta.forEach(konto => {
                                this.konta.push(konto);
                            });
                        }
                    });
            });
        },
        addItem() {
            this.$refs.formularz.konto = {};
            this.$refs.formularz.pacjenciNadrzedni = {};
            this.$refs.formularz.pacjenciPodrzedni = {};
            this.$refs.formularz.load();
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
            // pobieranie świeżych danych
            fetch("/sm-portal-server/uzytkownicy/konta/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.load();
                        this.$refs.formularz.konto = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        confirmDeleteItem(object) {
            this.$refs.dialogUsun
                .setMessage(
                    "Czy usunąć konto: <i>" + object.email + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/sm-portal-server/uzytkownicy/konta/" + object.id,
                null,
                this.refreshData
            );
        },
        saveItem(object) {
            fetch("/sm-portal-server/uzytkownicy/konta/", {
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
                        app.toast("Konto zostało zapisane");
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
        // closeWyborForm() {
        //     this.$refs.formWyborDialog.hide();
        // }
    },
    template: `
    <div class='view-uzytkownicy-konta'>

        <sm-filter ref='filter' class='filter' label='Filtr' placeholder="Grupa, login, lub e-mail" @on-submit="filter"></sm-filter>

        <table class='konta'>
            <tr class='border-bottom'>
                <th>Grupa</th>
                <th>Login</th>
                <th>E-mail</th>
                <th>Konto aktywne</th>
                <th>Akceptacja regulaminu</th>
                <th>Blokada konta</th>
                <th>Blokada konta do</th>
                <th class='button-td'>
                    <span>Dodaj nowe konto</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowe konto' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='konto in konta' :key="konto.id">
                <td :class="{'notactive': !konto.grupa.aktywna || !konto.kontoAktywne}" v-if='konto.grupa'><span>Grupa</span>{{konto.grupa.opis}}</td><td v-else></td>
                <td :class="{'notactive': !konto.kontoAktywne}"><span>Login</span>{{konto.login}}</td>
                <td :class="{'notactive': !konto.kontoAktywne}"><span>E-mail</span>{{konto.email}}</td>

                <td v-if='konto.kontoAktywne'>
                    <span>Konto aktywne</span><i class="icon-blue fas fa-check"></i>Tak
                </td>
                <td v-else>
                    <span>Konto aktywne</span><i class="icon-red fas fa-times"></i>Nie
                </td>

                <td v-if='konto.akceptacjaRegulaminu'>
                    <span>Akceptacja regulaminu</span><i class="icon-blue fas fa-check"></i>Tak
                </td>
                <td v-else>
                    <span>Akceptacja regulaminu</span><i class="icon-red fas fa-times"></i>Nie
                </td>

                <td v-if='konto.blokadaKonta'>
                    <span>Blokada konta</span><i class="icon-red fas fa-check"></i>Tak
                </td>
                <td v-else>
                    <span>Blokada konta</span><i class="icon-blue fas fa-times"></i>Nie
                </td>

                <td :class="{'notactive': !konto.kontoAktywne}"><span>Blokada konta do</span>{{konto.blokadaKontaDo}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń konto" :object="konto" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="konto" title='Edytuj konto' @on-click='editItem'></sm-button>
                </sm-button></td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{konta.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>

        <sm-form-dialog ref='formDialog' label="Konto">
            <form-uzytkownicy-konto ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-uzytkownicy-konto>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});