import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Clock, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/chamados/")({
  head: () => ({ meta: [{ title: "Meus chamados — SmartDesk SENAC-MA" }] }),
  component: ChamadosListaPage,
});

type Ticket = {
  id: string; numero: string | null; titulo: string; status: string; nivel: string;
  prioridade: string; created_at: string; due_at: string | null; updated_at: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  aberto: { label: "Aberto", color: "bg-blue-100 text-blue-700" },
  em_andamento: { label: "Em andamento", color: "bg-amber-100 text-amber-700" },
  aguardando_validacao: { label: "Aguardando você", color: "bg-purple-100 text-purple-700" },
  resolvido: { label: "Resolvido", color: "bg-emerald-100 text-emerald-700" },
  reaberto: { label: "Reaberto", color: "bg-orange-100 text-orange-700" },
  fechado: { label: "Fechado", color: "bg-gray-100 text-gray-700" },
};

function ChamadosListaPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroNivel, setFiltroNivel] = useState<string>("todos");
  const [busca, setBusca] = useState("");

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;
      const { data } = await supabase
        .from("tickets")
        .select("id, numero, titulo, status, nivel, prioridade, created_at, due_at, updated_at")
        .eq("solicitante_id", auth.user.id)
        .order("created_at", { ascending: false });
      setTickets(data ?? []);
      setLoading(false);
    })();
  }, []);

  const filtrados = tickets.filter((t) => {
    if (filtroStatus !== "todos" && t.status !== filtroStatus) return false;
    if (filtroNivel !== "todos" && t.nivel !== filtroNivel) return false;
    if (busca && !`${t.numero} ${t.titulo}`.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#003a70]">Meus chamados</h1>
          <p className="text-sm text-muted-foreground">{tickets.length} chamado(s) abertos por você</p>
        </div>
        <Link to="/chamados/novo">
          <Button className="bg-[#f58220] hover:bg-[#d96f10] text-white"><PlusCircle className="h-4 w-4 mr-2" />Novo chamado</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar por número ou título..." value={busca} onChange={(e) => setBusca(e.target.value)} />
        </div>
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filtroNivel} onValueChange={setFiltroNivel}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos níveis</SelectItem>
            <SelectItem value="N1">N1</SelectItem>
            <SelectItem value="N2">N2</SelectItem>
            <SelectItem value="N3">N3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : filtrados.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">
          Nenhum chamado encontrado. <Link to="/chamados/novo" className="text-[#003a70] underline">Abrir o primeiro</Link>.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {filtrados.map((t) => {
            const status = STATUS_LABELS[t.status] ?? { label: t.status, color: "bg-gray-100" };
            const venceu = t.due_at && new Date(t.due_at) < new Date() && !["resolvido", "fechado"].includes(t.status);
            return (
              <Link key={t.id} to="/chamados/$id" params={{ id: t.id }}>
                <Card className="hover:border-[#003a70] transition-colors cursor-pointer">
                  <CardContent className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="font-mono">{t.numero}</span>
                        <span>•</span>
                        <span>{formatDistanceToNow(new Date(t.created_at), { locale: ptBR, addSuffix: true })}</span>
                      </div>
                      <h3 className="font-semibold text-[#003a70] truncate">{t.titulo}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className={status.color + " border-0"}>{status.label}</Badge>
                        <Badge variant="outline">{t.nivel}</Badge>
                        <Badge variant="outline" className="capitalize">{t.prioridade}</Badge>
                        {venceu && <Badge className="bg-red-100 text-red-700 border-0"><AlertTriangle className="h-3 w-3 mr-1" />SLA vencido</Badge>}
                      </div>
                    </div>
                    {t.due_at && !["resolvido", "fechado"].includes(t.status) && (
                      <div className="text-right text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" />SLA</div>
                        <div className={venceu ? "text-red-600 font-bold" : ""}>
                          {formatDistanceToNow(new Date(t.due_at), { locale: ptBR, addSuffix: true })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
