<template>
    <div class="container">
      <h1>API SIEG Integração</h1>
      <p>Resultado da API:</p>
      <textarea readonly>{{ response }}</textarea>
  
      <button @click="fetchXmls" :disabled="loading">Enviar Requisição</button>
      <p v-if="loading">Carregando...</p>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        apiKey: "821HcRy9hR1f8T%2bIZEFxUA%3d%3d", // Substitua pela sua chave de API
        response: "",
        loading: false,
        error: null,
      };
    },
    methods: {
      async fetchXmls() {
        this.loading = true;
        this.error = null;
  
        // URL do endpoint
        const url = "https://api.sieg.com/BaixarXmls";
  
        // Dados a serem enviados
        const payload = {
          "XmlType": 1, // Tipo de XML (NFe, neste caso)
          "Take": 10, // Quantidade de XMLs por requisição
          "Skip": 0, // Pular registros (começar do início)
          "DataEmissaoInicio": "2024-11-01T00:00:00Z", // Data inicial
          "DataEmissaoFim": "2024-11-30T23:59:59Z", // Data final
          "CnpjDest": "42927468000176", // CNPJ do emitente
          "Downloadevent": false, // Não incluir eventos
        };
  
        try {
          // Realiza a requisição
          const result = await axios.post(`${url}?api_key=${this.apiKey}`, payload, {
            headers: {
              "Content-Type": "application/json", // Cabeçalho necessário
            },
          });
  
          // Atualiza o resultado na interface
          this.response = JSON.stringify(result.data, null, 2);
        } catch (err) {
          // Captura erros
          console.error(err);
          this.error = "Erro ao conectar à API.";
        } finally {
          this.loading = false;
        }
      },
    },
  };
  </script>
  
  <style>
  body {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  .container {
    max-width: 600px;
    margin: auto;
  }
  h1 {
    text-align: center;
  }
  textarea {
    width: 100%;
    height: 150px;
    margin: 10px 0;
  }
  button {
    display: block;
    width: 100%;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  