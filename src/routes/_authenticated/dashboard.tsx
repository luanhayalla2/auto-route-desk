import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Ticket as TicketIcon, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SmartDesk SENAC-MA" }] }),
  component: DashboardPage,
});

const CORES = ["#003a70", "#f58220", "#7c3aed", "#16a34a", "#dc2626", "#0891b2"];

function DashboardPage() {
  const [data, setData] = useState<{
    total: number; abertos: number; resolvidos: number; vencidos: number;
    porNivel: any[]; porStatus: any[]; porUnidade: any[];
  } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ data: tickets }, { data: unidades }] = await Promise.all([
        supabase.from("tickets").select("status, nivel, unidade_id, due_at, resolved_at"),
        supabase.from("unidades").select("id, sigla"),
      ]);
      const list = tickets ?? [];
      const uMap = new Map((unidades ?? []).map((u: any) => [u.id, u.sigla]));
      const now = new Date();

      const count = (key: string, val: string) => list.filter((t: any) => t[key] === val).length;

      const porNivel = ["N1", "N2", "N3"].map((n) => ({ nivel: n, total: count("nivel", n) }));
      const porStatus = ["aberto", "em_andamento", "aguardando_validacao", "resolvido", "fechado", "reaberto"]
        .map((s) => ({ name: s.replace(/_/g, " "), value: count("status", s) }))
        .filter((x) => x.value > 0);
      const porUnidade = Array.from(uMap.entries()).map(([id, sigla]) => ({
        unidade: sigla, total: list.filter((t: any) => t.unidade_id === id).length,
      }));

      setData({
        total: list.length,
        abertos: list.filter((t: any) => ["aberto", "em_andamento", "reaberto"].includes(t.status)).length,
        resolvidos: list.filter((t: any) => ["resolvido", "fechado"].includes(t.status)).length,
        vencidos: list.filter((t: any) => t.due_at && new Date(t.due_at) < now && !["resolvido", "fechado"].includes(t.status)).length,
        porNivel, porStatus, porUnidade,
      });
    })();
  }, []);

  if (!data) return <p className="text-muted-foreground">Carregando...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003a70]">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão consolidada da operação de TI</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KPI icon={TicketIcon} title="Total" value={data.total} color="#003a70" />
        <KPI icon={Clock} title="Em aberto" value={data.abertos} color="#f58220" />
        <KPI icon={CheckCircle2} title="Resolvidos" value={data.resolvidos} color="#16a34a" />
        <KPI icon={AlertTriangle} title="SLA vencido" value={data.vencidos} color="#dc2626" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Por nível</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={data.porNivel}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nivel" /><YAxis allowDecimals={false} /><Tooltip />
                <Bar dataKey="total" fill="#003a70" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Por status</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={data.porStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                  {data.porStatus.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Por unidade</CardTitle></CardHeader>
          <CardContent style={{ height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={data.porUnidade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="unidade" /><YAxis allowDecimals={false} /><Tooltip />
                <Bar dataKey="total" fill="#f58220" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPI({ icon: Icon, title, value, color }: { icon: any; title: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, color }}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{title}</div>
          <div className="text-2xl font-bold" style={{ color }}>{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}
