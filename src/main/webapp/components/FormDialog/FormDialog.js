Vue.component("sm-form-dialog", {         
    data: function() {
        return {
            display: "none",
            visibility: "hidden",
            label: null,
            maxwidth: null
        }
    },
    mounted: function() {
        this.maxwidth = this.$el.getAttribute('maxwidth');
        this.label = this.$el.getAttribute('label');
    },
    methods: {
        show: function() {
            this.display = "block";
            //zapobiega przweijaniu zawartości strony gdy okno modalne jest wyświetlane
            document.body.classList.add('modal-open');
        },
        hide: function() {
            this.display = "none";            
            document.body.classList.remove('modal-open');
        },
    },
    template: `
    <div class='sm-form-dialog' v-bind:style="{ 'display': display}">
        <div class='form-dialog-container'>
            <div class='form-dialog-content' v-bind:style="{ 'max-width': maxwidth }">        
                <div class='form-dialog-header' v-show="label">{{label}}</div>
                <div class='form-dialog-main'>
                    <slot></slot>                
                </div>                         
            </div>
        </div>
    </div>
    `
})