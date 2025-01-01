<template>
  <div>
    <h1>Tabela com Filtros</h1>
    <TabelaComFiltros
      :colunas="colunas"
      :dados="dados"
      @filtro-aplicado="filtrosAplicados"
    />
  </div>
</template>

<script>
import TabelaComFiltros from "@/components/FiltroDadosComponent.vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";

export default {
  components: { TabelaComFiltros },
  setup() {
    const planilhaStore = usePlanilhaStore();

    return {
      colunas: planilhaStore.colunas,
      dados: planilhaStore.dados,
      filtrosAplicados: (dadosFiltrados) => {
        console.log("Dados filtrados:", dadosFiltrados);
      },
    };
  },
};
</script>
