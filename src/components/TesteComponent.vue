<template>
  <div>
    <h1>Processamento de Planilha</h1>
    <input type="file" @change="handleFileChange" accept=".xlsm, .xlsx, .xls" />
    <ul>
      <li v-for="(linha, index) in linhasDiferentesRJ" :key="index">
        UF_Emit diferente de RJ: {{ linha }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";

export default {
  setup() {
    const planilhaStore = usePlanilhaStore();
    const linhasDiferentesRJ = ref(planilhaStore.linhasDiferentesRJ); // Reatividade no estado
    // Observa as mudanças no estado "linhasDiferentesRJ"
    const handleFileChange = async (event) => {
      const arquivo = event.target.files[0];
      if (!arquivo) return;

      planilhaStore.limparDados(); // Limpa dados anteriores
      await planilhaStore.carregarPlanilha(arquivo); // Processa o novo arquivo
    };

    return {
      linhasDiferentesRJ,
      handleFileChange,
    };
  },
  computed: {
    ...linhasDiferentesRJ,
  },
};
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}
</style>
