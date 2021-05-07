Vue.component("view-typy-komunikatow", {
    data() {
        return {
            typyKomunikatow: null
        }
    },
    created() {
        this.load();
    },
    methods: {
        load() {
            this.$nextTick(function(){
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/slowniki/typy-komunikatow")
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
                            this.typyKomunikatow = json.dane.typyKomunikatow;
                        }
                    });
            });
        },
        addItem() {
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-komunikatow/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.typKomunikatu = utils.copyJSON(
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
                    "Czy usunąć typ komunikatu: <i>" + object.opis + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/slowniki/typy-komunikatow/" + object.id,
                null,
                this.load
            );
        },
        saveItem(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-komunikatow", {
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
                        app.toast("Typ komunikatu zapisany");
                        this.$refs.formularz.clear();
                        this.$refs.formDialog.hide();
                    }
                    this.load();
                });
        },
        closeForm() {
            this.$refs.formDialog.hide();
        }
    },
    template: `
    <div class='view-typy-komunikatow'>
        <div class='view-header'>Typy komunikatów</div>
        <table class='typy-komunikatow'>
            <tr class='border-bottom'>
                <th>Opis</th>
                <th class='button-td'>
                    <span>Dodaj nowy typ komunikatu</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy typ komunikatu' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='typKomunikatu in typyKomunikatow' :key="typKomunikatu.id">
                <td><span>Opis</span>{{typKomunikatu.opis}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń typ komunikatu" :object="typKomunikatu" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="typKomunikatu" title='Edytuj typ komunikatu' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Typ Komunikatu">
            <form-typ-komunikatu ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-typ-komunikatu>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});