export function formatDate(value: string) {
    const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    }).format(new Date(value));

    return date;
}