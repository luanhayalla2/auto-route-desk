import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/fila")({
  head: () => ({ meta: [{ title: "Fila N1/N2/N3 — SmartDesk SENAC-MA" }] }),
  component: FilaPage,
});

type T = {
  id: string; numero: string | null; titulo: string; nivel: "N1" | "N2" | "N3";
  status: string; prioridade: string; due_at: string | null; created_at: string;
};

function FilaPage() {
  const [tickets, setTickets] = useState<T[]>([]);
  const [updated, setUpdated] = useState(new Date());

  const carregar = useCallback(async () => {
    const { data } = await supabase
      .from("tickets")
      .select("id, numero, titulo, nivel, status, prioridade, due_at, created_at")
      .in("status", ["aberto", "em_andamento", "reaberto"])
      .order("due_at", { ascending: true, nullsFirst: false });
    setTickets((data as T[]) ?? []);
    setUpdated(new Date());
  }, []);

  useEffect(() => {
    carregar();
    const id = setInterval(carregar, 30_000);
    return () => clearInterval(id);
  }, [carregar]);

  const colunas: { nivel: T["nivel"]; titulo: string; cor: string }[] = [
    { nivel: "N1", titulo: "N1 — Atendimento", cor: "#003a70" },
    { nivel: "N2", titulo: "N2 — Avançado", cor: "#f58220" },
    { nivel: "N3", titulo: "N3 — Especialista", cor: "#7c3aed" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#003a70]">Fila de atendimento</h1>
          <p className="text-sm text-muted-foreground">
            Auto-refresh 30s • atualizado {formatDistanceToNow(updated, { locale: ptBR, addSuffix: true })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={carregar}><RefreshCw className="h-4 w-4 mr-2" />Atualizar</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {colunas.map((col) => {
          const items = tickets.filter((t) => t.nivel === col.nivel);
          return (
            <div key={col.nivel} className="space-y-3">
              <Card style={{ borderTopWidth: 4, borderTopColor: col.cor }}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span style={{ color: col.cor }}>{col.titulo}</span>
                    <Badge variant="outline">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
              </Card>
              {items.length === 0 ? (
                <Card><CardContent className="py-8 text-center text-xs text-muted-foreground">Fila vazia ✨</CardContent></Card>
              ) : items.map((t) => {
                const venceu = t.due_at && new Date(t.due_at) < new Date();
                return (
                  <Link key={t.id} to="/chamados/$id" params={{ id: t.id }}>
                    <Card className={`hover:shadow-md transition-all cursor-pointer ${venceu ? "border-red-400" : ""}`}>
                      <CardContent className="p-3 space-y-2">
                        <div className="text-xs font-mono text-muted-foreground">{t.numero}</div>
                        <div className="font-medium text-sm line-clamp-2">{t.titulo}</div>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs capitalize">{t.prioridade}</Badge>
                          <Badge variant="outline" className="text-xs capitalize">{t.status.replace(/_/g, " ")}</Badge>
                        </div>
                        {t.due_at && (
                          <div className={`text-xs flex items-center gap-1 ${venceu ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                            {venceu ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                            SLA {venceu ? "vencido" : "vence"} {formatDistanceToNow(new Date(t.due_at), { locale: ptBR, addSuffix: true })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
