import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatMonthSelectDate(date: Date) {
    return format(date, 'MMMM, yyyy', { locale: ptBR });
}
