<template>
  <div>
    <h1>Leitura de Arquivos XML</h1>
    <button @click="onFolderSelect">Selecionar Pasta</button>

    <div v-if="Object.keys(agrupadosPorUF).length">
      <h3>Selecione a UF:</h3>
      <select v-model="ufSelecionada" @change="filtrarPorUF">
        <option value="">Todas</option>
        <option v-for="(dados, uf) in agrupadosPorUF" :key="uf" :value="uf">
          {{ uf }}
        </option>
      </select>

      <h3>Selecione o Emitente:</h3>
      <select v-model="emitenteSelecionado" @change="filtrarPorEmitente">
        <option value="">Todos</option>
        <option v-for="(dados, emitente) in emitentesDisponiveis" :key="emitente" :value="emitente">
          {{ emitente }}
        </option>
      </select>

      <button @click="exportarParaExcel">Exportar para Excel</button>

      <div v-if="dadosFiltrados.length">
        <h3>Notas Fiscais:</h3>
        <div v-for="(nf, i) in dadosFiltrados" :key="i">
          <ul>
            <li>
              <strong>Emitente:</strong> {{ nf.emitente.xNome }}<br>
              <strong>Destinatário:</strong> {{ nf.destinatario.xNome }}<br>
              <strong>UF: </strong> {{ nf.emitente.enderEmit.UF }}
              <ul v-for="item in nf.produtos">
                <span v-if="!validarNCM(item.prod.NCM)">
                  <strong>Produto: </strong><br>

                  {{ item.prod.xProd }} - R${{ item.prod.vProd }}<br>
                  <strong>NCM:</strong> {{ item.prod.NCM }} <button
                    v-on:click="this.ncmPermitidos.push(item.prod.NCM)">Remover produto</button>
                  <strong> (NCM inválido para a atividade)</strong>
                  <br>
                  <strong v-if="Object.values(item.imposto.ICMS)[0].orig != '1'">DIFAL: {{
                    calculobaseDupla_Int(item.prod.vProd)[0] }} FCP: {{
                      calculobaseDupla_Int(item.prod.vProd)[1] }}</strong>
                  <strong v-else>DIFAL: {{ calculobaseDupla_Int(item.prod.vProd, 0.04)[0] }} FCP: {{
                    calculobaseDupla_Int(item.prod.vProd)[1] }} </strong>
                </span>

              </ul><br>
              <strong>Total NF:</strong> {{ nf.totais.vNF }}
            </li>
          </ul>
        </div>
      </div>

      <div v-else>
        <p>Nenhuma nota fiscal encontrada para os filtros aplicados.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { parseString } from "xml2js";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      agrupadosPorUF: {},
      ufSelecionada: "",
      emitenteSelecionado: "",
      dadosFiltrados: [],
      emitentesDisponiveis: {},
      ncmPermitidos: ["21031090", "12345678", "87654321", "04061090", "04022130", "04069090", "21069090", "08061000", "07031029", "16043200", "20052000", "20081900", "21039091", "04061010"], // Exemplo de NCMs permitidos
    };
  },
  methods: {
    async onFolderSelect() {
      try {
        const folderHandle = await window.showDirectoryPicker();
        for await (const [_, handle] of folderHandle) {
          if (handle.kind === "file" && handle.name.endsWith(".xml")) {
            const file = await handle.getFile();
            const content = await file.text();
            this.processXML(content);
          }
        }
        this.filtrarPorUF();
      } catch (error) {
        console.error("Erro ao selecionar pasta:", error);
      }
    },
    processXML(xml) {
      parseString(xml, { explicitArray: false, trim: true }, (err, result) => {
        try {
          const infNFe = result.nfeProc.NFe.infNFe;
          const ufDest = infNFe.emit.enderEmit.UF;
          const emitente = infNFe.emit;
          const destinatario = infNFe.dest;
          const totais = infNFe.total.ICMSTot;
          const produtos = Array.isArray(infNFe.det)
            ? infNFe.det.map((det) => det)
            : [infNFe.det];
            //firebase inserir dados de empresas
          const addData = async () => {
            try {
              await addDoc(collection(db, "empresas"), {
                cnpj: nome.value,
                idade: parseInt(idade.value),
              });
              console.log("Dados salvos!");
            } catch (error) {
              console.error("Erro ao salvar dados:", error.message);
            }
          };

          return { nome, idade, addData };
        },
        const nfData = {
          emitente,
          destinatario,
          totais,
          produtos,
        };

        // Agrupar por UF
        if (!this.agrupadosPorUF[ufDest]) {
          this.agrupadosPorUF[ufDest] = [];
        }
        this.agrupadosPorUF[ufDest].push(nfData);

        // Adicionar emitente à lista
        if (!this.emitentesDisponiveis[emitente.xNome]) {
          this.emitentesDisponiveis[emitente.xNome] = true;
        }
      } catch (error) {
        console.error("Erro ao extrair informações do XML:", error);
      }
    });
  },
  filtrarPorUF() {
    const dadosPorUF = this.ufSelecionada
      ? this.agrupadosPorUF[this.ufSelecionada] || []
      : Object.values(this.agrupadosPorUF).flat();

    this.dadosFiltrados = this.emitenteSelecionado
      ? dadosPorUF.filter((nf) => nf.emitente.xNome === this.emitenteSelecionado)
      : dadosPorUF;
  },
  filtrarPorEmitente() {
    this.filtrarPorUF();
  },
  validarNCM(ncm) {
    return this.ncmPermitidos.includes(ncm);
  },
  calculobaseDupla_Int(valor_prod, aliq = 0.12) {
    try {
      let icms_nota = valor_prod * aliq; 4.72
      let base = valor_prod - icms_nota;
      let base_cal = base / (1 - 0.20);
      let icms_int = base_cal * 0.20;
      var difal = icms_int - icms_nota;
      var difal_fcp = base_cal * 0.02;
      return [difal.toFixed(2), difal_fcp.toFixed(2)]
    } catch (e) {
      console.log(e);
    }
  },
  exportarParaExcel() {
    const wsData = this.dadosFiltrados
      .filter(nf => nf.emitente.enderEmit.UF != "RJ") // Filtrar notas válidas
      .map((nf) => ({
        Emitente: nf.emitente.xNome,
        UFEmitente: nf.emitente.enderEmit.UF,
        Destinatário: nf.destinatario.xNome,
        Total: nf.totais.vNF,
        Produtos: nf.produtos
          .map((prod) => {
            var DIFAL = [];
            if (!this.validarNCM(prod.prod.NCM)) {

              if (Object.values(prod.imposto.ICMS)[0].orig != '1') {
                DIFAL.push(this.calculobaseDupla_Int(prod.prod.vProd))
              } else {
                DIFAL.push(this.calculobaseDupla_Int(prod.prod.vProd, 0.04))
              }
              return `${prod.prod.xProd} (NCM: ${prod.prod.NCM}) (Valor: R$ ${prod.prod.vProd}) (Difal: R$ ${DIFAL[0][0]}) (Difal FCP: R$ ${DIFAL[0][1]})`

            }
          })
          .join(", "),
      }));

    if (wsData.length === 0) {
      alert("Nenhum dado para exportar!");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Notas Fiscais");

    XLSX.writeFile(wb, "notas_fiscais.xlsx");
  },
},
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

select {
  padding: 5px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h3 {
  margin-top: 20px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}
</style>
