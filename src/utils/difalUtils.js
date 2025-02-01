
export const FOOD = ['407', '406', '2202']

export function calcularDifal(valorProd = 0, aliq = 0.12, ncm = "") {
    try {
        const icmsNota = valorProd * aliq;
        const base = valorProd - icmsNota;
        let baseDupla = base / (1 - 0.2);
        if (checkNCMMono(String(ncm))) {
            baseDupla = calcularDifalMono(baseDupla)
        }
        const icmsInt = baseDupla * 0.2;
        const difal = icmsInt - icmsNota;
        const fcp = baseDupla * 0.02;
        return [difal.toFixed(2), fcp.toFixed(2), baseDupla.toFixed(2), icmsInt.toFixed(2)];
    } catch (e) {
        console.error(e);
        return [0, 0];
    }
}


const NCM_MONO = [
    "3001", "3303", "3304", "3305", "3307",
    "34011190", "34012010"
]



export function checkNCM(ncm) {
    let ver = false;
    FOOD.filter(item => {
        if (ncm.startsWith(item)) {
            ver = true;
        }
    });
    return ver
}

function checkNCMMono(ncm) {
    let ver = false;
    NCM_MONO.filter(item => {
        if (ncm.startsWith(item)) {
            ver = true;
        }
    });
    return ver
}
// integrar pra toda vez que tiver um produto que esteja na lista de monofasico diminuir a base de calculo
// startsWith("3001")
function calcularDifalMono(baseCalc) {
    let bc = baseCalc;
    let red = bc * 0.1049;
    let base_red = bc - red;
    return base_red
}


// toda vez que tiver um equipamento do conv 52/91 diminui a base de calculo
let ncm_conv = [
    "84137010", "84137080", "84137090", "84148012", "84148013", "84148019",
    "84148031", "84148033", "84148038", "84148039",
    "84161000", "84162010", "84162090", "84163000", "84169000",
]

var calcularDifalConv5291 = function (valor_prod = 10, ncm = "84137080") {
    ncm_conv.filter((cod) => {
        (ncm == cod) && console.log(ncm + "/" + valor_prod)


    })
}

export const difalConv5291 = (valor_prod = 10, aliq = 0.12, icms_pg = 0) => {
    icms_pg = valor_prod * aliq;
    let base = valor_prod - icms_pg;
    let base_2 = base / (1 - 0.20);
    let aliq_red = ((100 * 0.088) / aliq) / 100;
    let base_final = base_2 * aliq_red
    let difal = (base_final * 0.20) - icms_pg
    return difal
}

export const diFal = (valor_prod = 10, aliq = 0.12, icms_pg = 0) => {
    if (icms_pg === 0) {
        icms_pg = valor_prod * aliq;
        let base = valor_prod - icms_pg;
        let base_2 = base / (1 - 0.20);
        let base_final = base_2 * aliq_red
        let difal = (base_final * 0.20) - icms_pg
        return difal
    } else if (icms_pg > 0) {
        let base = valor_prod - icms_pg;
        let base_2 = base / (1 - 0.20);
        let base_final = base_2 * aliq_red
        let difal = (base_final * 0.20) - icms_pg
        return difal
    }

}