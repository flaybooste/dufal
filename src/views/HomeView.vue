<template>
  <div>
    <FileService @arquivo-processado="carregarNotas" />
    <Filters @filtrar="atualizarFiltros" />
    <InvoiceList :dados="dadosFiltrados" />
    <ExportButton :dadosFiltrados="dadosFiltrados" />
  </div>
</template>

<script>
import Filters from "@/components/Filters.vue";
import InvoiceList from "@/components/InvoiceList.vue";
import ExportButton from "@/components/ExportBtn.vue";
import FileService from "@/services/FileService.vue";

export default {
  components: {
    Filters,
    InvoiceList,
    ExportButton,
  },
  data() {
    return {
      dadosFiltrados: [],
    };
  },
  methods: {
    atualizarFiltros(dados) {
      this.dadosFiltrados = dados;
    },
  },
};
</script>
