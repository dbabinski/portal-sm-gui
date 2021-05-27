Vue.component("sm-file-input", {
    data: function(){
        return {
            file: null
        };
    },
    props: {
        title_text:{
            default: "Wybierz plik"
        },
        label_text: {
            default: ""
        },
        file_type: {
            default: null
        }
    },
    methods: {
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
              return;
            this.file = files[0];
            this.$emit('on-file-change', this.file);
        },
        removeFile(){
            this.file = null;
            this.$emit('on-file-change', this.file);
        },
        focus: function() {
            this.$refs.button.focus();
        }
    },
    template: `
        <div v-if="!file">
            <input type="file" name="file" id="file" class="sm-file-input" @change="onFileChange" v-bind:accept="file_type"/>
            <label for="file" v-bind:title="title_text"><i class="fas fa-folder-open"></i><span>{{label_text}}</span></label>
        </div>
        <div v-else>
            <sm-button class='red-button' label='<i class="fas fa-trash-alt"></i>' title="Usuń plik" @on-click='removeFile'></sm-button>
        </div>
    `
})