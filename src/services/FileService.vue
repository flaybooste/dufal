<template>
  <div>
    <h3>Importar Arquivo de Notas Fiscais</h3>
    <input type="file" @change="handleFile" accept=".xlsm, .xlsx, .xls" />
    <p v-if="erro" class="erro">{{ erro }}</p>

    <div v-if="dados.length">
      <h4>Notas Filtradas</h4>
      <ul>
        <li v-for="(nota, index) in dados" :key="index">
          {{ nota }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";

export default {
  setup() {
    const store = usePlanilhaStore(); // Pinia store para gerenciar os dados
    const { carregarPlanilha, dados, colunas, limparDados } = store;

    const erro = ref(null);

    const handleFile = async (event) => {
      const arquivo = event.target.files[0];

      if (!arquivo) {
        erro.value = "Nenhum arquivo selecionado.";
        return;
      }

      if (!/\.(xlsm|xlsx|xls)$/i.test(arquivo.name)) {
        erro.value = "Por favor, selecione um arquivo Excel válido.";
        return;
      }

      try {
        erro.value = null;
        limparDados();
        await carregarPlanilha(arquivo);
      } catch (e) {
        console.error(e);
        erro.value = "Erro ao processar o arquivo.";
      }
    };

    return {
      handleFile,
      dados,
      colunas,
      erro,
    };
  },
};
</script>

<style scoped>
.erro {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
