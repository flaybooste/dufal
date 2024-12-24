// utils/ncmUtils.js

const NCM_VALIDOS = [
    "21031090", "12345678", "87654321", "04061090", "04022130",
    "04069090", "21069090", "08061000", "07031029", "16043200",
    "20052000", "20081900", "21039091", "04061010",
  ];
  
  export function validarNCM(ncm) {
    return NCM_VALIDOS.includes(ncm);
  }
  