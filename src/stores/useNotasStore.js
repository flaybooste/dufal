import { defineStore } from 'pinia';
import { parseString } from 'xml2js';

export const useNotasStore = defineStore('notas', {
  state: () => ({
    dadosPorUF: [],
    emitentes: [],
    filtros: { uf: '', emitente: '' },
    ncmPermitidos: [],
  }),
  getters: {
    ufsDisponiveis(state) {
      return [...new Set(state.dadosPorUF.map(nf => nf.uf))];
    },
    dadosFiltrados(state) {
      const { uf, emitente } = state.filtros;
      return state.dadosPorUF.filter(
        nf => (uf ? nf.uf === uf : true) && (emitente ? nf.emitente === emitente : true)
      );
    },
  },
  actions: {
    async processarArquivos(files) {
      for (const file of files) {
        try {
          const content = await file.text();
          this.processarXML(content);
        } catch (error) {
          console.error(`Erro ao processar o arquivo ${file.name}:`, error);
        }
      }
    },
    processarXML(xml) {
      parseString(xml, { explicitArray: false, trim: true }, (err, result) => {
        if (err) {
          console.error('Erro ao processar XML:', err);
          return;
        }

        try {
          const infNFe = result.nfeProc.NFe.infNFe;
          const uf = infNFe.emit.enderEmit.UF;
          const emitente = infNFe.emit;
          const destinatario = infNFe.dest;
          const totais = infNFe.total.ICMSTot;
          const produtos = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];

          const notaFiscal = { uf, emitente, destinatario, totais, produtos };

          this.dadosPorUF = [...this.dadosPorUF, notaFiscal];

          if (!this.emitentes.includes(emitente)) {
            this.emitentes = [...this.emitentes, emitente];
          }
        } catch (error) {
          console.error('Erro ao extrair informações do XML:', error);
        }
      });
    },
    atualizarFiltros(filtros) {
      this.filtros = filtros;
    },
    removerProduto(ncm) {
      this.ncmPermitidos = this.ncmPermitidos.filter(item => item !== ncm);
    },
  },
});
