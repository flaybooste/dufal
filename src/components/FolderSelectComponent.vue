<template>
  <div class="file-import">
    <input
      type="file"
      id="fileInput"
      ref="fileInput"
      @change="handleFileSelection"
      :multiple="allowMultiple"
      :accept="acceptedFormats"
      style="display: none"
    />
    <button @click="openFileDialog" class="import-button">
      {{ buttonLabel }}
    </button>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { useNotasStore } from "@/stores/useNotasStore";

export default {
  props: {
    buttonLabel: {
      type: String,
      default: "Importar Arquivo", // Texto do botão
    },
    allowMultiple: {
      type: Boolean,
      default: false, // Permitir seleção de múltiplos arquivos
    },
    acceptedFormats: {
      type: String,
      default: "", // Formatos aceitos, e.g., ".xml, .json"
    },
  },
  setup() {
    const notasStore = useNotasStore();

    const processarXML = (file) => {
      notasStore.processarXML(file);
    };
  },
  data() {
    return {
      errorMessage: "", // Mensagem de erro exibida ao usuário
    };
  },
  emits: ["files-selected", "error"],
  methods: {
    openFileDialog() {
      // Abre o diálogo de seleção de arquivos
      this.$refs.fileInput.click();
    },

    handleFileSelection(event) {
      const notasStore = useNotasStore();

      const files = Array.from(event.target.files);

      var data = notasStore.processarXML(event.target.files);

      console.log(data);

      if (files.length === 0) {
        this.errorMessage = "Nenhum arquivo foi selecionado.";
        this.$emit("error", new Error("Nenhum arquivo foi selecionado."));
        return;
      }

      // Limpa mensagens de erro anteriores
      this.errorMessage = "";

      // Emite os arquivos selecionados para o componente pai
      this.$emit("files-selected", files);
    },
  },
};
</script>

<style scoped>
.import-button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.import-button:hover {
  background-color: #218838;
}

.error-message {
  margin-top: 10px;
  color: red;
  font-size: 14px;
}
</style>
