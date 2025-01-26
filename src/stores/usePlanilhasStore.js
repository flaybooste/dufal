import { defineStore } from "pinia";
import * as XLSX from "xlsx";
import { calcularDifal } from "@/utils/difalUtils";

export const usePlanilhaStore = defineStore("planilha", {
  state: () => ({
    colunas: [],
    dados: [],
    linhasDiferentesRJ: [], // Lista de linhas com UF_Emit !== "RJ"
    totDifal: 0,
  }),
  getters: {
    calDif(state) {
      return state.totDifal;
    },
  },
  actions: {
    async carregarPlanilha(arquivo) {
      if (!arquivo) throw new Error("Arquivo não encontrado");

      const leitor = new FileReader();

      leitor.onload = (e) => {
        const dadosBinarios = e.target.result;
        const workbook = XLSX.read(dadosBinarios, { type: "binary" });
        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];
        const dadosJSON = XLSX.utils.sheet_to_json(planilha, { header: 1 });

        // A primeira linha contém os nomes das colunas
        this.colunas = dadosJSON[0];

        // Processar as linhas em tempo real
        const processarLinha = async (linha, index) => {
          const dadosLinha = linha.reduce((acc, valor, colIndex) => {
            acc[this.colunas[colIndex]] = valor;
            return acc;
          }, {});

          // Verificar UF_Emit
          if (dadosLinha["UF_Emit"] && dadosLinha["UF_Emit"] !== "RJ") {
            if (dadosLinha.ICMS_Base_Calculo != 0 && dadosLinha.ICMS_Base_Calculo != '0') {
              this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
              this.totDifal += parseFloat(calcularDifal(dadosLinha.ICMS_Base_Calculo, dadosLinha.Valor_ICMS)[0]);
            } else {
              this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
              this.totDifal += parseFloat(calcularDifal(parseFloat(dadosLinha.Valor_Produto), parseFloat(dadosLinha.Valor_Produto * 0.12)[0]));
            }

          }

          this.dados.push(dadosLinha); // Atualiza os dados no estado atual
        };

        // Iterar sobre as linhas (excluindo o cabeçalho)
        dadosJSON.slice(1).forEach((linha, index) => {
          setTimeout(() => {
            processarLinha(linha, index); // Processa a linha em tempo real
          }, 0); // Executa sem bloquear o loop
        });
      };

      leitor.onerror = (e) => {
        console.error("Erro ao ler o arquivo:", e);
        throw new Error("Erro ao processar o arquivo.");
      };

      leitor.readAsBinaryString(arquivo);
    },
    tratarUfEmitDiferenteRJ(linha) {
      // Adiciona a linha à lista de linhas com UF_Emit diferente de "RJ"
      this.linhasDiferentesRJ.push(linha);
    },
    getNotasPorEstado(estado) {
      return this.dados.filter((registro) => registro["UF_Emit"] === estado);
    },
    limparDados() {
      this.colunas = [];
      this.dados = [];
      this.linhasDiferentesRJ = []; // Limpa as linhas com UF_Emit !== "RJ"
      this.totDifal = 0;
    },
    incrementDifal(valorDifal) {
      this.totDifal = this.totDifal + valorDifal;
    },
  },
});
