export function calcularDifal(cfop = 6102, valorProd, aliq = 0.12) {
    if (cfop == 6108) {
        try {
            const icmsNota = valorProd * aliq;
            const base = valorProd - icmsNota;
            const baseCal = base / (1 - 0.2);
            const icmsInt = baseCal * 0.2;
            const difal = icmsInt - icmsNota;
            const fcp = baseCal * 0.02;
            return [difal.toFixed(2), fcp.toFixed(2)];
        } catch (e) {
            console.error(e);
            return [0, 0];
        }
    } else {
        return "CFOP DO PRODUTO DIFERENTE DE 6108";
    }
}