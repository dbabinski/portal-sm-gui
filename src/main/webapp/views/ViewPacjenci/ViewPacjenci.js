Vue.component("view-pacjenci", {
    data() {
        return {
            pacjenci: [],
            limit: 20,
            liczbaDostepnychRekordow: 0
        };
    },
    computed: {
        zaladowanoWszystko() {
            return this.pacjenci.length == this.liczbaDostepnychRekordow;
        }
    },
    mounted() {
        this.scroll();
        this.loadData();
        this.$refs.filter.focus();
    },
    methods: {
        loadData() {
            this.pacjenci = [];
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
                    offset: this.pacjenci.length,
                    refresh: refresh != undefined ? refresh : false
                };
                if(refresh === true) {
                    this.pacjenci = [];
                }
                fetch("/sm-portal-server/pacjenci/lista", {
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
                            json.dane.pacjenci.forEach(pacjent => {
                                this.pacjenci.push(pacjent);
                            });
                        }
                    });
            });
        },
        addItem() {
            this.$refs.formularz.clear().load().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
            // pobieranie świeżych danych
            fetch("/sm-portal-server/pacjenci/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.load();
                        this.$refs.formularz.pacjent = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        confirmDeleteItem(object) {
            this.$refs.dialogUsun
                .setMessage("Czy usunąć dane pacjenta: <i>" + object.imie + " " + object.nazwisko + "</i> ?")
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/sm-portal-server/pacjenci/" + object.id,
                null,
                this.refreshData
            );
        },
        saveItem(object) {
            fetch("/sm-portal-server/pacjenci/", {
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
                        app.toast("Dane pacjenta zostały zapisane");
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
        },
        //DEV
        // addItemSelf() {
        //     this.$refs.formularzSamodzielnie.clear().load().focus();
        //     this.$refs.formDialogSamodzielnie.show();
        // },
        // saveItemSelf(object) {
        //     fetch("/sm-portal-server/pacjenci/", {
        //         method: "POST",
        //         headers: {
        //             "Content-type": "application/json; charset=UTF-8"
        //         },
        //         body: JSON.stringify(object)
        //     })
        //         .then(res => res.json())
        //         .then(json => {
        //             if (json.blad === true) {
        //                 app.getMessageDialog()
        //                     .setMessage(json.komunikat)
        //                     .show();
        //             } else {
        //                 app.toast("Dane pacjenta zostały zapisane");
        //                 this.$refs.formularzSamodzielnie.clear();
        //                 this.$refs.formDialogSamodzielnie.hide();
        //             }
        //             this.refreshData();
        //         });
        // },
        // closeFormSelf() {
        //     this.$refs.formDialogSamodzielnie.hide();
        // }
    },
    template: `
    <div class='view-pacjenci'>
        <!--
        <div style='width: 50px; padding-bottom: 1em'>
            <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj noweg konto (DEV)' @on-click='addItemSelf'></sm-button>
        </div>
        -->
        <sm-filter ref='filter' class='filter' label='Filtr' placeholder="Imię, nazwisko, PESEL lub e-mail" @on-submit="filter"></sm-filter>

        <table class='pacjenci'>
            <tr class='border-bottom'>
                <th class='lp'>Lp.</th>
                <th>Nazwisko</th>
                <th>Imię</th>
                <th>PESEL</th>
                <th>Adres</th>
                <th>E-mail</th>
                <th>Telefon</th>
                <th class='button-td'>
                    <span>Dodaj nowego pacjenta</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowego pacjenta' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='(pacjent, index) in pacjenci' :key="pacjenci.id" :id="'pacjent-' + pacjent.id">
                <td class='lp'><span>Lp.</span>{{index + 1}}</td>
                <td><span>Nazwisko</span>{{pacjent.nazwisko}}</td>
                <td><span>Imię</span>{{pacjent.imie}}</td>
                <td class='monospace'><span>PESEL</span>{{pacjent.pesel}}</td>
                <td><span>Adres</span>{{pacjent.adres}}</td>
                <td><span>E-mail</span>{{pacjent.email}}</td>
                <td><span>Telefon</span>{{pacjent.telefonKontaktowy}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń dane pacjenta" :object="pacjent" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="pacjent" title='Edytuj dane pacjenta' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <div class='footer'>
            <div class='load-button-container'>
                <sm-button v-show='!zaladowanoWszystko' label='<i class="fas fa-angle-double-down"></i>' @on-click='appendData' title='Wczytaj pozostałe dane'></sm-button>
            </div>
            <div class='record-counter'>{{pacjenci.length}} z {{liczbaDostepnychRekordow}}</div>
        </div>

        <sm-form-dialog ref='formDialog' label="Pacjent">
            <form-pacjent ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-pacjent>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});
