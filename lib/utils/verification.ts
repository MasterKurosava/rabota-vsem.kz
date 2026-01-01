export function normalizeVerificationCode(value: unknown): string {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
}

export function isValidVerificationCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function extractCodeFromPaste(
  e: React.ClipboardEvent<HTMLInputElement>
): string {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text");
  return normalizeVerificationCode(pasted);
}

