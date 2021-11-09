Vue.component("view-admin", {
    data() {
        return {
            defaultUrl: "/admin/uzytkownicy",
            items: [
                { title: 'Panel', icon: 'mdi-view-dashboard', url: '/admin/panel' },
                { title: 'Konta', icon: 'mdi-account-box', url: '/admin/uzytkownicy' },
                { title: 'Ustawienia', icon: 'mdi-cog', url: '/admin/ustawienia' },
              ],
            selectMenu: false,
            rows: [],
            daneKonta: {},
            adres: store.getters.email,
        }
    },

    created() {
      if(this.$route.path != this.defaultUrl){
        this.selectMenu = true;
      }
    },

    mounted() {
    },
    computed: {
        label() {
            
        }
    },
    methods: {
        logout() {
            app.logout();
        },

    },
    template: `    
    <div class='view-admin'>

                <div>
                    <v-card>
                        <v-navigation-drawer
                          permanent
                        >
                            <v-divider></v-divider>

                            <v-list>
                                <v-list-item
                                  v-for="item in items"
                                  :key="item.title"
                                  :to="item.url"
                                  
                                >
                                    <v-list-item-icon>
                                      <v-icon>{{ item.icon }}</v-icon>
                                    </v-list-item-icon>

                                    <v-list-item-content>
                                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                                    </v-list-item-content>

                                </v-list-item>
                            </v-list>

                            <template v-slot:append>
                                <div class="pa-4">
                                  <v-btn block color="blue darken-2" @click="logout">
                                    Wyloguj
                                  </v-btn>
                                </div>
                            </template>

                        </v-navigation-drawer>
                        <router-view></router-view>
                    </v-card>

                    <div>
                      
                    </div>


                </div>

                
    </div>
    `
});