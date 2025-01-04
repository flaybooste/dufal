<template>
  <div>
    <h1>Tabela com Filtros</h1>
    <input type="file" @change="handleFileChange" />
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

    // Carrega a planilha inicial (caso necessário)
    const carregarPlanilhaInicial = async () => {
      await planilhaStore.carregarPlanilha();
    };

    carregarPlanilhaInicial();

    // Monitora alterações nos dados da planilha
    watch(
      () => planilhaStore.dados,
      (novosDados) => {
        if (novosDados && novosDados.length) {
          console.log("Planilha carregada com sucesso:", novosDados);
        }
      },
      { immediate: true } // Executa no início para capturar os dados já carregados
    );

    // Função para lidar com a seleção do arquivo
    const handleFileChange = async (event) => {
      const arquivoSelecionado = event.target.files[0];
      if (arquivoSelecionado) {
        console.log("Arquivo selecionado:", arquivoSelecionado);
        await planilhaStore.carregarPlanilha(arquivoSelecionado); // Passa o arquivo para o método
      }
    };

    return {
      colunas: planilhaStore.colunas,
      dados: planilhaStore.dados,
      filtrosAplicados: (dadosFiltrados) => {
        console.log("Dados filtrados:", dadosFiltrados);
      },
      handleFileChange,
    };
  },
};
</script>
