Vue.component("view-uzytkownicy-uprawnienia", {
    data: function() {
        return {
            uprawnienia: null
        };
    },
    created: function() {
        this.load();
    },
    methods: {
        load: function() {
            this.$nextTick(function() {
                app.showLoadingToast();
                fetch("/euslugi-zarzadzanie-server/uzytkownicy/uprawnienia")
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
                            this.uprawnienia = json.dane.uprawnienia;
                        }
                    });
            });
        },
        editItem: function(rekordUprawnien) {
            // pobieranie świeżych danych
            fetch("/euslugi-zarzadzanie-server/uzytkownicy/uprawnienia/" + rekordUprawnien.id)
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        this.$refs.formularz.rekordUprawnienia = utils.copyJSON(
                            json.dane
                        );
                        this.$refs.formularz.focus();
                        this.$refs.formDialog.show();
                    }
                });
        },
        saveItem: function(rekordUprawnien) {
            fetch("/euslugi-zarzadzanie-server/uzytkownicy/uprawnienia", {
                method: "POST",
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify(rekordUprawnien)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {
                        app.toast("Uprawnienia zostały zapisane");
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
    <div class='view-uzytkownicy-uprawnienia'>
        <div class='view-header'>Uprawnienia grup użytkowników</div>
        <table class='uprawnienia'>
            <tr class='border-bottom'>
                <th>Nazwa grupy</th>
                <th>Dodawanie pacjentów powiązanych</th>
                <th>Dostęp do listy pacjentów</th>
                <th>Planowanie wizyt</th>
                <th>Dostęp do kartoteki pacjenta powiązanego</th>
                <th>Blokowanie konta</th>
                <th>Edytuj</th>
            </tr>
            <tr v-for='rekordUprawnien in uprawnienia' :key="rekordUprawnien.id">            
                <td v-if='rekordUprawnien.grupa'><span>Nazwa grupy</span>{{rekordUprawnien.grupa.opis}}</td>
                <td v-else><span>Nazwa grupy</span>Nie</td>
                
                <td v-if='rekordUprawnien.dodawaniePacjentowPowiazanych'><span>Dodawanie pacjentów powiązanych</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Dodawanie pacjentów powiązanych</span><i class="icon-red fas fa-times"></i>Nie</td>
                
                <td v-if='rekordUprawnien.dostepDoListyPacjentow'><span>Dostęp do listy pacjentów</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Dostęp do listy pacjentów</span><i class="icon-red fas fa-times"></i>Nie</td>
                
                <td v-if='rekordUprawnien.planowanieWizyt'><span>Planowanie wizyt</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Planowanie wizyt</span><i class="icon-red fas fa-times"></i>Nie</td>
                
                <td v-if='rekordUprawnien.dostepDoKartotekiPacjentaPowiazanego'><span>Dostęp do kartoteki pacjenta powiązanego</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Dostęp do kartoteki pacjenta powiązanego</span><i class="icon-red fas fa-times"></i>Nie</td>
                
                <td v-if='rekordUprawnien.blokowanieKonta'><span>Blokowanie konta</span><i class="icon-blue fas fa-check"></i>Tak</td>
                <td v-else><span>Blokowanie konta</span><i class="icon-red fas fa-times"></i>Nie</td>
                
                <td class='button-td'>
                    <sm-button label='<i class="fas fa-pen"></i>' :object="rekordUprawnien" title='Edytuj uprawnienia' @on-click='editItem'></sm-button>
                </td>
            </tr>
        </table>

        <sm-form-dialog ref='formDialog' label="Uprawnienia">
            <form-uzytkownicy-uprawnienia ref='formularz' @on-submit="saveItem" @on-cancel='closeForm'></form-uzytkownicy-uprawnienia>
        </sm-form-dialog>
    </div>
    `
});