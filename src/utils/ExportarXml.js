methods: {
  exportarParaExcel() {
    const workbook = this.criarWorkbook();
    const worksheetData = this.criarDadosWorksheet();

    if (worksheetData.length === 1) {
      alert("Nenhum dado válido para exportar!");
      return;
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Salvar como arquivo .xlsm
    XLSX.writeFile(workbook, "notas_fiscais.xlsm", { bookType: "xlsm" });
  },

  criarWorkbook() {
    return XLSX.utils.book_new();
  },

  criarDadosWorksheet() {
    const worksheetData = [];

    // Cabeçalho conforme o modelo
    worksheetData.push([
      "CPF/CNPJ",
      "Razão Social",
      "UF",
      "Município",
      "Endereço",
      "Número Documento",
      "Série",
      "Data",
      "Situação (0- Regular / 2- Cancelada)",
      "Acumulador",
      "CFOP",
      "Valor Produtos",
      "Valor Descontos",
      "Valor Contábil",
      "Base de Calculo ICMS",
      "Alíquota ICMS",
      "Valor ICMS",
      "Outras ICMS",
      "Isentas ICMS",
      "Base de Calculo IPI",
      "Alíquota IPI",
      "Valor IPI",
      "Outras IPI",
      "Isentas IPI",
      "Código do Item",
      "Quantidade",
      "Valor Unitário",
      "CST PIS/COFINS",
      "Base de Calculo PIS/COFINS",
      "Alíquota PIS",
      "Valor PIS",
      "Alíquota COFINS",
      "Valor COFINS",
    ]);

    // Adicionando dados filtrados
    this.dadosFiltrados.forEach((nf) => {
      nf.produtos.forEach((produto) => {
        if (!this.validarNCM(produto.prod.NCM) && this.validarCFOP(produto.prod.CFOP)) {
          const linha = this.criarLinhaProduto(nf, produto);
          worksheetData.push(linha);
        }
      });
    });

    return worksheetData;
  },

  criarLinhaProduto(nf, produto) {
    return [
      nf.emitente.CNPJ, // CPF/CNPJ
      nf.emitente.xNome, // Razão Social
      nf.emitente.enderEmit.UF, // UF
      nf.emitente.enderEmit.xMun, // Município
      nf.emitente.enderEmit.xLgr, // Endereço
      nf.numero, // Número Documento
      nf.serie, // Série
      nf.data, // Data
      nf.situacao, // Situação
      nf.acumulador, // Acumulador
      produto.prod.CFOP, // CFOP
      produto.prod.vProd, // Valor Produtos
      produto.prod.vDesc || 0, // Valor Descontos
      nf.totais.vNF, // Valor Contábil
      produto.imposto.ICMS.base || 0, // Base de Cálculo ICMS
      produto.imposto.ICMS.aliq || 0, // Alíquota ICMS
      produto.imposto.ICMS.valor || 0, // Valor ICMS
      produto.imposto.ICMS.outras || 0, // Outras ICMS
      produto.imposto.ICMS.isentas || 0, // Isentas ICMS
      produto.imposto.IPI.base || 0, // Base de Cálculo IPI
      produto.imposto.IPI.aliq || 0, // Alíquota IPI
      produto.imposto.IPI.valor || 0, // Valor IPI
      produto.imposto.IPI.outras || 0, // Outras IPI
      produto.imposto.IPI.isentas || 0, // Isentas IPI
      produto.prod.cProd, // Código do Item
      produto.prod.qCom, // Quantidade
      produto.prod.vUnCom, // Valor Unitário
      produto.imposto.PIS.CST || '', // CST PIS/COFINS
      produto.imposto.PIS.base || 0, // Base de Cálculo PIS/COFINS
      produto.imposto.PIS.aliq || 0, // Alíquota PIS
      produto.imposto.PIS.valor || 0, // Valor PIS
      produto.imposto.COFINS.aliq || 0, // Alíquota COFINS
      produto.imposto.COFINS.valor || 0, // Valor COFINS
    ];
  },

  validarCFOP(cfop) {
    // Adicione aqui os CFOPs permitidos
    const cfopPermitidos = ["1933", "1102", "2201"]; // Exemplo de CFOPs válidos
    return cfopPermitidos.includes(cfop);
  },
}
