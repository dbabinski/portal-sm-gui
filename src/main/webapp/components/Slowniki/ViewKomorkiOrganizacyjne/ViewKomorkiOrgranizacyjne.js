Vue.component("view-komorki-organizacyjne", {
    data: function() {
        return {
            komorkiOrganizacyjne: null
        };
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/sm-portal-server/slowniki/komorki-organizacyjne")
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
                            this.komorkiOrganizacyjne = json.dane.komorkiOrganizacyjne;
                        }
                    });
            });
        },
        addItem: function() {
            this.$refs.formularz.load();
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem: function(object) {
            // pobieranie świeżych danych
            fetch("/sm-portal-server/slowniki/komorki-organizacyjne/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.load();
                        this.$refs.formularz.komorkaOrganizacyjna = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        confirmDeleteItem: function(object) {
            this.$refs.dialogUsun
                .setMessage(
                    "Czy usunąć komorkę organizacyjną: <i>" + object.nazwa + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem: function(object) {
            app.send(
                "DELETE",
                "/sm-portal-server/slowniki/komorki-organizacyjne/" + object.id,
                null,
                this.load
            );
        },
        saveItem: function(object) {
            fetch("/sm-portal-server/slowniki/komorki-organizacyjne", {
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
                        app.toast("Komórka organizacyjna została zapisana");
                        this.$refs.formularz.clear();
                        this.$refs.formDialog.hide();
                    }
                    this.load();
                });
        },
        closeForm: function() {
            this.$refs.formDialog.hide();
        }
    },
    template: `
    <div class='view-komorki-organizacyjne'>
        <div class='view-header'>Komórki organizacyjne</div>
        <table class='komorki-organizacyjne'>
            <tr class='border-bottom'>
                <th>Nazwa</th>
                <th>Opis</th>
                <th>Komórka nadrzędna</th>
                <th class='button-td'>
                    <span>Dodaj nową komórkę organizacyjną</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nową komórkę organizacyjną' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='komorkaOrganizacyjna in komorkiOrganizacyjne' :key="komorkaOrganizacyjna.id">
                <td><span>Nazwa</span>{{komorkaOrganizacyjna.nazwa}}</td>
                <td><span>Opis</span>{{komorkaOrganizacyjna.opis}}</td>
                <td v-if='komorkaOrganizacyjna.nadrzednaKomorkaOrganizacyjna'><span>Komórka nadrzędna</span>{{komorkaOrganizacyjna.nadrzednaKomorkaOrganizacyjna.nazwa}}</td>
                <td v-else><span>Komórka nadrzędna</span></td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń komórkę organizacyjną" :object="komorkaOrganizacyjna" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="komorkaOrganizacyjna" title='Edytuj komórkę organizacyjną' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Komórka organizacyjna">
            <form-komorka-organizacyjna ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-komorka-organizacyjna>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});
