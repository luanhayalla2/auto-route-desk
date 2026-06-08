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
import { Eye, EyeOff, ShieldCheck, Zap, BarChart3, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — SmartDesk SENAC-MA" }] }),
  component: AuthPage,
});

const SENAC_BLUE = "#003a70";
const SENAC_BLUE_DARK = "#002a55";
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Brand side */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${SENAC_BLUE} 0%, ${SENAC_BLUE_DARK} 60%, #001a35 100%)`,
        }}
      >
        {/* decorative shapes */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: SENAC_ORANGE }}
        />
        <div
          className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] rounded-full opacity-10 blur-3xl"
          style={{ background: "#4da3ff" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <img src={senacLogo} alt="SENAC" className="h-8" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-white/70">SENAC-MA</div>
            <div className="font-semibold">SmartDesk</div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            Service Desk corporativo,{" "}
            <span style={{ color: SENAC_ORANGE }}>simples e ágil</span>.
          </h2>
          <p className="text-white/80 text-lg">
            Abra chamados, acompanhe SLAs em tempo real e gerencie o atendimento de TI de todas as unidades em um só lugar.
          </p>

          <div className="space-y-3 pt-4">
            <Feature icon={<Zap size={18} />} text="Abertura de chamados em poucos cliques" />
            <Feature icon={<BarChart3 size={18} />} text="Dashboards e SLA em tempo real" />
            <Feature icon={<ShieldCheck size={18} />} text="Acesso seguro com perfis e auditoria" />
          </div>
        </div>

        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} SENAC Maranhão · Todos os direitos reservados
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-md">
          {/* mobile brand */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <img src={senacLogo} alt="SENAC" className="w-32 mb-3" />
            <h1 className="text-2xl font-bold" style={{ color: SENAC_BLUE }}>
              SmartDesk SENAC-MA
            </h1>
            <p className="text-sm text-muted-foreground">Service Desk Corporativo</p>
          </div>

          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold" style={{ color: SENAC_BLUE }}>
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse com suas credenciais institucionais
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/70 p-7">
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 mb-5 w-full bg-slate-100">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
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
              <span>ou continue com</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full h-11 border-slate-300 hover:bg-slate-50 gap-2"
              onClick={async () => {
                const r = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin + "/portal",
                });
                if (r.error) toast.error("Falha ao entrar com Google");
              }}
            >
              <GoogleIcon /> Continuar com Google
            </Button>
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

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(245,130,32,0.18)", color: SENAC_ORANGE }}
      >
        {icon}
      </div>
      <span className="text-white/90">{text}</span>
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
        className="pr-10 h-11"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
        tabIndex={-1}
        aria-label={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
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
        <Label>E-mail institucional</Label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" placeholder="seu.nome@ma.senac.br" />
      </div>
      <div className="space-y-1.5">
        <Label>Senha</Label>
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-medium shadow-md transition-all"
        style={{ background: `linear-gradient(135deg, ${SENAC_BLUE}, ${SENAC_BLUE_DARK})` }}
      >
        {loading ? "Entrando..." : "Entrar"}
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
        <Label>Nome completo</Label>
        <Input required value={nome} onChange={(e) => setNome(e.target.value)} className="h-11" />
      </div>
      <div className="space-y-1.5">
        <Label>E-mail institucional</Label>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Matrícula/CPF</Label>
          <Input value={matricula} onChange={(e) => setMatricula(e.target.value)} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Setor</Label>
          <Input value={setor} onChange={(e) => setSetor(e.target.value)} className="h-11" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Senha</Label>
        <PasswordInput value={password} onChange={setPassword} />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-white font-medium shadow-md transition-all"
        style={{ background: `linear-gradient(135deg, ${SENAC_ORANGE}, ${SENAC_ORANGE_DARK})` }}
      >
        {loading ? "Criando..." : "Criar conta"}
      </Button>
      <p className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-2">
        💡 O primeiro cadastro do sistema vira <strong>administrador</strong> automaticamente.
      </p>
    </form>
  );
}
