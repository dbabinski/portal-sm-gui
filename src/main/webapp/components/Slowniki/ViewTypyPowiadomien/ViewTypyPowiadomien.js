Vue.component("view-typy-powiadomien", {
    data: function() {
        return {
            typyPowiadomien: null
        }
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function () {
            this.$nextTick(function(){
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/slowniki/typy-powiadomien")
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
                            this.typyPowiadomien = json.dane.typyPowiadomien;
                        }
                    });
            });
        },
        addItem: function() {
            this.$refs.formularz.focus();
            this.$refs.formDialog.show();
        },
        editItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-powiadomien/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.typPowiadomienia = utils.copyJSON(
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
                    "Czy usunąć typ komunikatu: <i>" + object.opis + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem: function(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/slowniki/typy-powiadomien/" + object.id,
                null,
                this.load
            );
        },
        saveItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-powiadomien", {
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
                        app.toast("Typ powiadomienia zapisany");
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
    <div class='view-typy-powiadomien'>
        <div class='view-header'>Typy powiadomień</div>
        <table class='typy-powiadomien'>
            <tr class='border-bottom'>
                <th>Opis</th>
                <th>E-mail</th>
                <th>SMS</th>
                <th class='button-td'>
                    <span>Dodaj nowy typ powiadomienia</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy typ powiadomienia' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='typPowiadomienia in typyPowiadomien' :key="typPowiadomienia.id">
                <td><span>Opis</span>{{typPowiadomienia.opis}}</td>

                <td v-if='typPowiadomienia.email'><span>E-mail</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>E-mail</span><i class="icon-red fas fa-times"></i>Nie</td>

                <td v-if='typPowiadomienia.sms'><span>SMS</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>SMS</span><i class="icon-red fas fa-times"></i>Nie</td>

                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń typ powiadomienia" :object="typPowiadomienia" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="typPowiadomienia" title='Edytuj typ powiadomienia' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Typ Powiadomienia">
            <form-typ-powiadomienia ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-typ-powiadomienia>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});