<template>
  <v-card elevation="2">
    <v-data-table :headers="headers" :items="artykuly" :search="search">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Artykuły</v-toolbar-title>
          <v-divider inset vertical class="mx-4"></v-divider>
          <v-spacer></v-spacer>
          <v-text-field
            append-icon="fas fa-search"
            label="Szukaj"
            single-line
            hide-details
            v-model="search"
          />
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="1400px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Dodaj artykuł
              </v-btn>
            </template>
            <v-card>
              <v-row
                ><v-col cols="9" md="9">
                  <v-card-title class="px-8 mb-4">
                    <span class="text-h6 font-weight-medium text-uppercas">{{
                      formTitle
                    }}</span>
                  </v-card-title>
                </v-col>
                <v-col class="mt-2 pl-12 mr-0 pr-0" cols="2" md="2">
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Anuluj
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="saveItem">
                      Zapisz</v-btn
                    >
                  </v-card-actions>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col class="mb-0 pb-0 mt-0" cols="6" sm="12" md="6">
                      <v-text-field
                        dense
                        outlined
                        v-model="editedItem.tytul"
                        label="Tytuł"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="my-0 py-0" cols="8" sm="6" md="8">
                      <p class="text-subtitle-1 text-left">Treść artykułu</p>
                    </v-col>

                    <v-col cols="11" sm="12" md="11">
                      <!-- <quill-editor-blog />
                       -->
                      <quill-editor
                        v-model="editedItem.tresc"
                        ref="myQuillEditor"
                        :options="editorOption"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="my-0 py-0" cols="3" sm="12" md="3">
                      <v-dialog
                        ref="dialogDate"
                        v-model="modalDate"
                        :return-value.sync="date"
                        persistent
                        width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="editedItem.dataPublikacji"
                            label="Data publikacji"
                            prepend-icon="far fa-calendar"
                            outlined
                            dense
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="editedItem.dataPublikacji"
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="modalDate = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialogDate.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                    <v-col class="my-0 py-0" cols="4" sm="12" md="4">
                      <v-text-field
                        dense
                        outlined
                        v-model="editedItem.autor"
                        label="Autor"
                      ></v-text-field>
                    </v-col>
                    <v-col class="my-0 py-0" cols="2" sm="6" md="2">
                      <v-switch
                        dense
                        outlined
                        v-model="editedItem.publikacja"
                        label="Publikuj"
                      ></v-switch>
                    </v-col>
                    <v-col class="my-0 py-0" cols="2" sm="6" md="2">
                      <v-switch
                        dense
                        outlined
                        label="Przypnij artykuł"
                      ></v-switch>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Napewno chcesz usunąć artykuł?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Anuluj</v-btn
                >
                <v-btn color="blue darken-1" text @click="confirmDelete"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.publikacja`]="{ item }">
        <v-icon small v-if="item.publikacja == true">fas fa-check-circle</v-icon>
        <v-icon small v-else>fas fa-times</v-icon>
      </template>
      <template v-slot:[`item.skrot`]="{ item }">
        <span :v-model="item">{{ item.skrot }}</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn text dense depressed @click="editItem(item)">Edytuj</v-btn>
        <v-btn text dense error color="error" @click="deleteItem(item)">Usuń</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.snow.css";

export default {
  components: {
    quillEditor,
    // QuillEditorBlog: () => import("@/components/QuillEditorBlog/index"),
  },
  name: "Articles",
  data() {
    return {
      content: "",
      editorOption: {
        debug: "error",
        placeholder: "Wpisz tekst..",
        readOnly: true,
        theme: "snow",
      },
      date: null,
      modalDate: false,
      dialog: null,
      dialogDelete: null,
      search: null,
      artykuly: [],
      headers: [
        { text: "Id", align: "start", value: "id", width: "60px" },
        { text: "Tytuł", value: "tytul" },
        { text: "Treść", value: "skrot" },
        { text: "Autor", value: "autor" },
        { text: "Opublikowano", value: "publikacja", align: "center" },
        { text: "Data", value: "dataPublikacji" },
        {
          text: "Zarządzaj",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      editedIndex: -1,
      editedItem: {
        tytul: null,
        dataPublikacji: null,
        // tresc: String,
        // skrot: String,
      },
      defaultItem: {},
    };
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Dodaj artykuł" : "Edytuj artykuł";
    },
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      (this.artykuly = []), this.appendData();
    },
    appendData() {
      this.$nextTick(() => {
        fetch("../sm-portal-server/portal/aktualnosci/wszystkie", {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.blad === true) {
              //TODO: handleErrors
            } else {
              json.dane.aktualnosci.forEach((aktualnosc) => {
                this.artykuly.push(aktualnosc);
              });
            }
          });
      });
    },
    saveItem() {
      fetch("../sm-portal-server/portal/aktualnosci/", {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(this.editedItem),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad) {
            //TODO: handleErrors
          } else {
            if (this.editedIndex > -1) {
              Object.assign(this.artykuly[this.editedIndex], this.editedItem);
            } else {
              this.artykuly.push(this.editedItem);
            }
            this.close();
          }
        });
    },

    confirmDelete() {
      fetch("../sm-portal-server/portal/aktualnosci/" + this.editedItem.id, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.blad) {
            //TODO: handleErrors
          } else {
            this.artykuly.splice(this.editedIndex, 1);
            this.closeDelete();
          }
        });
    },

    editItem(item) {
      this.editedIndex = this.artykuly.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.artykuly.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>

<style scoped>
.dash {
  color: #777777;
}
</style>