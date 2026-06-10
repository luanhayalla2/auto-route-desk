import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Clock, User, AlertCircle, CheckCircle2, RefreshCw, Star, ArrowUpRightFromSquare } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/_authenticated/chamados/$id")({
  head: () => ({ meta: [{ title: "Detalhes do chamado — SmartDesk SENAC-MA" }] }),
  component: ChamadoDetalhePage,
});

type Ticket = any;
type Hist = { id: string; acao: string; descricao: string | null; created_at: string; user_id: string | null };
type Aval = { nota_rapidez: number; nota_qualidade: number; nota_solucao: number; nota_cordialidade: number; nota_comunicacao: number; comentario: string | null };

const DIM = [
  { key: "nota_rapidez", label: "Rapidez no atendimento" },
  { key: "nota_qualidade", label: "Qualidade técnica" },
  { key: "nota_solucao", label: "Solução do problema" },
  { key: "nota_cordialidade", label: "Cordialidade" },
  { key: "nota_comunicacao", label: "Comunicação" },
] as const;

function ChamadoDetalhePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [historico, setHistorico] = useState<Hist[]>([]);
  const [avaliacao, setAvaliacao] = useState<Aval | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [escalarOpen, setEscalarOpen] = useState(false);
  const [escalarMotivo, setEscalarMotivo] = useState("");
  const [escalarNivel, setEscalarNivel] = useState<"N2" | "N3">("N2");
  const [avalOpen, setAvalOpen] = useState(false);
  const [avalForm, setAvalForm] = useState({ nota_rapidez: 5, nota_qualidade: 5, nota_solucao: 5, nota_cordialidade: 5, nota_comunicacao: 5, comentario: "" });

  const carregar = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    setUserId(auth.user.id);
    const [{ data: t }, { data: h }, { data: r }, { data: a }] = await Promise.all([
      supabase.from("tickets").select("*, unidades(nome), categorias(nome), subcategorias(nome), solicitante:profiles!tickets_solicitante_id_fkey(nome,email), atribuido:profiles!tickets_atribuido_id_fkey(nome,email)").eq("id", id).maybeSingle(),
      supabase.from("ticket_historico").select("*").eq("ticket_id", id).order("created_at"),
      supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
      supabase.from("ticket_avaliacoes").select("*").eq("ticket_id", id).maybeSingle(),
    ]);
    setTicket(t);
    setHistorico(h ?? []);
    setRoles((r ?? []).map((x: any) => x.role));
    setAvaliacao(a as Aval | null);
    setLoading(false);
  }, [id]);

  useEffect(() => { carregar(); }, [carregar]);

  if (loading) return <p className="text-muted-foreground">Carregando...</p>;
  if (!ticket) return <p>Chamado não encontrado. <Link to="/chamados" className="underline">Voltar</Link></p>;

  const isSolicitante = ticket.solicitante_id === userId;
  const isStaff = roles.some((r) => ["admin", "gestor", "tecnico_n1", "tecnico_n2", "tecnico_n3"].includes(r));
  const status = ticket.status;

  async function atualizarStatus(novoStatus: string, msg: string, extra: Record<string, any> = {}) {
    const { error } = await supabase.from("tickets").update({ status: novoStatus, ...extra }).eq("id", id);
    if (error) return toast.error("Falha", { description: error.message });
    toast.success(msg);
    carregar();
  }

  async function iniciar() {
    await supabase.from("tickets").update({ atribuido_id: userId }).eq("id", id);
    atualizarStatus("em_andamento", "Atendimento iniciado");
  }

  async function escalar() {
    if (!escalarMotivo.trim()) return toast.error("Informe o motivo do escalonamento");
    const { error } = await supabase.from("tickets").update({ nivel: escalarNivel, status: "aberto", atribuido_id: null }).eq("id", id);
    if (error) return toast.error("Falha", { description: error.message });
    await supabase.from("ticket_historico").insert({ ticket_id: id, user_id: userId, acao: "comentario", descricao: `Motivo do escalonamento: ${escalarMotivo}` });
    toast.success(`Escalonado para ${escalarNivel}`);
    setEscalarOpen(false);
    setEscalarMotivo("");
    carregar();
  }

  async function resolver() {
    atualizarStatus("aguardando_validacao", "Marcado como resolvido — aguardando validação do solicitante");
  }

  async function aceitarResolucao() {
    atualizarStatus("resolvido", "Resolução aceita. Avalie o atendimento!");
    setTimeout(() => setAvalOpen(true), 400);
  }

  async function reabrir() {
    atualizarStatus("reaberto", "Chamado reaberto");
  }

  async function enviarAvaliacao() {
    const { error } = await supabase.from("ticket_avaliacoes").insert({ ticket_id: id, user_id: userId!, ...avalForm });
    if (error) return toast.error("Falha", { description: error.message });
    await supabase.from("tickets").update({ status: "fechado" }).eq("id", id);
    toast.success("Obrigado pela avaliação!");
    setAvalOpen(false);
    carregar();
  }

  const slaVencido = ticket.due_at && new Date(ticket.due_at) < new Date() && !["resolvido", "fechado"].includes(status);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/chamados" })}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-muted-foreground">{ticket.numero}</div>
                  <CardTitle className="text-[#003a70]">{ticket.titulo}</CardTitle>
                  <CardDescription>
                    Aberto {formatDistanceToNow(new Date(ticket.created_at), { locale: ptBR, addSuffix: true })} por {ticket.solicitante?.nome ?? "—"}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge className="bg-[#003a70] text-white">{ticket.nivel}</Badge>
                  <Badge variant="outline" className="capitalize">{ticket.prioridade}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="whitespace-pre-wrap text-sm bg-muted/30 rounded p-4 border">{ticket.descricao}</div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>📍 {ticket.unidades?.nome}</span>
                <span>•</span>
                <span>🏷️ {ticket.categorias?.nome} / {ticket.subcategorias?.nome}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Linha do tempo</CardTitle></CardHeader>
            <CardContent>
              <ol className="relative border-l-2 border-[#003a70]/20 ml-2 space-y-4">
                {historico.map((h) => (
                  <li key={h.id} className="pl-4 -ml-[5px]">
                    <span className="absolute -ml-[11px] mt-1 h-3 w-3 rounded-full bg-[#f58220] border-2 border-white" />
                    <div className="text-xs text-muted-foreground">{format(new Date(h.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
                    <div className="font-medium text-sm capitalize">{h.acao.replace(/_/g, " ")}</div>
                    {h.descricao && <div className="text-sm text-muted-foreground">{h.descricao}</div>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Badge className="text-base px-3 py-1 capitalize">{status.replace(/_/g, " ")}</Badge>
              {ticket.due_at && (
                <div className={`text-sm flex items-center gap-1 ${slaVencido ? "text-red-600 font-bold" : ""}`}>
                  <Clock className="h-4 w-4" />
                  SLA {slaVencido ? "vencido" : "vence"} {formatDistanceToNow(new Date(ticket.due_at), { locale: ptBR, addSuffix: true })}
                </div>
              )}
              {ticket.atribuido && (
                <div className="text-sm flex items-center gap-1"><User className="h-4 w-4" /> {ticket.atribuido.nome}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Ações</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {isStaff && status === "aberto" && (
                <Button className="w-full bg-[#003a70] hover:bg-[#002a55]" onClick={iniciar}>Assumir & iniciar</Button>
              )}
              {isStaff && ["aberto", "em_andamento", "reaberto"].includes(status) && (
                <>
                  <Button variant="outline" className="w-full" onClick={() => setEscalarOpen(true)}>
                    <ArrowUpRightFromSquare className="h-4 w-4 mr-2" /> Escalonar
                  </Button>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={resolver}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Marcar resolvido
                  </Button>
                </>
              )}
              {isSolicitante && status === "aguardando_validacao" && (
                <>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={aceitarResolucao}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Aceitar resolução
                  </Button>
                  <Button variant="outline" className="w-full" onClick={reabrir}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Reabrir chamado
                  </Button>
                </>
              )}
              {isSolicitante && status === "resolvido" && !avaliacao && (
                <Button className="w-full bg-[#f58220] hover:bg-[#d96f10]" onClick={() => setAvalOpen(true)}>
                  <Star className="h-4 w-4 mr-2" /> Avaliar atendimento
                </Button>
              )}
              {avaliacao && (
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Avaliação registrada
                </div>
              )}
              {!isStaff && !isSolicitante && (
                <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Sem ações disponíveis</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={escalarOpen} onOpenChange={setEscalarOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalonar chamado</DialogTitle>
            <DialogDescription>Encaminhar para outro nível com justificativa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Encaminhar para</Label>
              <Select value={escalarNivel} onValueChange={(v) => setEscalarNivel(v as "N2" | "N3")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="N2">N2 — suporte avançado</SelectItem>
                  <SelectItem value="N3">N3 — especialista / engenharia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Motivo do escalonamento *</Label>
              <Textarea rows={4} value={escalarMotivo} onChange={(e) => setEscalarMotivo(e.target.value)} placeholder="Ex.: necessita acesso ao servidor..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEscalarOpen(false)}>Cancelar</Button>
            <Button onClick={escalar}>Escalonar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={avalOpen} onOpenChange={setAvalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pesquisa de satisfação</DialogTitle>
            <DialogDescription>Avalie em 5 dimensões — leva menos de 30 segundos.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {DIM.map((d) => (
              <div key={d.key}>
                <Label>{d.label}</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} type="button" onClick={() => setAvalForm({ ...avalForm, [d.key]: n })}>
                      <Star className={`h-7 w-7 ${avalForm[d.key] >= n ? "fill-[#f58220] text-[#f58220]" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <Label>Comentário (opcional)</Label>
              <Textarea rows={3} value={avalForm.comentario} onChange={(e) => setAvalForm({ ...avalForm, comentario: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAvalOpen(false)}>Depois</Button>
            <Button className="bg-[#f58220] hover:bg-[#d96f10]" onClick={enviarAvaliacao}>Enviar avaliação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
