<template>
  <div>
    <h1>Tabela com Filtros</h1>
    <input type="file" @change="handleFileChange" accept=".xlsm, .xlsx, .xls" />
    <TabelaComFiltros
      v-if="dados.length"
      :colunas="colunas"
      :dados="dados"
      @filtro-aplicado="filtrosAplicados"
    />
    <div v-else>
      <p>Carregue uma planilha para visualizar os dados.</p>
    </div>
  </div>
</template>

<script>
import TabelaComFiltros from "@/components/FiltroDadosComponent.vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";
import { watch } from "vue";

export default {
  components: { TabelaComFiltros },

  setup() {
    const planilhaStore = usePlanilhaStore();

    // Reatividade para colunas e dados
    const colunas = planilhaStore.colunas;
    const dados = planilhaStore.dados;

    // Função para lidar com a seleção do arquivo
    const handleFileChange = async (event) => {
      const arquivoSelecionado = event.target.files[0];
      if (!arquivoSelecionado) {
        console.warn("Nenhum arquivo selecionado.");
        return;
      }

      try {
        await planilhaStore.carregarPlanilha(arquivoSelecionado);
        console.log("Arquivo carregado com sucesso.");
      } catch (error) {
        console.error("Erro ao carregar o arquivo:", error);
      }
    };

    // Função para lidar com os filtros aplicados
    const filtrosAplicados = (dadosFiltrados) => {
      console.log("Dados filtrados:", dadosFiltrados);
    };

    return {
      colunas,
      dados,
      handleFileChange,
      filtrosAplicados,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
</style>
