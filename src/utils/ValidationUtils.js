const NCM_VALIDOS = [
  "21031090", "12345678", "87654321", "04061090", "04022130",
  "04069090", "21069090", "08061000", "07031029", "16043200",
  "20052000", "20081900", "21039091", "04061010",
];

export function validarNCM(ncm) {
  return NCM_VALIDOS.includes(ncm);
}


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
  