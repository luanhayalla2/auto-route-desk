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
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — SmartDesk SENAC-MA" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/portal" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img src={senacLogo} alt="SENAC" className="w-40 mb-3" />
          <h1 className="text-2xl font-bold text-[#003a70]">SmartDesk SENAC-MA</h1>
          <p className="text-sm text-muted-foreground">Service Desk Corporativo</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <Tabs defaultValue="login">
            <TabsList className="grid grid-cols-2 mb-4 w-full">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="login"><LoginForm onSuccess={() => navigate({ to: "/portal" })} /></TabsContent>
            <TabsContent value="signup"><SignupForm onSuccess={() => navigate({ to: "/portal" })} /></TabsContent>
          </Tabs>

          <div className="my-4 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> ou <div className="h-px bg-border flex-1" />
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/portal" });
              if (r.error) toast.error("Falha ao entrar com Google");
            }}
          >
            Continuar com Google
          </Button>
        </div>

        <p className="text-center mt-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">← Voltar à página inicial</Link>
        </p>
      </div>
    </div>
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
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        tabIndex={-1}
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
      className="space-y-3"
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
      <div><Label>E-mail institucional</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div><Label>Senha</Label><PasswordInput value={password} onChange={setPassword} /></div>
      <Button type="submit" disabled={loading} className="w-full bg-[#003a70] hover:bg-[#002a55]">
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
      className="space-y-3"
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
      <div><Label>Nome completo</Label><Input required value={nome} onChange={(e) => setNome(e.target.value)} /></div>
      <div><Label>E-mail institucional</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Matrícula/CPF</Label><Input value={matricula} onChange={(e) => setMatricula(e.target.value)} /></div>
        <div><Label>Setor</Label><Input value={setor} onChange={(e) => setSetor(e.target.value)} /></div>
      </div>
      <div><Label>Senha</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
      <Button type="submit" disabled={loading} className="w-full bg-[#f58220] hover:bg-[#d96f10]">
        {loading ? "Criando..." : "Criar conta"}
      </Button>
      <p className="text-xs text-muted-foreground">O primeiro cadastro do sistema vira administrador automaticamente.</p>
    </form>
  );
}
