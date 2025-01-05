export const usePlanilhaStore = defineStore('planilha', {
  state: () => ({
    colunas: [],
    dados: [],
  }),
  actions: {
    async carregarPlanilha(file) {
      if (!file) return;

      const leitor = new FileReader();

      leitor.onload = (e) => {
        const dadosBinarios = e.target.result;
        const workbook = XLSX.read(dadosBinarios, { type: 'binary' });

        // Ler a primeira planilha
        const primeiraPlanilha = workbook.SheetNames[0];
        const planilha = workbook.Sheets[primeiraPlanilha];

        // Converter os dados da planilha em JSON
        const dadosJSON = XLSX.utils.sheet_to_json(planilha, { header: 1 });

        // A primeira linha contém os nomes das colunas
        this.colunas = dadosJSON[0];

        // As linhas seguintes contêm os dados
        this.dados = dadosJSON.slice(1).map((linha) =>
          linha.reduce((acc, valor, index) => {
            acc[this.colunas[index]] = valor;
            return acc;
          }, {})
        );
      };

      leitor.readAsBinaryString(file);
    },
    limparDados() {
      this.colunas = [];
      this.dados = [];
    },
    verificarUFEmit() {
      if (this.dados.length === 0) {
        console.warn('Nenhum dado carregado para verificar o UF_Emit.');
        return;
      }

      // Filtrar os dados para verificar se o campo UF_Emit existe
      const ufEmitPorEstado = this.dados.reduce((acc, registro) => {
        const ufEmit = registro['UF_Emit'];
        if (ufEmit) {
          if (!acc[ufEmit]) {
            acc[ufEmit] = [];
          }
          acc[ufEmit].push(registro);
        }
        return acc;
      }, {});

      console.log('UF_Emit agrupado por estado:', ufEmitPorEstado);
      return ufEmitPorEstado;
    },
  },
});
