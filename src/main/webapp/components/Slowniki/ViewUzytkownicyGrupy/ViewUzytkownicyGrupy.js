Vue.component("view-uzytkownicy-grupy", {
    data: function() {
        return {
            grupy: null
        };
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/sm-portal-server/uzytkownicy/grupy")
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
                            this.grupy = json.dane.grupy;
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
            fetch("/sm-portal-server/uzytkownicy/grupy/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.load();
                        this.$refs.formularz.grupa = utils.copyJSON(
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
                    "Czy usunąć grupę: <i>" + object.opis + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem: function(object) {
            app.send(
                "DELETE",
                "/sm-portal-server/uzytkownicy/grupy/" + object.id,
                null,
                this.load
            );
        },
        saveItem: function(object) {
            fetch("/sm-portal-server/uzytkownicy/grupy", {
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
                        app.toast("Grupa została zapisana");
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
    <div class='view-uzytkownicy-grupy'>
        <div class='view-header'>Grupy użytkowników</div>
        <table class='grupy'>
            <tr class='border-bottom'>
                <th>Nazwa typu grupy</th>
                <th>Opis</th>
                <th>Aktywna</th>
                <th class='button-td'>
                    <span>Dodaj nową grupę</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nową grupę' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='grupa in grupy' :key="grupa.id">
                <td :class="{'notactive': !grupa.aktywna}" v-if='grupa.slownikTypyGrup'><span>Nazwa typu grupy</span>{{grupa.slownikTypyGrup.nazwa}}</td>
                <td v-else><span>Nazwa typu grupy</span></td>

                <td :class="{'notactive': !grupa.aktywna}"><span>Opis</span>{{grupa.opis}}</td>

                <td v-if='grupa.aktywna'><span>Aktywna</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Aktywna</span><i class="icon-red fas fa-times"></i>Nie</td>

                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń grupę" :object="grupa" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="grupa" title='Edytuj grupę' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Grupa">
            <form-uzytkownicy-grupa ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-uzytkownicy-grupa>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});