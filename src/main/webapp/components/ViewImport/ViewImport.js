Vue.component("view-import", {
    data: function() {
        return {
            plik: null,
            tabela_przyklad: null,
            tabela_import: null,
        };
    },
    created: function() {
    },
    methods: {
        onFileChange: function (plik) {
            this.plik = plik;
        },
        readFile: function() {
            const file = this.plik;
            const reader = new FileReader();

            if(this.tabela_import != null){
                var jsonObj = {"tabela": this.tabela_import};
                jsonObj.linie = {};

                reader.onload = (event) => {
                    const file = event.target.result;
                    const allLines = file.split(/\r\n|\n/);

                    jsonObj.linie = allLines;

                    this.send_import(jsonObj);
                };

                reader.onerror = (event) => {
                    alert(event.target.error.name);
                };

                reader.readAsText(file);
        } else {
            //Komunikat o wybraniu tabeli
            }

        },
        saveFile: function(){
            if(this.tabela_przyklad != null){
                var jsonObj = {"tabela": this.tabela_przyklad};
                fetch(
                    "/sm-portal-server/import/przyklad", {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json; charset=UTF-8"
                        },
                        body: JSON.stringify(jsonObj)
                    })
                    .then(res => app.handleErrors(res))
                    .then(res => res.json())
                    .then(json => {
                        if (json.blad === true) {
                            app.getMessageDialog()
                                .setMessage(json.komunikat)
                                .show();
                        } else {
                            var myCsv = json.dane.kolumny + "\n" + json.dane.dane + "\n" + json.dane.obowiazkowe;
                            var file = new Blob([myCsv], {type: "data:text/csv;charset=utf-8"});
                            var a = document.createElement("a");
                            a.style.display = "block";
                            a.href = URL.createObjectURL(file);
                            a.download =  this.tabela_przyklad + ".csv";
                            a.click();
                        }
                    });
            } else {
                //Komunikat o wybraniu tabeli
            }
        },
        send_import: function(object){
            fetch(
                "/sm-portal-server/import/", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify(object)
                })
                .then(res => app.handleErrors(res))
                .then(res => res.json())
                .then(json => {
                    if (json.blad === true) {
                        app.getMessageDialog()
                            .setMessage(json.komunikat)
                            .show();
                    } else {

                    }
                });
        },
    },
    template: `
    <div class='view-import'>
        <table class='opis'>
            <tr class='border-bottom'>
                <th>
                Import danych z plików .csv
                </th>
            </tr>
            <tr>
                <td>
                    Plik importu powinien być przygotowany w forie pliku .csv.
                </td>
            </tr>
            <tr>    
                <td>
                    Znak rozdzielający kolumny to ";".
                </td>
            </tr>
            <tr> 
                <td>
                    Nie jest używany żadei inny znak do oznaczenia ciągów alfanumerycznych.
                </td>
            </tr>
            <tr>
                <td>
                    Kodowanie pliku to UTF-8.
                </td>
            </tr>
            <tr>
                <td>
                    W pierwszym wierszu pliku .csv znajdują się nagłówki kolumn.
                </td>
            </tr>
            <tr>
                <td>
                    Format kolumn takichajak pesel, telefon czy email powinien być taki sam jak w plikach przykładowych.
                </td>
            </tr>
        </table>
        <table class='import'>    
            <tr class='border-bottom'>
                <th>
                    Przykładowy plik importu.
                </th>
                <th>
                </th>
                <th>
                </th>
            </tr>
            <tr>
            <td class='first'>
                Tabela importu:
            </td>
            <td class='button-td'>
                <label>
                </label>
            </td>
                <td>
                    <select class='select' v-model="tabela_przyklad">
                        <option disabled value="">Wybierz tabele</option>
                        <option value="pacjenci">pacjenci</option>
                        <option value="pracownicy">pracownicy</option>
                        <option value="kontrahenci">kontrahenci</option>
                    </select>
                </td>
                <td class='button-td'>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-download"></i>' title='Pobierz plik' @on-click='saveFile'></sm-button>
                </td>
            </tr>
            <tr>
                <th>
                    Import danych
                </th>
            </tr>
            <tr>
                <th>
                    Nazwa pliku:
                </th>

                <th>
                </th>

                <th>
                    Tabela do importu:
                </th>

                <th>
                </th>
            </tr>
            <tr>
                <td class='first'>
                    <label v-if="!plik">brak pliku</label>
                    <label v-else>{{plik.name}}</label>
                </td>
                <td class='button-td'>
                    <sm-file-input v-on:on-file-change="onFileChange" file_type=".csv"></sm-file-input>
                </td>
                <td>
                    <select class='select' v-model="tabela_import">
                        <option disabled value="">Wybierz tabele</option>
                        <option value="pacjenci">pacjenci</option>
                        <option value="pracownicy">pracownicy</option>
                        <option value="kontrahenci">kontrahenci</option>
                    </select>
                </td>
                <td class='button-td'>
                    <sm-button class='green-button button-fill' label='<i class="fas fa-upload"></i>' title='Przetwarzaj plik' @on-click='readFile' file=plik></sm-button>
                </td>
            </tr>
        </table>
    </div>
    `
});
