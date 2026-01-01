export function pluralize(count: number, locale: "ru" | "en" | "kk"): string {
  if (locale === "ru") {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "специалистов";
    }
    
    if (lastDigit === 1) {
      return "специалист";
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return "специалиста";
    }
    
    return "специалистов";
  }
  
  if (locale === "kk") {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return "мамандар";
    }
    
    if (lastDigit === 1) {
      return "маман";
    }
    
    return "мамандар";
  }
  
  return count === 1 ? "anketa" : "anketas";
}

