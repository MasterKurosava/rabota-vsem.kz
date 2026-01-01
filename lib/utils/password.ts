export type PasswordStrength = "weak" | "medium" | "strong";

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (password.length === 0) return "weak";

  let strength = 0;

  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;

  // Character variety
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

  if (strength <= 2) return "weak";
  if (strength <= 4) return "medium";
  return "strong";
}

export function getPasswordStrengthColor(strength: PasswordStrength): string {
  switch (strength) {
    case "weak":
      return "bg-destructive";
    case "medium":
      return "bg-yellow-500";
    case "strong":
      return "bg-green-500";
  }
}

export function getPasswordStrengthText(strength: PasswordStrength, t: (key: string) => string): string {
  switch (strength) {
    case "weak":
      return t("passwordWeak");
    case "medium":
      return t("passwordMedium");
    case "strong":
      return t("passwordStrong");
  }
}








