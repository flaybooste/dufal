<template>
  <div>
    <h1>Tabela com Filtros</h1>
    <input type="file" @change="handleFileChange" accept=".xlsm, .xlsx, .xls" />
    <TabelaComFiltros v-if="dados.length" :colunas="colunas" :dados="dados" @filtro-aplicado="filtrosAplicados" />
    <div v-else>
      <p>Carregue uma planilha para visualizar os dados.</p>
    </div>
  </div>
</template>

<script>
import TabelaComFiltros from "@/components/FiltroDadosComponent.vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";
import { ref, watch } from "vue";

export default {
  components: { TabelaComFiltros },
  setup() {
    const planilhaStore = usePlanilhaStore(); // Referência à store
    const colunas = ref(planilhaStore.colunas); // Reatividade para colunas
    const dados = ref([]); // Reatividade para os dados processados em tempo real
    const linhasDiff = ref(planilhaStore.linhasDiferentesRJ);
    console.log(linhasDiff);
    // Monitora as alterações nas linhas processadas
    watch(
      () => planilhaStore.dados,
      (novosDados) => {
        dados.value = novosDados; // Atualiza os dados dinamicamente
        console.log("Novas linhas processadas:", novosDados);
      }
    );

    // Função para lidar com a seleção de arquivos
    const handleFileChange = async (event) => {
      const arquivoSelecionado = event.target.files[0];
      if (!arquivoSelecionado) {
        console.warn("Nenhum arquivo selecionado.");
        return;
      }

      try {
        planilhaStore.limparDados(); // Limpa os dados anteriores na store
        await planilhaStore.carregarPlanilha(arquivoSelecionado);
        console.log("Arquivo carregado com sucesso.");
      } catch (error) {
        console.error("Erro ao carregar o arquivo:", error);
      }
    };

    // Função para lidar com filtros aplicados
    const filtrosAplicados = (dadosFiltrados) => {
      console.log("Dados filtrados:", dadosFiltrados);
    };

    return {
      colunas,
      dados,
      handleFileChange,
      filtrosAplicados,
      linhasDiff,
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
