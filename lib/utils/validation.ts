export interface ValidationErrors {
  [key: string]: string;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "emailRequired";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "emailInvalid";
  }
  return null;
}

export function validatePhone(phone: string, minLength: number = 10): string | null {
  if (!phone.trim()) {
    return "phoneRequired";
  }
  if (phone.length < minLength) {
    return "phoneInvalid";
  }
  return null;
}

export function validateRequired(value: string, fieldName: string = "field"): string | null {
  if (!value.trim()) {
    return `${fieldName}Required`;
  }
  return null;
}

export function validatePassword(password: string, minLength: number = 8): string | null {
  if (!password.trim()) {
    return "passwordRequired";
  }
  if (password.length < minLength) {
    return "passwordMinLength";
  }
  return null;
}

export function validatePasswordConfirmation(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword.trim()) {
    return "confirmPasswordRequired";
  }
  if (password !== confirmPassword) {
    return "passwordsNotMatch";
  }
  return null;
}

