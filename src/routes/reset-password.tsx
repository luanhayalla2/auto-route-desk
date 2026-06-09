import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import senacLogo from "@/assets/senac-logo.png";
import { Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { evaluatePassword, validatePasswordSignup } from "@/lib/validation";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Redefinir senha — SmartDesk SENAC-MA" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    // Supabase auto-trata o hash da URL para iniciar sessão de recovery.
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session && !window.location.hash.includes("type=recovery")) {
        toast.error("Link de redefinição inválido ou expirado.");
      }
      setReady(true);
    });
  }, []);

  const strength = evaluatePassword(password);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const v = validatePasswordSignup(password);
    if (v) return setErr(v);
    if (password !== confirm) return setErr("As senhas não coincidem.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha redefinida com sucesso! Bem-vindo de volta.");
    navigate({ to: "/portal" });
  }

  if (!ready) return null;

  return (
    <main className="min-h-dvh grid place-items-center bg-[var(--senac-bg)] px-4 py-10">
      <div
        className="absolute inset-0 -z-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,58,112,0.12) 1px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="w-full max-w-md relative">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-white rounded-xl p-3 shadow-md border border-slate-200 mb-3">
            <img src={senacLogo} alt="SENAC" className="h-10" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--senac-blue)]">Redefinir senha</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
            Crie uma nova senha forte para sua conta SENAC.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-white rounded-2xl shadow-xl border border-slate-200/70 p-7 space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="new-pass" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Nova senha
            </Label>
            <div className="relative">
              <Input
                id="new-pass"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 pr-10 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)]"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-[var(--senac-blue)] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--senac-blue)]"
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full transition-all"
                    style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
                  />
                </div>
                <div className="text-xs flex items-center justify-between">
                  <span className="font-semibold" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                  {strength.errors.length > 0 && (
                    <span className="text-muted-foreground">Falta: {strength.errors.join(", ").toLowerCase()}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm-pass" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Confirmar nova senha
            </Label>
            <Input
              id="confirm-pass"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)]"
              autoComplete="new-password"
              required
            />
          </div>

          {err && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2.5">
              {err}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg, var(--senac-blue), var(--senac-blue-light))",
            }}
          >
            <ShieldCheck size={16} /> {loading ? "Redefinindo..." : "Salvar nova senha"}
          </Button>
        </form>

        <p className="text-center mt-6 text-xs text-muted-foreground">
          <Link to="/auth" className="inline-flex items-center gap-1 hover:text-foreground hover:underline">
            <ArrowLeft size={12} /> Voltar para login
          </Link>
        </p>
      </div>
    </main>
  );
}
