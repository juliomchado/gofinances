export function formatAmountToReal(value: string) {
    const amount = Number(value)
        .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).replace('R$', 'R$ ');

    return amount;
} 