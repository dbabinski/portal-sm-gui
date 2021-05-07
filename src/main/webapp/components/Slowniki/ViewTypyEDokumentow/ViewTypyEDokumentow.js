Vue.component("view-typy-edokumentow", {
    data: function() {
        return {
            typyEDokumentow: null
        }
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function () {
            this.$nextTick(function(){
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/slowniki/typy-edokumentow")
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
                            this.typyEDokumentow = json.dane.typyEDokumentow;
                        }
                    });
            });
        },
        addItem: function() {
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-edokumentow/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.typEDokumentu = utils.copyJSON(
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
                    "Czy usunąć typ e-dokumentu: <i>" + object.opis + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem: function(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/slowniki/typy-edokumentow/" + object.id,
                null,
                this.load
            );
        },
        saveItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-edokumentow", {
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
                        app.toast("Typ e-dokumentu zapisany");
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
    <div class='view-typy-edokumentow'>
        <div class='view-header'>Typy e-dokumentów</div>
        <table class='typy-edokumentow'>
            <tr class='border-bottom'>
                <th>Opis</th>
                <th class='button-td'>
                    <span>Dodaj nowy typ e-dokumentu</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy typ e-dokumentu' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='typEDokumentu in typyEDokumentow' :key="typEDokumentu.id">
                <td><span>Opis</span>{{typEDokumentu.opis}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń typ e-dokumentu" :object="typEDokumentu" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="typEDokumentu" title='Edytuj typ e-dokumentu' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Typ e-dokumentu">
            <form-typ-edokumentu ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-typ-edokumentu>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});