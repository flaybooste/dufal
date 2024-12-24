<template>
    <div class="folder-select">
      <button @click="selectFolder" class="folder-button">
        {{ buttonLabel }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      buttonLabel: {
        type: String,
        default: 'Selecionar Pasta', // Texto do botão
      },
    },
    emits: ['folder-selected', 'error'],
    methods: {
      async selectFolder() {
        try {
          const folderHandle = await window.showDirectoryPicker();
          const files = [];
  
          for await (const [_, handle] of folderHandle) {
            if (handle.kind === 'file' && handle.name.endsWith('.xml')) {
              const file = await handle.getFile();
              files.push(file);
            }
          }
  
          this.$emit('folder-selected', files); // Emite os arquivos selecionados
        } catch (error) {
          console.error('Erro ao selecionar a pasta:', error);
          this.$emit('error', error); // Emite erros, se houver
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .folder-button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .folder-button:hover {
    background-color: #0056b3;
  }
  </style>
  