import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import senacLogo from "@/assets/senac-logo.png";
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowLeft,
  Headphones,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  Mail,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import {
  validateEmail,
  validateCpfOrMatricula,
  validatePasswordLogin,
  validatePasswordSignup,
  validateNome,
  evaluatePassword,
  formatCpfOrMatricula,
} from "@/lib/validation";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — SmartDesk SENAC-MA" }] }),
  component: AuthPage,
});

const KEEP_KEY = "smartdesk.keepConnected";

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  return (
    <main className="min-h-dvh grid lg:grid-cols-[1.1fr_1fr] bg-slate-50">
      {/* Brand side */}
      <aside
        className="relative hidden lg:flex flex-col justify-between p-14 text-white overflow-hidden"
        aria-label="Apresentação SmartDesk SENAC-MA"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, var(--senac-blue-light) 0%, transparent 45%), radial-gradient(circle at 80% 80%, var(--senac-orange) 0%, transparent 35%), linear-gradient(135deg, var(--senac-blue) 0%, var(--senac-blue-dark) 70%, #00132a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "var(--senac-orange)" }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl bg-[#4da3ff]"
        />
        <div
          className="absolute top-0 right-0 w-1.5 h-full"
          style={{
            background:
              "linear-gradient(180deg, transparent, var(--senac-orange) 50%, transparent)",
          }}
        />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2.5 shadow-2xl ring-1 ring-white/20">
              <img src={senacLogo} alt="SENAC" className="h-9" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/70 font-semibold">
                SENAC Maranhão
              </div>
              <div className="font-bold text-lg leading-tight">SmartDesk</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistema online
          </div>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 backdrop-blur-sm"
            style={{ background: "rgba(245,130,32,0.18)", color: "#ffd9b3" }}
          >
            <Sparkles size={13} /> Service Desk Corporativo · Versão 2026
          </div>
          <h2 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight">
            Atendimento de TI <br />
            <span style={{ color: "var(--senac-orange)" }}>
              inteligente e ágil
            </span>{" "}
            <br />
            para todo o SENAC-MA.
          </h2>
          <p className="text-white/85 text-lg leading-relaxed">
            Abra chamados, acompanhe SLAs em tempo real e centralize o suporte
            das unidades em uma plataforma única e segura.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <FeatureCard icon={<Zap size={16} />} title="Resposta rápida" desc="Triagem automática N1/N2/N3" />
            <FeatureCard icon={<BarChart3 size={16} />} title="SLA visível" desc="Indicadores em tempo real" />
            <FeatureCard icon={<ShieldCheck size={16} />} title="Acesso seguro" desc="Perfis e auditoria total" />
            <FeatureCard icon={<Headphones size={16} />} title="Suporte 24/7" desc="Equipe técnica dedicada" />
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-white/10">
            <Stat icon={<Users size={14} />} value="5" label="Unidades" />
            <Stat icon={<Clock size={14} />} value="< 4h" label="SLA médio" />
            <Stat icon={<CheckCircle2 size={14} />} value="98%" label="Satisfação" />
          </div>
          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} SENAC Maranhão · Todos os direitos reservados
          </div>
        </div>
      </aside>

      {/* Form side */}
      <section className="flex items-center justify-center px-4 py-10 sm:py-16 relative">
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,58,112,0.08) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="w-full max-w-md relative z-10">
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="bg-white rounded-xl p-3 shadow-lg border border-slate-200 mb-3">
              <img src={senacLogo} alt="SENAC" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--senac-blue)]">
              SmartDesk SENAC-MA
            </h1>
            <p className="text-sm text-muted-foreground">Service Desk Corporativo</p>
          </div>

          <div className="hidden lg:block mb-8">
            <div
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3"
              style={{ background: "rgba(0,58,112,0.08)", color: "var(--senac-blue)" }}
            >
              <ShieldCheck size={12} /> Acesso seguro
            </div>
            <h1 className="text-[2rem] font-bold tracking-tight text-[var(--senac-blue)]">
              Bem-vindo de volta
            </h1>
            <p className="text-base text-muted-foreground mt-1.5">
              Entre com sua conta institucional para continuar
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,58,112,0.25)] border border-slate-200/70 p-7">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-6 w-full bg-slate-100/80 p-1 h-11">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--senac-blue)] font-medium"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[var(--senac-blue)] font-medium"
                >
                  Cadastrar
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm onSuccess={() => navigate({ to: "/portal" })} />
              </TabsContent>
              <TabsContent value="signup">
                <SignupForm onSuccess={() => navigate({ to: "/portal" })} />
              </TabsContent>
            </Tabs>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px bg-border flex-1" />
              <span className="uppercase tracking-wider font-medium">ou continue com</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border-slate-300 hover:bg-slate-50 hover:border-slate-400 gap-2.5 font-medium transition-all"
              onClick={async () => {
                const r = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin + "/portal",
                });
                if (r.error) toast.error("Falha ao entrar com Google");
              }}
            >
              <GoogleIcon /> Continuar com Google
            </Button>

            <p className="text-[11px] text-center text-muted-foreground mt-5 leading-relaxed">
              Ao continuar você concorda com os termos de uso e a{" "}
              <span className="underline cursor-pointer hover:text-foreground">
                política de privacidade
              </span>{" "}
              do SENAC-MA.
            </p>
          </div>

          <p className="text-center mt-6 text-xs text-muted-foreground">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground hover:underline">
              <ArrowLeft size={12} /> Voltar à página inicial
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

