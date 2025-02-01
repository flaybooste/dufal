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
            Total Difal R$ {{ totalDifal.toFixed(2) }} FCP R$ {{ totalFCP.toFixed(2) }}
          </label>
        </div>
      </div>
    </div>
    <!-- Lista com os itens -->
    <div class="box">
      <div class="content is-small">
        <ul>
          <div v-for="(linha, index) in linhasDiferentesRJ" :key="index" class="columns">
            <div v-if="!checkNCM(String(linha.NCM))">
              <li v-if="linha.Finalidade != 'Devolução'" class="column">
                <h2>
                  <a>NF - {{ linha.Numero }}</a>
                  <p>{{ ExcelDateToJSDate(linha.Dt_Emissao).toLocaleString('pt-BR', {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }) }}</p>

                </h2>
                <br />
                <p>
                  <span>FINALIDADE: {{ linha.Finalidade }}</span><br />
                  EMITENTE: {{ linha.Rz_Emit }} - {{ linha.CNPJ_CPF_Emit }} -
                  <b> {{ linha.UF_Emit }}<br /></b>
                  Produto: <b>{{ linha.Produto }}</b> - R$
                  {{ linha.Valor_Produto.toFixed(2) }} -
                  <span class="tag is-hoverable"> NCM - {{ linha.NCM }}</span><br />

                  <span class="tag is-danger" v-if="
                    linha.ICMS_Base_Calculo != 0 &&
                    linha.ICMS_Base_Calculo != '0'
                  ">
                    <div class="column">
                      <p><a><strong>DIFAL: R$
                            <div>
                              {{
                                calcularDifal(
                                  parseFloat(linha.ICMS_Base_Calculo.toFixed(2)),
                                  parseFloat(linha.ICMS_Percentual) / 100,
                                  String(linha.NCM)
                                )[0]
                              }}
                            </div>
                          </strong></a>
                        &nbsp;
                        FCP : R$
                      <div>
                        {{
                          calcularDifal(
                            parseFloat(linha.ICMS_Base_Calculo.toFixed(2)),
                            parseFloat(linha.ICMS_Percentual) / 100,
                            String(linha.NCM)
                          )[1]
                        }}
                      </div>
                </p>

            </div>
            &nbsp;
            <div class="column">
              MEMORIA R${{
                calcularDifal(
                  parseFloat(linha.ICMS_Base_Calculo.toFixed(2)),
                  parseFloat(linha.ICMS_Percentual) / 100,
                  String(linha.NCM)
                )[2]
              }}
              x 20% (ALIQUOTA RJ) = R${{
                calcularDifal(
                  parseFloat(linha.ICMS_Base_Calculo.toFixed(2)),
                  parseFloat(linha.ICMS_Percentual) / 100,
                  String(linha.NCM)
                )[3]
              }}
            </div>
            <br>
            </span>

            <span class="tag is-danger" v-else>
              <div class="column">
                <a><strong>
                    DIFAL: R$
                    {{
                      calcularDifal(
                        parseFloat(linha.Valor_Produto),
                        parseFloat(0.12),
                        String(linha.NCM)
                      )[0]
                    }}</strong></a>
                FCP: R$
                {{
                  calcularDifal(
                    parseFloat(linha.Valor_Produto),
                    parseFloat(0.12),
                    String(linha.NCM)
                  )[1]
                }}
              </div>
              &nbsp;
              <div class="column">
                MEMORIA R${{
                  calcularDifal(
                    parseFloat(linha.Valor_Produto),
                    parseFloat(0.12),
                    String(linha.NCM)
                  )[2]
                }}
                x 20% = R${{
                  calcularDifal(
                    parseFloat(linha.Valor_Produto),
                    parseFloat(0.12),
                    String(linha.NCM)
                  )[3]
                }}
              </div>
              <br>
            </span>
            </p>
            </li>
          </div>
          <div v-else>

          </div>
      </div>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { usePlanilhaStore } from "@/stores/usePlanilhasStore";
import { calcularDifal, checkNCM } from "@/utils/difalUtils";
import { ExcelDateToJSDate } from "@/utils/dateUtils";

export default {
  setup() {
    const planilhaStore = usePlanilhaStore();
    const linhasDiferentesRJ = computed(() => planilhaStore.linhasDiferentesRJ);
    let totDifal = computed(() => planilhaStore.totDifal);
    let totFCP = computed(() => planilhaStore.totFCP);

    const totalDifal = computed(() => planilhaStore.totalDifal);
    const totalFCP = computed(() => planilhaStore.totalFCP);

    watch(totDifal, (dif) => {
      icmsDifal.value = dif;
    })

    const handleFileChange = async (event) => {
      const arquivo = event.target.files[0];
      if (!arquivo) return;

      planilhaStore.limparDados(); // Limpa dados anteriores
      await planilhaStore.carregarPlanilha(arquivo); // Processa o novo arquivo
    };

    let incrementDifal = (valor) => {
      totDifal = totDifal + parseFloat(valor);
    };
    let incrementFCP = (valorFcp) => {
      totFCP = totFCP + parseFloat(valorFcp);
    }
    const icmsDifal = ref([]);
    const fcpDifal = ref([]);


    return {
      planilhaStore,
      totalDifal,
      totalFCP,
      linhasDiferentesRJ,
      handleFileChange,
      calcularDifal,
      checkNCM,
      ExcelDateToJSDate,
      incrementDifal,
      incrementFCP,
      icmsDifal,
      fcpDifal,
    };
  },

  methods: {
  },
};
</script>

<style scoped>
/* Você pode adicionar personalizações aqui, se necessário */
</style>
