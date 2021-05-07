Vue.component("view-typy-grup", {
    data: function() {
        return {
            typyGrup: null
        }
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function () {
            this.$nextTick(function(){
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/slowniki/typy-grup")
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
                            this.typyGrup = json.dane.typyGrup;
                        }
                    });
            });
        },
        addItem: function() {
            this.$refs.formularz.clear().focus();
            this.$refs.formDialog.show();
        },
        editItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-grup/" + object.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.typGrupy = utils.copyJSON(
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
                    "Czy usunąć typ grupy: <i>" + object.nazwa + "</i> ?"
                )
                .setObject(object)
                .show();
        },
        deleteItem: function(object) {
            app.send(
                "DELETE",
                "/euslugi-zarzadzanie-server/slowniki/typy-grup/" + object.id,
                null,
                this.load
            );
        },
        saveItem: function(object) {
            fetch("/euslugi-zarzadzanie-server/slowniki/typy-grup", {
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
                        app.toast("Typ grupy zapisany");
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
    <div class='view-typy-grup'>
        <div class='view-header'>Typy grup użytkowników</div>        
        <table class='typy-grup'>
            <tr class='border-bottom'>
                <th>Nazwa</th>
                <th class='button-td'>
                    <span>Dodaj nowy typ grup</span>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-plus"></i>' title='Dodaj nowy typ grup' @on-click='addItem'></sm-button>
                </th>
            </tr>
            <tr v-for='typGrupy in typyGrup' :key="typGrupy.id">
                <td><span>Opis</span>{{typGrupy.nazwa}}</td>
                <td class='button-td'>
                    <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń typ grupy" :object="typGrupy" @on-click='confirmDeleteItem'></sm-button>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="typGrupy" title='Edytuj typ grupy' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Typ grupy">
            <form-typ-grupy ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-typ-grupy>
        </sm-form-dialog>

        <sm-modal-dialog ref='dialogUsun' focusedButton='cancel' okLabel="Usuń" okClass="red-button" @on-click-ok="deleteItem">
            <i class="fas fa-exclamation-triangle fa-3x icon warning-icon"></i>
        </sm-modal-dialog>
    </div>
    `
});