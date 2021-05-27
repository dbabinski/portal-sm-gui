Vue.component("view-aktualnosci-lista", {
    data() {
        return {
            aktualnosci: []
        }
    },
    mounted() {
        this.load();
    },
    methods: {
        load() {
            fetch("/sm-portal-server/portal/aktualnosci/wszystkie")
                .then(res => {
                    return app.handleErrors(res);
                })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        console.log(json.komunikat);
                    } else {
                        this.aktualnosci = json.dane.aktualnosci;
                    }
                });
        },
        addItem() {
            this.$refs.formularz.clear().setValid().focus();
            this.$refs.formDialog.show();
        },
        editItem(object) {
            fetch("/sm-portal-server/portal/aktualnosci/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        if (json.dane.publikacja == true){
                            json.dane.publikacjaText = "Tak";
                        } else {
                            json.dane.publikacjaText = "Nie";
                        }

                        this.$refs.formularz.load();
                        this.$refs.formularz.artykul = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        saveItem(object) {
            let self = this;
            fetch("/sm-portal-server/portal/aktualnosci", {
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
                        app.toast(json.komunikat);
                        self.$refs.formularz.clear();
                        self.$refs.formDialog.hide();
                    }
                    self.load();
                });
        },
        confirmDeleteItem(object) {
            this.$refs.dialogUsun
                .setMessage(
                    "Czy usunąć artykuł: <i>" + object.tytul + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem(object) {
            app.send(
                "DELETE",
                "/sm-portal-server/portal/aktualnosci/" + object.id,
                null,
                this.load
            );
        },
        closeForm() {
            this.$refs.formDialog.hide();
        }
    },
    template: `
    <div class='view-aktualnosci-lista'>
        <div class='view-header'>Aktualności</div>
        <table class='aktualnosci'>
            <tr class='border-bottom'>
                <th class='lp'>Lp.</th>
                <th>Tytuł</th>
                <th>Data</th>
                <th>Autor</th>
                <th>Publikacja</th>
                <th class='button-td'>
                    <span>Dodaj nowy artykuł</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy artykuł' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='(atykul, index) in aktualnosci' :key="atykul.id">
                <td class='lp'><span>Lp.</span>{{index + 1}}</td>
                <td><span>Tytuł</span>{{atykul.tytul}}</td>
                <td><span>Data</span>{{atykul.dataPublikacji}}</td>
                <td><span>Autor</span>{{atykul.autor}}</td>

                <td v-if='atykul.publikacja'>
                    <span>Publikacja</span><i class="icon-blue fas fa-check"></i>Tak
                </td>
                <td v-else>
                    <span>Publikacja</span><i class="icon-red fas fa-times"></i>Nie
                </td>

                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń artykuł" :object="atykul" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="atykul" title='Edytuj artykuł' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Artykuł">
            <form-aktualnosci ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-aktualnosci>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});