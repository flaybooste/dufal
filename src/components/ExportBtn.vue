<template>
    <button @click="exportarExcel">Exportar para Excel</button>
  </template>
  
  <script>
  import { exportarParaExcel } from "@/services/ExcelService";
  
  export default {
    props: {
      dadosFiltrados: Array, // Recebe os dados filtrados como prop
    },
    methods: {
      exportarExcel() {
        exportarParaExcel(this.dadosFiltrados);
      },
    },
  };
  </script>
  