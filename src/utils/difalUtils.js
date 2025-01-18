export function calcularDifal(cfop = 6102, valorProd, baseCalc = 0, impICMS = 0, aliq = 0.12) {
    if (baseCal == 0 && baseCal == "0") {
        try {
            const icmsNota = valorProd * aliq;
            const base = valorProd - icmsNota;
            const baseDupla = base / (1 - 0.2);
            const icmsInt = baseDupla * 0.2;
            const difal = icmsInt - icmsNota;
            const fcp = baseDupla * 0.02;
            return [difal.toFixed(2), fcp.toFixed(2)];
        } catch (e) {
            console.error(e);
            return [0, 0];
        }
    } else {
        try {
            var base = baseCalc - icmsNota;
            var baseDupla = base / (1 - 0.2);
            var icmsInt = baseDupla * 0.2;
            var difal = icmsInt - impICMS;
            var fcp = baseDupla * 0.02;
            return [difal.toFixed(2), fcp.toFixed(2)];
        } catch (e) {
            console.error(e);
            return [0, 0];
        }
    }
}
// integrar pra toda vez que tiver um produto que esteja na lista de monofasico diminuir a base de calculo
function calcularDifalMono(cfop = 6102, valorProd, baseCalc = 0, impICMS = 0, aliq = 0.12) {
    let bc = baseCalc;
    let red = bc * 0.1049;
    bc = bc - red;

}


// toda vez que tiver um equipamento do conv 52/91 diminui a base de calculo
let ncm_conv = [
    "84137010", "84137080", "84137090", "84148012", "84148013", "84148019",
    "84148031", "84148033", "84148038", "84148039",
    "84161000", "84162010", "84162090", "84163000", "84169000",
]

var calcularDifalConv5291 = function(valor_prod=10, ncm="84137080") {
    ncm_conv.filter((cod) => {
        (ncm == cod) && console.log(ncm +"/"+ valor_prod)


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
    }else if(icms_pg > 0){
        let base = valor_prod - icms_pg;
        let base_2 = base / (1 - 0.20);
        let base_final = base_2 * aliq_red
        let difal = (base_final * 0.20) - icms_pg
        return difal
    }

}