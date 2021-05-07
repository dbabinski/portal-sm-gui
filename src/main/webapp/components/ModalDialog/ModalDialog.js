Vue.component("sm-modal-dialog", {
    props: {
        okLabel: {
            default: "OK"
        },
        okClass: {
            default: ""
        },
        cancelLabel: {
            default: "Anuluj"
        },
        showCancel: {
            type: Boolean,
            default: true
        },
        focusedButton: {
            default: null
        }
    },
    data: function() {
        return {
            display: "none",
            message: "Etykieta",
            object: null,
            focusedButtonVar: null,
            label: null
        }
    },
    mounted: function () {
        this.focusedButtonVar = this.focusedButton;
    },
    updated: function () {
        this.$nextTick(function () {
            // Code that will run only after the
            // entire view has been re-rendered
            if(this.focusedButtonVar == 'ok') {
                this.$refs.okButton.focus();
            } else if(this.focusedButtonVar == 'cancel') {
                this.$refs.cancelButton.focus();
            }
        })
    },
    methods: {
        setMessage: function(message) {
            this.message = message;
            return this;
        },
        setLabel: function(label) {
            this.label = label;
            return this;
        },
        setObject: function(object) {
            this.object = object;
            return this;
        },
        setFocusedButton: function(focusedButton) {
            this.focusedButtonVar = focusedButton;
            return this;
        },
        show: function() {
            this.display = "block";
            return this;
        },
        onClickOk: function() {
            this.$emit('on-click-ok', this.object);
            this.display = "none";
            // this.setFocusedButton(null);
        },
        onClickCancel: function() {
            this.display = "none";
            // this.setFocusedButton(null);
        }
    },
    template: `
    <div class= 'sm-modal-dialog' :style="{ 'display': display }">
        <div class='modal-dialog-container'>
            <div class='modal-dialog-content'>
                <div class='modal-dialog-main'>
                    <slot></slot>
                    <div class='header' v-show="label">{{label}}</div>
                    <div class='message' v-html="message"></div>
                </div>
                <div class='buttons-panel-center'>
                    <sm-button ref='okButton' :class="okClass" class='button' :label="okLabel" @on-click="onClickOk"></sm-button>
                    <sm-button ref='cancelButton' class='button margin-left' v-show='showCancel' :label="cancelLabel" @on-click="onClickCancel"></sm-button>
                </div>
            </div>
        </div>
    </div>
    `
})

