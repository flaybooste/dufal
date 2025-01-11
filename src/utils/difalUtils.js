export function calcularDifal(cfop = 6102, valorProd, baseCalc = 0, impICMS = 0, aliq = 0.12) {
    if( baseCal == 0 && baseCal == "0"){
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
    }else {
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
function calcularDifalMono(cfop = 6102, valorProd, baseCalc = 0, impICMS = 0, aliq = 0.12){
    let bc = baseCalc;
    let red = bc * 0.1049;
    bc = bc - red;

}

function calcularDifalConv5291(cfop = 6102, valorProd, baseCalc = 0, impICMS = 0, aliq = 0.12){
    let bc = baseCalc;
    let bc_red = (100 * 8.80) / 100;
    bc = (bc * bc_red) * 0.20;
    return bc
}