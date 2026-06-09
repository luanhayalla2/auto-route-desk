import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — SmartDesk SENAC-MA" }] }),
  component: AuthPage,
});

const SENAC_BLUE = "#003a70";
const SENAC_BLUE_DARK = "#001f3f";
const SENAC_BLUE_LIGHT = "#0a5ca8";
const SENAC_ORANGE = "#f58220";
const SENAC_ORANGE_DARK = "#d96f10";

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-slate-50">
      {/* Brand side */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-14 text-white overflow-hidden"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${SENAC_BLUE_LIGHT} 0%, transparent 45%),
                       radial-gradient(circle at 80% 80%, ${SENAC_ORANGE} 0%, transparent 35%),
                       linear-gradient(135deg, ${SENAC_BLUE} 0%, ${SENAC_BLUE_DARK} 70%, #00132a 100%)`,
        }}
      >
        {/* Decorative dots */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow orbs */}
        <div
          className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
          style={{ background: SENAC_ORANGE }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl"
          style={{ background: "#4da3ff" }}
        />
        {/* Diagonal accent stripe */}
        <div
          className="absolute top-0 right-0 w-1.5 h-full"
          style={{
            background: `linear-gradient(180deg, transparent, ${SENAC_ORANGE} 50%, transparent)`,
          }}
        />

        {/* Header / brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2.5 shadow-2xl ring-1 ring-white/20">
              <img src={senacLogo} alt="SENAC" className="h-9" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold">
                SENAC Maranhão
              </div>
              <div className="font-bold text-lg leading-tight">SmartDesk</div>
            </div>
          </div>
          <div
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-sm bg-white/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Sistema online
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-white/15 backdrop-blur-sm"
            style={{ background: "rgba(245,130,32,0.15)", color: "#ffd9b3" }}
          >
            <Sparkles size={13} />
            Service Desk Corporativo · Versão 2026
          </div>

          <h2 className="text-[2.75rem] font-bold leading-[1.1] tracking-tight">
            Atendimento de TI <br />
            <span style={{ color: SENAC_ORANGE }}>inteligente e ágil</span> <br />
            para todo o SENAC-MA.
          </h2>

          <p className="text-white/75 text-lg leading-relaxed">
            Abra chamados, acompanhe SLAs em tempo real e centralize o suporte
            das unidades em uma plataforma única e segura.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <FeatureCard icon={<Zap size={16} />} title="Resposta rápida" desc="Triagem automática N1/N2/N3" />
            <FeatureCard icon={<BarChart3 size={16} />} title="SLA visível" desc="Indicadores em tempo real" />
            <FeatureCard icon={<ShieldCheck size={16} />} title="Acesso seguro" desc="Perfis e auditoria total" />
            <FeatureCard icon={<Headphones size={16} />} title="Suporte 24/7" desc="Equipe técnica dedicada" />
          </div>
        </div>

        {/* Footer stats */}
        <div className="relative z-10 space-y-4">
          <div className="grid grid-cols-3 gap-4 pb-4 border-b border-white/10">
            <Stat icon={<Users size={14} />} value="5" label="Unidades" />
            <Stat icon={<Clock size={14} />} value="< 4h" label="SLA médio" />
            <Stat icon={<CheckCircle2 size={14} />} value="98%" label="Satisfação" />
          </div>
          <div className="text-xs text-white/50">
            © {new Date().getFullYear()} SENAC Maranhão · Todos os direitos reservados
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10 sm:py-16 relative">
        {/* Subtle bg pattern on form side */}
        <div
          className="absolute inset-0 opacity-[0.4] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,58,112,0.08) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile brand */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="bg-white rounded-xl p-3 shadow-lg border border-slate-200 mb-3">
              <img src={senacLogo} alt="SENAC" className="h-10" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: SENAC_BLUE }}>
              SmartDesk SENAC-MA
            </h1>
            <p className="text-sm text-muted-foreground">Service Desk Corporativo</p>
          </div>

          {/* Desktop header */}
          <div className="hidden lg:block mb-8">
            <div
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md mb-3"
              style={{ background: "rgba(0,58,112,0.08)", color: SENAC_BLUE }}
            >
              <ShieldCheck size={12} /> Acesso seguro
            </div>
            <h1 className="text-[2rem] font-bold tracking-tight" style={{ color: SENAC_BLUE }}>
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Entre com sua conta institucional para continuar
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,58,112,0.25)] border border-slate-200/70 p-7 backdrop-blur-sm">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-6 w-full bg-slate-100/80 p-1 h-11">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003a70] font-medium"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#003a70] font-medium"
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
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="group p-3.5 rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] hover:border-white/20 transition-all">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform"
        style={{ background: "rgba(245,130,32,0.18)", color: SENAC_ORANGE }}
      >
        {icon}
      </div>
      <div className="font-semibold text-sm text-white">{title}</div>
      <div className="text-xs text-white/60 mt-0.5">{desc}</div>
    </div>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-white/50 text-[10px] uppercase tracking-wider font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold" style={{ color: SENAC_ORANGE }}>
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

function PasswordInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10 h-11 border-slate-300 focus-visible:ring-[#003a70]/30 focus-visible:border-[#003a70]"
        placeholder="••••••••"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#003a70] p-1 rounded transition-colors"
        tabIndex={-1}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Input
      {...props}
      className={`h-11 border-slate-300 focus-visible:ring-[#003a70]/30 focus-visible:border-[#003a70] ${props.className ?? ""}`}
    />
  );
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) return toast.error(error.message);
        toast.success("Bem-vindo!");
        onSuccess();
      }}
    >
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          E-mail institucional
        </Label>
        <FieldInput
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.nome@ma.senac.br"
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Senha
          </Label>
          <button
            type="button"
            className="text-xs text-[#003a70] hover:underline font-medium"
            onClick={() => toast.info("Contate o administrador de TI para recuperação de senha.")}
          >
            Esqueceu?
          </button>
        </div>
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, ${SENAC_BLUE} 0%, ${SENAC_BLUE_LIGHT} 100%)`,
        }}
      >
        {loading ? "Entrando..." : "Entrar no SmartDesk"}
      </Button>
    </form>
  );
}

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [matricula, setMatricula] = useState("");
  const [setor, setSetor] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
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
        toast.success("Conta criada! Você já pode entrar.");
        onSuccess();
      }}
    >
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Nome completo
        </Label>
        <FieldInput required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Maria Silva" />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          E-mail institucional
        </Label>
        <FieldInput
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu.nome@ma.senac.br"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Matrícula/CPF
          </Label>
          <FieldInput value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="000000" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Setor
          </Label>
          <FieldInput value={setor} onChange={(e) => setSetor(e.target.value)} placeholder="TI / RH / ..." />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Senha</Label>
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        style={{
          background: `linear-gradient(135deg, ${SENAC_ORANGE} 0%, ${SENAC_ORANGE_DARK} 100%)`,
        }}
      >
        {loading ? "Criando conta..." : "Criar minha conta"}
      </Button>
      <div className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <Sparkles size={14} className="shrink-0 mt-0.5 text-amber-600" />
        <span>
          O <strong>primeiro cadastro</strong> do sistema vira <strong>administrador</strong> automaticamente.
        </span>
      </div>
    </form>
  );
}
