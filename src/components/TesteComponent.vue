<template>
  <div class="container">
    <h1 class="title is-2 mb-4">Processamento de Planilha</h1>

    <!-- Componente de upload de arquivo -->
    <div class="columns">
      <div class="column">
        <div class="field mb-5">
          <label class="label">Escolha a Planilha</label>
          <div class="control">
            <input type="file" @change="handleFileChange" accept=".xlsm, .xlsx, .xls" class="input" />
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field mb-5">
          <label class="label">
            Total Difal R$ {{ calDif.toFixed(2) }}
          </label>
        </div>
      </div>
    </div>
    <!-- Lista com os itens -->
    <div class="box">
      <div class="content is-small">
        <ol type="1">
          <li v-for="(linha, index) in linhasDiferentesRJ" :key="index" class="notification is-link">
            <div v-if="linha.Finalidade != 'Devolução'">
              <h2><a>NF - {{ linha.Numero }}</a></h2><br>
              <p>
                <span v-if="linha.Finalidade != 'Devolução'">FINALIDADE: {{ linha.Finalidade }}</span><br>

                EMITENTE: {{ linha.Rz_Emit }} - {{ linha.CNPJ_CPF_Emit }} -
                <b> {{ linha.UF_Emit }}<br></b>
                Produto: <b>{{ linha.Produto }}</b> - R$ {{ linha.Valor_Produto.toFixed(2) }} - <span
                  class="tag is-hoverable"> NCM - {{ linha.NCM }}</span><br>

                <span class="tag is-danger" v-if="linha.ICMS_Base_Calculo != 0 && linha.ICMS_Base_Calculo != '0'">
                  <div class="column">

                    <a><strong>DIFAL: R$ {{ calcularDifal(linha.ICMS_Base_Calculo, impICMS = linha.Valor_ICMS)[0]
                        }}</strong></a>
                  </div>
                  &nbsp;
                  <div class="column">

                    MEMORIA R${{ calcularDifal(linha.ICMS_Base_Calculo, impICMS = linha.Valor_ICMS)[2] }} x 0.2 = R${{
                      calcularDifal(linha.ICMS_Base_Calculo, impICMS = linha.Valor_ICMS)[3] }}
                  </div>

                </span>

                <span class="tag is-danger" v-else>
                  <div class="column">
                    <a><strong>
                        DIFAL: R$ {{ calcularDifal(linha.Valor_Produto, impICMS = (linha.Valor_Produto * 0.12))[0]
                        }}</strong></a>
                  </div>
                  &nbsp;<div class="column">MEMORIA R${{ calcularDifal(linha.Valor_Produto, impICMS =
                    (linha.Valor_Produto * 0.12))[2] }} x 0.2 =
                    R${{
                      calcularDifal(linha.Valor_Produto, impICMS = (linha.Valor_Produto * 0.12))[3] }}
                  </div>
                </span>


              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch } from "vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";
import { calcularDifal } from "@/utils/difalUtils";
//import { mapActions } from "pinia";


export default {

  setup() {
    const planilhaStore = usePlanilhaStore();
    const linhasDiferentesRJ = computed(() => planilhaStore.linhasDiferentesRJ);
    let totDifal = computed(() => planilhaStore.totDifal)
    const calDif = computed(() => planilhaStore.calDif)
    const handleFileChange = async (event) => {
      const arquivo = event.target.files[0];
      if (!arquivo) return;

      planilhaStore.limparDados(); // Limpa dados anteriores
      await planilhaStore.carregarPlanilha(arquivo); // Processa o novo arquivo
    };

    let incrementDifal = (valor) => {
      totDifal = totDifal + valor
    }
    return {
      planilhaStore,
      calDif,
      linhasDiferentesRJ,
      handleFileChange,
      calcularDifal,
      incrementDifal,
    };
  },

  methods: {
    //...mapActions(usePlanilhaStore, ['incrementDifal']),

  },
};
</script>

<style scoped>
/* Você pode adicionar personalizações aqui, se necessário */
</style>
