Vue.component("view-typy-dokumentow", {
    data() {
        return {
            typyDokumentow: null
        };
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/slowniki/typy-dokumentow")
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
                            this.typyDokumentow = json.dane.typyDokumentow;
                        }
                    });
            });
        },
        addItem() {
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
           //pobieranie świeżych danych
           fetch("/euslugi-zarzadzanie-server/slowniki/typy-dokumentow/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.typDokumentu = utils.copyJSON(
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
                    "Czy usunąć typ dokumentu: <i>" + object.nazwaDokumentuTozsamosci + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/slowniki/typy-dokumentow/" + object.id,
                null,
                this.load
            );
        },
        saveItem(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-dokumentow", {
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
                        app.toast("Typ dokumentu zapisany");
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
    <div class='view-typy-dokumentow'>
        <div class='view-header'>Typy dokumentów</div>
        <table class='typy-dokumentow'>
            <tr class='border-bottom'>
                <th>Nazwa</th>
                <th>Format numeracji (regex)</th>
                <th>Format numeracji (opis)</th>
                <th class='button-td'>
                    <span>Dodaj nowy typ dokumentu</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy typ dokumentu' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='typDokumentu in typyDokumentow' :key="typDokumentu.id">
                <td><span>Nazwa</span>{{typDokumentu.nazwaDokumentuTozsamosci}}</td>
                <td class='monospace'><span>Format numeracji (regex)</span>{{typDokumentu.formatNumeracjiRegex}}</td>
                <td><span>Format numeracji (opis)</span>{{typDokumentu.formatNumeracjiOpis}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń typ dokumentu" :object="typDokumentu" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="typDokumentu" title='Edytuj typ dokumentu' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Typ dokumentu">
            <form-typ-dokumentu ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-typ-dokumentu>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});
