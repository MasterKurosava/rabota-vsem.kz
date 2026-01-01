export const PHONE_PLACEHOLDER = "+7 (XXX) XXX-XX-XX";

export function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length === 0) return "";
  
  let phone = digits;
  if (phone.startsWith("8")) {
    phone = "7" + phone.slice(1);
  } else if (!phone.startsWith("7")) {
    phone = "7" + phone;
  }
  
  if (phone.length <= 1) return `+7`;
  if (phone.length <= 4) return `+7 (${phone.slice(1)}`;
  if (phone.length <= 7) return `+7 (${phone.slice(1, 4)}) ${phone.slice(4)}`;
  if (phone.length <= 9) return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7)}`;
  return `+7 (${phone.slice(1, 4)}) ${phone.slice(4, 7)}-${phone.slice(7, 9)}-${phone.slice(9, 11)}`;
}

export function validatePhoneFormat(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("7");
}

export function getPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  return formatPhoneNumber(phone);
}
