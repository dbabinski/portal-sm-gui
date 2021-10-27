Vue.component("sm-toast", {  
    data: function() {
        return {
            message: "Etykieta",            
            snackbar: false,
        }
    },
    methods: {
        show: function(message) {                
            this.message = message;  
            this.snackbar = true;
        }
    },
    template: `
        <v-snackbar
        v-model="snackbar"
        color="blue"
        bottom
        :timeout="2000"
        class="sm-toast"
        >{{message}}</v-snackbar>
    `
})