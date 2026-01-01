/**
 * Возвращает новую дату с добавлением минут
 */
export function addMinutes(date: Date, minutes: number): Date {
    return new Date(date.getTime() + minutes * 60_000);
  }
  