import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "Portal — SmartDesk SENAC-MA" }] }),
  component: PortalPage,
});

function PortalPage() {
  const [profile, setProfile] = useState<{ nome: string; email: string } | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [counts, setCounts] = useState({ abertos: 0, andamento: 0, resolvidos: 0 });

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const [{ data: p }, { data: r }, { data: t }] = await Promise.all([
        supabase.from("profiles").select("nome, email").eq("id", u.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", u.user.id),
        supabase.from("tickets").select("status").eq("solicitante_id", u.user.id),
      ]);
      if (p) setProfile(p);
      setRoles((r ?? []).map((x: { role: string }) => x.role));
      const list = t ?? [];
      setCounts({
        abertos: list.filter((x: { status: string }) => x.status === "aberto").length,
        andamento: list.filter((x: { status: string }) => x.status === "em_andamento").length,
        resolvidos: list.filter((x: { status: string }) => ["resolvido", "fechado"].includes(x.status)).length,
      });
    })();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003a70]">Olá, {profile?.nome ?? "usuário"} 👋</h1>
        <div className="flex gap-2 mt-2">
          {roles.map((r) => (
            <Badge key={r} variant="secondary" className="bg-[#003a70]/10 text-[#003a70]">{r}</Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KPI title="Abertos" value={counts.abertos} color="#f58220" />
        <KPI title="Em andamento" value={counts.andamento} color="#003a70" />
        <KPI title="Resolvidos" value={counts.resolvidos} color="#16a34a" />
      </div>

      <Card>
        <CardHeader><CardTitle>Próximos passos</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>✅ Backend, autenticação e identidade visual prontos.</p>
          <p>🚧 Próxima fatia: wizard de abertura de chamado, lista, detalhe e pesquisa de satisfação.</p>
          <p>🚧 Depois: fila N1/N2/N3 com SLA em tempo real, dashboard e administração.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function KPI({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{title}</CardTitle></CardHeader>
      <CardContent><div className="text-3xl font-bold" style={{ color }}>{value}</div></CardContent>
    </Card>
  );
}
