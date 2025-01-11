export function validarNCMMono(ncm) {
    const ncmPermitidos = ["34012010"];
    if (ncmPermitidos == ncm) {
    }
  }

  export function validarNCMConv5291(ncm) {
    const ncmPermitidos = ["84198190", "85167100", "84198919", "84368000"];
    if (ncmPermitidos == ncm) {

    }
  }
  
  export function validarCFOP(cfop) {
    const cfopPermitidos = ["6108", "6102"];
    return cfopPermitidos.includes(cfop);
  }
  