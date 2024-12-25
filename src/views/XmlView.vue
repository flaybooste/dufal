<template>
  <div>
    <FolderSelectComponent
      buttonLabel="Abrir Pasta com XML"
      @folder-selected="processarArquivos"
    />
    <Filters :emitentesDisponiveis="emitentes" />
    <InvoiceList :dados="dadosFiltrados" @remover-produto="removerProduto" />
  </div>
</template>

<script>
import { useNotasStore } from "@/stores/useNotasStore";
import { computed } from "vue";
import FolderSelectComponent from "@/components/FolderSelectComponent.vue";
import Filters from "@/components/Filters.vue";

import InvoiceList from "@/components/InvoiceList.vue";

export default {
  components: {
    FolderSelectComponent,
    InvoiceList,
    Filters,
  },
  setup() {
    const notasStore = useNotasStore();

    const processarArquivos = (files) => {
      notasStore.processarArquivos(files);
    };

    const removerProduto = (ncm) => {
      notasStore.removerProduto(ncm);
    };

    // Computed para atualizar automaticamente a lista de notas fiscais filtradas
    const dadosFiltrados = computed(() => notasStore.dadosFiltrados);
    const emitentes = computed(() => notasStore.emitentes);
    return {
      dadosFiltrados,
      emitentes,
      processarArquivos,
      removerProduto,
    };
  },
};
</script>
