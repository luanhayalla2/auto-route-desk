import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/chamados/novo")({
  head: () => ({ meta: [{ title: "Abrir chamado — SmartDesk SENAC-MA" }] }),
  component: NovoChamadoPage,
});

type Unidade = { id: string; nome: string; sigla: string };
type Categoria = { id: string; nome: string };
type Subcategoria = { id: string; nome: string; nivel_padrao: string; sla_horas: number; prioridade_padrao: string; categoria_id: string };

function NovoChamadoPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    unidade_id: "",
    categoria_id: "",
    subcategoria_id: "",
    titulo: "",
    descricao: "",
  });

  useEffect(() => {
    (async () => {
      const [{ data: u }, { data: c }, { data: s }, { data: auth }] = await Promise.all([
        supabase.from("unidades").select("id, nome, sigla").order("nome"),
        supabase.from("categorias").select("id, nome").order("nome"),
        supabase.from("subcategorias").select("id, nome, nivel_padrao, sla_horas, prioridade_padrao, categoria_id").order("nome"),
        supabase.auth.getUser(),
      ]);
      setUnidades(u ?? []);
      setCategorias(c ?? []);
      setSubcategorias(s ?? []);
      if (auth.user) {
        const { data: p } = await supabase.from("profiles").select("unidade_id").eq("id", auth.user.id).maybeSingle();
        if (p?.unidade_id) setForm((f) => ({ ...f, unidade_id: p.unidade_id! }));
      }
    })();
  }, []);

  const subFiltradas = useMemo(
    () => subcategorias.filter((s) => s.categoria_id === form.categoria_id),
    [subcategorias, form.categoria_id],
  );
  const subSelecionada = subcategorias.find((s) => s.id === form.subcategoria_id);

  const canNext = (() => {
    if (step === 1) return !!form.unidade_id;
    if (step === 2) return !!form.categoria_id && !!form.subcategoria_id;
    if (step === 3) return form.titulo.trim().length >= 6 && form.descricao.trim().length >= 20;
    return true;
  })();

  async function handleSubmit() {
    setSaving(true);
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast.error("Sessão expirada.");
      setSaving(false);
      return;
    }
    const { data, error } = await supabase
      .from("tickets")
      .insert({
        solicitante_id: auth.user.id,
        unidade_id: form.unidade_id,
        categoria_id: form.categoria_id,
        subcategoria_id: form.subcategoria_id,
        titulo: form.titulo,
        descricao: form.descricao,
      })
      .select("id, numero")
      .single();
    setSaving(false);
    if (error) {
      toast.error("Não foi possível abrir o chamado.", { description: error.message });
      return;
    }
    toast.success(`Chamado ${data.numero} aberto com sucesso!`);
    navigate({ to: "/chamados/$id", params: { id: data.id } });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#003a70]">Abrir novo chamado</h1>
        <p className="text-sm text-muted-foreground">Wizard guiado em 4 passos com classificação automática</p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex-1">
            <div className={`h-2 rounded-full ${step >= n ? "bg-[#f58220]" : "bg-muted"}`} />
            <p className={`mt-1 text-xs ${step >= n ? "text-[#003a70] font-semibold" : "text-muted-foreground"}`}>
              {["Unidade", "Categoria", "Descrição", "Revisão"][n - 1]}
            </p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Passo {step} de 4 — {["Selecione a unidade", "Categorize o chamado", "Descreva o problema", "Revisão e envio"][step - 1]}
          </CardTitle>
          <CardDescription>
            {step === 1 && "Em qual unidade SENAC-MA o atendimento será realizado?"}
            {step === 2 && "Escolha a categoria e o tipo do problema. Classificaremos o nível automaticamente."}
            {step === 3 && "Quanto mais detalhes, mais rápido o time de TI resolve."}
            {step === 4 && "Confirme os dados antes de enviar."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {unidades.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setForm({ ...form, unidade_id: u.id })}
                  className={`text-left rounded-lg border-2 p-4 transition-all ${
                    form.unidade_id === u.id ? "border-[#003a70] bg-[#003a70]/5" : "border-border hover:border-[#003a70]/40"
                  }`}
                >
                  <div className="font-semibold text-[#003a70]">{u.sigla}</div>
                  <div className="text-sm text-muted-foreground">{u.nome}</div>
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Categoria</Label>
                <Select value={form.categoria_id} onValueChange={(v) => setForm({ ...form, categoria_id: v, subcategoria_id: "" })}>
                  <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                  <SelectContent>
                    {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.categoria_id && (
                <div>
                  <Label>Tipo de problema</Label>
                  <Select value={form.subcategoria_id} onValueChange={(v) => setForm({ ...form, subcategoria_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                    <SelectContent>
                      {subFiltradas.map((s) => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {subSelecionada && (
                <div className="rounded-lg border bg-[#003a70]/5 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#003a70]">
                    <Sparkles className="h-4 w-4 text-[#f58220]" /> Classificação automática
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-[#003a70] text-white">Nível {subSelecionada.nivel_padrao}</Badge>
                    <Badge variant="outline">Prioridade: {subSelecionada.prioridade_padrao}</Badge>
                    <Badge variant="outline">SLA: {subSelecionada.sla_horas}h</Badge>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input
                  id="titulo"
                  placeholder="Ex.: Computador não liga na sala 12"
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  maxLength={120}
                />
                <p className="text-xs text-muted-foreground mt-1">{form.titulo.length}/120 — mínimo 6 caracteres</p>
              </div>
              <div>
                <Label htmlFor="desc">Descrição detalhada *</Label>
                <Textarea
                  id="desc"
                  rows={8}
                  placeholder="Descreva o problema, quando começou, o que já tentou e o impacto na sua rotina."
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">{form.descricao.length} caracteres — mínimo 20</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <Row label="Unidade" value={unidades.find((u) => u.id === form.unidade_id)?.nome ?? "—"} />
              <Row label="Categoria" value={categorias.find((c) => c.id === form.categoria_id)?.nome ?? "—"} />
              <Row label="Tipo" value={subSelecionada?.nome ?? "—"} />
              <Row label="Nível atribuído" value={subSelecionada ? `${subSelecionada.nivel_padrao} • SLA ${subSelecionada.sla_horas}h` : "—"} />
              <Row label="Título" value={form.titulo} />
              <div>
                <div className="text-xs uppercase text-muted-foreground mb-1">Descrição</div>
                <div className="rounded border p-3 whitespace-pre-wrap bg-muted/30">{form.descricao}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" disabled={step === 1 || saving} onClick={() => setStep((s) => s - 1)}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        {step < 4 ? (
          <Button disabled={!canNext} onClick={() => setStep((s) => s + 1)} className="bg-[#003a70] hover:bg-[#002a55]">
            Avançar <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button disabled={saving} onClick={handleSubmit} className="bg-[#f58220] hover:bg-[#d96f10] text-white">
            {saving ? "Enviando..." : <>Abrir chamado <ArrowRight className="h-4 w-4 ml-1" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b pb-2">
      <span className="text-xs uppercase text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
