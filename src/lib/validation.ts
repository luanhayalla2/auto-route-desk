// Lightweight validators (no deps). Mensagens em PT-BR no padrão SENAC.

export function validateEmail(v: string): string | null {
  if (!v) return "Informe seu e-mail institucional.";
  if (v.length > 255) return "E-mail muito longo.";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v)) return "Formato de e-mail inválido. Ex.: nome@ma.senac.br";
  return null;
}

// Aceita CPF (11 dígitos com validação) ou matrícula (6+ dígitos)
export function validateCpfOrMatricula(v: string): string | null {
  if (!v) return null; // opcional
  const digits = v.replace(/\D/g, "");
  if (digits.length === 11) {
    if (!isValidCpf(digits)) return "CPF inválido — verifique os dígitos.";
    return null;
  }
  if (digits.length >= 6 && digits.length <= 12) return null; // matrícula
  return "Use um CPF (11 dígitos) ou matrícula (6 a 12 dígitos).";
}

function isValidCpf(c: string): boolean {
  if (/^(\d)\1{10}$/.test(c)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(c[i]) * (10 - i);
  let d1 = (s * 10) % 11;
  if (d1 === 10) d1 = 0;
  if (d1 !== parseInt(c[9])) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(c[i]) * (11 - i);
  let d2 = (s * 10) % 11;
  if (d2 === 10) d2 = 0;
  return d2 === parseInt(c[10]);
}

export function formatCpfOrMatricula(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length === 11) {
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return d;
}

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  errors: string[];
};

export function evaluatePassword(v: string): PasswordStrength {
  const errors: string[] = [];
  if (v.length < 8) errors.push("Mínimo de 8 caracteres");
  if (!/[A-Z]/.test(v)) errors.push("Uma letra maiúscula");
  if (!/[a-z]/.test(v)) errors.push("Uma letra minúscula");
  if (!/\d/.test(v)) errors.push("Um número");
  if (!/[^A-Za-z0-9]/.test(v)) errors.push("Um caractere especial");

  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) score++;

  const map = [
    { label: "Muito fraca", color: "#ef4444" },
    { label: "Fraca", color: "#f97316" },
    { label: "Razoável", color: "#eab308" },
    { label: "Forte", color: "#22c55e" },
    { label: "Excelente", color: "#16a34a" },
  ] as const;
  return { score: score as 0 | 1 | 2 | 3 | 4, ...map[score], errors };
}

export function validatePasswordLogin(v: string): string | null {
  if (!v) return "Informe sua senha.";
  if (v.length < 6) return "Senha muito curta.";
  return null;
}

export function validatePasswordSignup(v: string): string | null {
  if (!v) return "Crie uma senha.";
  const r = evaluatePassword(v);
  if (r.score < 2) return "Senha fraca — " + r.errors.join(", ").toLowerCase() + ".";
  return null;
}

export function validateNome(v: string): string | null {
  if (!v.trim()) return "Informe seu nome completo.";
  if (v.trim().length < 3) return "Nome muito curto.";
  if (!v.trim().includes(" ")) return "Informe nome e sobrenome.";
  return null;
}
