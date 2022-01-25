<template>
    <div class="quill-editor-blog">
        <quill-editor 
            v-model="content"
            ref="myQuillEditor"
            :options="editorOption"
        />
    </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'; 
import 'quill/dist/quill.snow.css';

export default ({
    name: 'QuilEditorBlog',
    components: {
        quillEditor
    },
    data(){
        return {
            content: '',
            editorOption: {
                debug: 'error',
                placeholder: 'Wpisz tekst..',
                readOnly: true,
                theme: 'snow'
            }
        }
    },

})
</script>
<style>
.ql-editor{
    height: 32vh;
}
</style>
