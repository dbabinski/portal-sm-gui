Vue.component("sm-loading-toast", {
    props: {
        label: {
            default: "Pobieranie danych"
        },
    },
    data: function() {
        return {
            loading: false,
            customLabel: null
        }
    },
    methods: {      
        show: function(customLabel) {
            if(!utils.isNull(customLabel)) {
                this.customLabel = customLabel;
            } else {
                this.customLabel = this.label;
            }
            this.loading = true;
        },
        hide: function() {
            this.loading = false;
        }
    },
    template: `
        <div class="sm-loading-toast">
            <transition name="fade">
                <div class="loading" v-show="loading" >
                    <span class="fa fa-spinner fa-spin"></span> {{customLabel}}
                </div>
            </transition>
        </div>
    `
})