/* ---------------- subcomponents ---------------- */

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
        style={{ background: "rgba(245,130,32,0.18)", color: "var(--senac-orange)" }}
      >
        {icon}
      </div>
      <div className="font-semibold text-sm text-white">{title}</div>
      <div className="text-xs text-white/70 mt-0.5">{desc}</div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wider font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold" style={{ color: "var(--senac-orange)" }}>
        {value}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.52 1 10.21 1 12s.43 3.48 1.18 4.96l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
    </svg>
  );
}

function FieldError({ id, msg }: { id: string; msg: string | null }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-xs text-red-600 mt-1">
      <AlertCircle size={13} className="shrink-0 mt-0.5" /> {msg}
    </p>
  );
}

function PasswordField({
  id,
  value,
  onChange,
  onBlur,
  error,
  autoComplete,
  label,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error: string | null;
  autoComplete: string;
  label: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-700">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`h-11 pr-10 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
            error ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          autoComplete={autoComplete}
          placeholder="••••••••"
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
      <FieldError id={`${id}-error`} msg={error} />
    </div>
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keep, setKeep] = useState(true);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [forgotOpen, setForgotOpen] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(KEEP_KEY);
    if (v !== null) setKeep(v === "1");
  }, []);

  const emailErr = touched.email ? validateEmail(email) : null;
  const passErr = touched.password ? validatePasswordLogin(password) : null;
  const canSubmit = !validateEmail(email) && !validatePasswordLogin(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!canSubmit) return;
    setLoading(true);
    localStorage.setItem(KEEP_KEY, keep ? "1" : "0");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("invalid")) {
        toast.error("E-mail ou senha incorretos.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    if (!keep) {
      // Encerra a sessão ao fechar a aba/navegador
      window.addEventListener("beforeunload", () => supabase.auth.signOut());
    }
    toast.success("Bem-vindo ao SmartDesk!");
    onSuccess();
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="login-email" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            E-mail institucional
          </Label>
          <Input
            id="login-email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            placeholder="seu.nome@ma.senac.br"
            autoComplete="username"
            required
            aria-invalid={!!emailErr}
            aria-describedby={emailErr ? "login-email-error" : undefined}
            className={`h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
              emailErr ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500" : ""
            }`}
          />
          <FieldError id="login-email-error" msg={emailErr} />
        </div>

        <PasswordField
          id="login-pass"
          label="Senha"
          value={password}
          onChange={setPassword}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passErr}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between pt-1">
          <label htmlFor="keep" className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
            <Checkbox
              id="keep"
              checked={keep}
              onCheckedChange={(c) => setKeep(c === true)}
              className="data-[state=checked]:bg-[var(--senac-blue)] data-[state=checked]:border-[var(--senac-blue)]"
            />
            Manter-me conectado
          </label>
          <button
            type="button"
            onClick={() => setForgotOpen(true)}
            className="text-xs font-semibold text-[var(--senac-blue)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--senac-blue)] rounded px-1"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
          style={{ background: "linear-gradient(135deg, var(--senac-blue), var(--senac-blue-light))" }}
        >
          {loading ? "Entrando..." : "Entrar no SmartDesk"}
        </Button>
      </form>

      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} initialEmail={email} />
    </>
  );
}

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errs = {
    nome: touched.nome ? validateNome(nome) : null,
    email: touched.email ? validateEmail(email) : null,
    matricula: touched.matricula ? validateCpfOrMatricula(matricula) : null,
    password: touched.password ? validatePasswordSignup(password) : null,
  };
  const canSubmit =
    !validateNome(nome) &&
    !validateEmail(email) &&
    !validateCpfOrMatricula(matricula) &&
    !validatePasswordSignup(password);

  const strength = useMemo(() => evaluatePassword(password), [password]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched({ nome: true, email: true, matricula: true, password: true, setor: true });
    if (!canSubmit) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/portal",
        data: { nome, matricula, setor },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Conta criada! Bem-vindo ao SmartDesk SENAC-MA.");
    onSuccess();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="su-nome" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Nome completo
        </Label>
        <Input
          id="su-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
          placeholder="Maria Silva"
          autoComplete="name"
          aria-invalid={!!errs.nome}
          aria-describedby={errs.nome ? "su-nome-error" : undefined}
          className={`h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
            errs.nome ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500" : ""
          }`}
        />
        <FieldError id="su-nome-error" msg={errs.nome} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="su-email" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          E-mail institucional
        </Label>
        <Input
          id="su-email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          placeholder="seu.nome@ma.senac.br"
          autoComplete="email"
          aria-invalid={!!errs.email}
          aria-describedby={errs.email ? "su-email-error" : undefined}
          className={`h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
            errs.email ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500" : ""
          }`}
        />
        <FieldError id="su-email-error" msg={errs.email} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="su-mat" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Matrícula / CPF
          </Label>
          <Input
            id="su-mat"
            value={matricula}
            onChange={(e) => setMatricula(formatCpfOrMatricula(e.target.value))}
            onBlur={() => setTouched((t) => ({ ...t, matricula: true }))}
            placeholder="000.000.000-00"
            inputMode="numeric"
            aria-invalid={!!errs.matricula}
            aria-describedby={errs.matricula ? "su-mat-error" : undefined}
            className={`h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
              errs.matricula ? "border-red-400 focus-visible:ring-red-200 focus-visible:border-red-500" : ""
            }`}
          />
          <FieldError id="su-mat-error" msg={errs.matricula} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="su-setor" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Setor
          </Label>
          <Input
            id="su-setor"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            placeholder="TI / RH / ..."
            autoComplete="organization-title"
            className="h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)]"
          />
        </div>
      </div>

      <PasswordField
        id="su-pass"
        label="Senha"
        value={password}
        onChange={setPassword}
        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
        error={errs.password}
        autoComplete="new-password"
      />

      {password && (
        <div className="space-y-1.5 -mt-1">
          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden" aria-hidden>
            <div
              className="h-full transition-all"
              style={{ width: `${(strength.score / 4) * 100}%`, background: strength.color }}
            />
          </div>
          <div className="text-xs flex items-center justify-between" aria-live="polite">
            <span className="font-semibold" style={{ color: strength.color }}>
              {strength.label}
            </span>
            {strength.errors.length > 0 ? (
              <span className="text-muted-foreground text-right">
                Falta: {strength.errors.join(", ").toLowerCase()}
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">✓ Senha atende aos requisitos</span>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:hover:translate-y-0"
        style={{ background: "linear-gradient(135deg, var(--senac-orange), var(--senac-orange-dark))" }}
      >
        {loading ? "Criando conta..." : "Criar minha conta"}
      </Button>

      <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <Sparkles size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <span>
          O <strong>primeiro cadastro</strong> do sistema vira{" "}
          <strong>administrador</strong> automaticamente.
        </span>
      </div>
    </form>
  );
}

function ForgotPasswordDialog({
  open,
  onOpenChange,
  initialEmail,
}: {
  open: boolean;
  onOpenChange: (b: boolean) => void;
  initialEmail: string;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setEmail(initialEmail);
      setStep(1);
      setErr(null);
    }
  }, [open, initialEmail]);

  async function send() {
    const v = validateEmail(email);
    if (v) {
      setErr(v);
      return;
    }
    setErr(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStep(2);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-2"
            style={{ background: "rgba(0,58,112,0.08)", color: "var(--senac-blue)" }}
            aria-hidden
          >
            <KeyRound size={20} />
          </div>
          <DialogTitle className="text-xl text-[var(--senac-blue)]">
            {step === 1 ? "Recuperar acesso" : "Verifique seu e-mail"}
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            {step === 1
              ? "Informe seu e-mail institucional SENAC. Enviaremos um link seguro para você criar uma nova senha."
              : "Acabamos de enviar instruções para sua caixa de entrada. Siga o link para definir uma nova senha."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                E-mail institucional
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErr(null);
                }}
                placeholder="seu.nome@ma.senac.br"
                className={`h-11 border-slate-300 focus-visible:ring-[var(--senac-blue)]/30 focus-visible:border-[var(--senac-blue)] ${
                  err ? "border-red-400" : ""
                }`}
                aria-invalid={!!err}
                aria-describedby={err ? "forgot-email-error" : undefined}
                autoFocus
              />
              <FieldError id="forgot-email-error" msg={err} />
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1.5">
              <p className="flex items-start gap-1.5">
                <ShieldCheck size={13} className="shrink-0 mt-0.5 text-[var(--senac-blue)]" />
                O link é válido por 1 hora e funciona apenas no seu navegador.
              </p>
              <p className="flex items-start gap-1.5">
                <Mail size={13} className="shrink-0 mt-0.5 text-[var(--senac-blue)]" />
                Verifique também a pasta de spam ou filtros corporativos.
              </p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300">
                Cancelar
              </Button>
              <Button
                onClick={send}
                disabled={loading}
                className="text-white font-semibold"
                style={{ background: "linear-gradient(135deg, var(--senac-blue), var(--senac-blue-light))" }}
              >
                {loading ? "Enviando..." : "Enviar link de redefinição"}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-900 flex gap-3">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-emerald-600" />
              <div>
                Link enviado para <strong>{email}</strong>. Confira sua caixa de entrada nos próximos minutos.
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Se não receber em até 5 minutos, verifique o spam.</p>
              <p>• Em caso de dúvidas, contate a TI do SENAC-MA pelo ramal 0800.</p>
            </div>
            <DialogFooter className="gap-2 sm:gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="border-slate-300">
                Reenviar
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="text-white font-semibold"
                style={{ background: "linear-gradient(135deg, var(--senac-blue), var(--senac-blue-light))" }}
              >
                Entendi
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
