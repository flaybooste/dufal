import { defineStore } from "pinia";
import * as XLSX from "xlsx";
import { calcularDifal } from "@/utils/difalUtils";
import { checkNCM } from "@/utils/ncmUtils";

export const usePlanilhaStore = defineStore("planilha", {
  state: () => ({
    colunas: [],
    dados: [],
    linhasDiferentesRJ: [], // Lista de linhas com UF_Emit !== "RJ"
    totDifal: 0,
    totFCP: 0,
  }),
  getters: {
    totalDifal(state) {
      return parseFloat(state.totDifal);
    },
    totalFCP(state) {
      return parseFloat(state.totFCP);
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
              if (!checkNCM(String(dadosLinha.NCM))) {
                let temp = calcularDifal(parseFloat(dadosLinha.ICMS_Base_Calculo), parseFloat(dadosLinha.ICMS_Percentual) / 100)
                this.totDifal += parseFloat(temp[0]);
                this.totFCP += parseFloat(temp[1])
              }
            } else {
              this.tratarUfEmitDiferenteRJ(dadosLinha); // Gatilho
              if (!checkNCM(String(dadosLinha.NCM))) {
                let temp = calcularDifal(parseFloat(dadosLinha.Valor_Produto), parseFloat(0.12))
                this.totDifal += parseFloat(temp[0]);
                this.totFCP += parseFloat(temp[1])

              }
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
      this.totFCP = 0;
    },
    incrementDifal(valorDifal) {
      this.totDifal = this.totDifal + parseFloat(valorDifal);
    },
    incrementFCP(valorFcp) {
      this.totFCP = this.totFCP + parseFloat(valorFcp);
    }

  },
});
