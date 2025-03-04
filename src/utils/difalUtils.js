export const FOOD = ["407", "406", "2202"];

export function calcularDifal(valorProd = 0, aliq = 0.12, ncm = "") {
  let infoComp = "N";
  try {
    const icmsNota = valorProd * aliq;
    const base = valorProd - icmsNota;
    let baseDupla = base / (1 - 0.2);
    if (checkNCMMono(String(ncm))) {
      baseDupla = calcularDifalMono(baseDupla);
      infoComp = "S";
    }
    if (checkNCMConv(String(ncm))) {
      baseDupla = difalConv5291(baseDupla);
      infoComp = "S";
    }
    const icmsInt = baseDupla * 0.2;
    const difal = icmsInt - icmsNota;
    const fcp = baseDupla * 0.02;

    return [
      difal.toFixed(2),
      fcp.toFixed(2),
      baseDupla.toFixed(2),
      icmsInt.toFixed(2),
      infoComp,
    ];
  } catch (e) {
    console.error(e);
    return [0, 0, 0, 0, infoComp];
  }
}

const NCM_MONO = [
  "3001",
  "3303",
  "3304",
  "3305",
  "3307",
  "34011190",
  "34012010",
];

export function checkNCM(ncm) {
  let ver = false;
  FOOD.forEach((item) => {
    if (ncm.startsWith(item)) {
      ver = true;
    }
  });
  return ver;
}

function checkNCMMono(ncm) {
  let ver = false;
  NCM_MONO.forEach((item) => {
    if (ncm.startsWith(item)) {
      ver = true;
    }
  });
  return ver;
}
// integrar pra toda vez que tiver um produto que esteja na lista de monofasico diminuir a base de calculo
// startsWith("3001")
function calcularDifalMono(baseCalc) {
  let bc = baseCalc;
  let red = bc * 0.1049;
  let base_red = bc - red;
  return base_red;
}

// toda vez que tiver um equipamento do conv 52/91 diminui a base de calculo
let ncm_conv = [
  "84137010",
  "84137080",
  "84137090",
  "84148012",
  "84148013",
  "84148019",
  "84148031",
  "84148033",
  "84148038",
  "84148039",
  "84161000",
  "84162010",
  "84162090",
  "84163000",
  "84169000",
  "84323110"
];


function checkNCMConv(ncm) {
  let ver = false;
  ncm_conv.forEach((item) => {
    if (ncm.startsWith(item)) {
      ver = true;
    }
  });
  return ver;
}

export const difalConv5291 = (baseCalc, aliq = 0.12) => {
  let bc = baseCalc;
  let aliq_red = (100 * 0.088) / aliq / 100;
  let base_red = bc * aliq_red;
  return base_red;
};

export const diFal = (valor_prod = 10, aliq = 0.12, icms_pg = 0) => {
  let aliq_red = (100 * 0.088) / aliq / 100;
  if (icms_pg === 0) {
    icms_pg = valor_prod * aliq;
    let base = valor_prod - icms_pg;
    let base_2 = base / (1 - 0.2);
    let base_final = base_2 * aliq_red;
    let difal = base_final * 0.2 - icms_pg;
    return difal;
  } else if (icms_pg > 0) {
    let base = valor_prod - icms_pg;
    let base_2 = base / (1 - 0.2);
    let base_final = base_2 * aliq_red;
    let difal = base_final * 0.2 - icms_pg;
    return difal;
  }
};
