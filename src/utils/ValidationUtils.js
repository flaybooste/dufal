export function validarNCM(ncm) {
    const ncmPermitidos = ["21031090", "12345678", "87654321"];
    return ncmPermitidos.includes(ncm);
  }
  
  export function validarCFOP(cfop) {
    const cfopPermitidos = ["6108", "6102"];
    return cfopPermitidos.includes(cfop);
  }
  