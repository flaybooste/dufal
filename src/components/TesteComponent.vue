<template>
  <div class="container">
    <h1 class="title is-2 mb-4">Processamento de Planilha</h1>

    <!-- Componente de upload de arquivo -->
    <div class="field mb-5">
      <label class="label">Escolha a Planilha</label>
      <div class="control">
        <input 
          type="file" 
          @change="handleFileChange" 
          accept=".xlsm, .xlsx, .xls" 
          class="input"
        />
      </div>
    </div>

    <!-- Lista com os itens -->
    <div class="box">
      <ul>
        <li v-for="(linha, index) in linhasDiferentesRJ" :key="index" class="notification">
          NF - <b>{{ linha.Numero }}</b><br>

          {{ linha.Rz_Emit }}<br>
          {{ linha.UF_Emit }}<br>
          {{ linha.Produto }}<br>


          <p>DIFAL: {{ calcularDifal(linha.ICMS_Base_Calculo, linha.Valor_ICMS)[0] }}</p>
          MEMORIA R${{ calcularDifal(linha.ICMS_Base_Calculo, linha.Valor_ICMS)[2] }} x 0.2 = R${{ calcularDifal(linha.ICMS_Base_Calculo, linha.Valor_ICMS)[3] }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";
import { calcularDifal } from "@/utils/difalUtils";

export default {
  setup() {
    const planilhaStore = usePlanilhaStore();
    const linhasDiferentesRJ = computed(() => planilhaStore.linhasDiferentesRJ);

    const handleFileChange = async (event) => {
      const arquivo = event.target.files[0];
      if (!arquivo) return;

      planilhaStore.limparDados(); // Limpa dados anteriores
      await planilhaStore.carregarPlanilha(arquivo); // Processa o novo arquivo
    };

    return {
      linhasDiferentesRJ,
      handleFileChange,
      calcularDifal,
    };
  },
};
</script>

<style scoped>
/* Você pode adicionar personalizações aqui, se necessário */
</style>
