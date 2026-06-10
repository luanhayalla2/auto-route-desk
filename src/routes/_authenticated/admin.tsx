import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ShieldCheck, ShieldOff, Users, Tags, Building2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Administração — SmartDesk SENAC-MA" }] }),
  component: AdminPage,
});

const ROLES = ["admin", "gestor", "tecnico_n1", "tecnico_n2", "tecnico_n3", "solicitante"] as const;

function AdminPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcats, setSubcats] = useState<any[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);

  const carregar = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    setUserId(auth.user.id);
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", auth.user.id);
    const admin = (r ?? []).some((x: any) => x.role === "admin");
    setIsAdmin(admin);
    if (!admin) return;
    const [{ data: p }, { data: ur }, { data: c }, { data: s }, { data: u }] = await Promise.all([
      supabase.from("profiles").select("id, nome, email, setor"),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("categorias").select("*").order("nome"),
      supabase.from("subcategorias").select("*, categorias(nome)").order("nome"),
      supabase.from("unidades").select("*").order("nome"),
    ]);
    const rolesByUser = new Map<string, string[]>();
    (ur ?? []).forEach((x: any) => {
      const arr = rolesByUser.get(x.user_id) ?? [];
      arr.push(x.role);
      rolesByUser.set(x.user_id, arr);
    });
    setUsuarios((p ?? []).map((u: any) => ({ ...u, roles: rolesByUser.get(u.id) ?? [] })));
    setCategorias(c ?? []);
    setSubcats(s ?? []);
    setUnidades(u ?? []);
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function setRole(uid: string, role: string) {
    if (uid === userId && role !== "admin") {
      return toast.error("Você não pode remover seu próprio papel de admin por aqui.");
    }
    await supabase.from("user_roles").delete().eq("user_id", uid);
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: role as any });
    if (error) return toast.error("Falha", { description: error.message });
    toast.success("Papel atualizado");
    carregar();
  }

  if (isAdmin === null) return <p className="text-muted-foreground">Carregando...</p>;
  if (!isAdmin) {
    return (
      <Card className="max-w-lg mx-auto mt-12">
        <CardHeader>
          <ShieldOff className="h-10 w-10 text-red-500 mb-2" />
          <CardTitle>Acesso restrito</CardTitle>
          <CardDescription>Esta área é exclusiva para administradores do SmartDesk.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-[#003a70]" />
        <div>
          <h1 className="text-2xl font-bold text-[#003a70]">Administração</h1>
          <p className="text-sm text-muted-foreground">Gestão de papéis, catálogo de serviços e unidades</p>
        </div>
      </div>

      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios"><Users className="h-4 w-4 mr-2" />Usuários ({usuarios.length})</TabsTrigger>
          <TabsTrigger value="catalogo"><Tags className="h-4 w-4 mr-2" />Catálogo</TabsTrigger>
          <TabsTrigger value="unidades"><Building2 className="h-4 w-4 mr-2" />Unidades ({unidades.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-2 mt-4">
          {usuarios.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">{u.nome}</div>
                  <div className="text-xs text-muted-foreground">{u.email} {u.setor && `• ${u.setor}`}</div>
                  <div className="flex gap-1 mt-1">
                    {u.roles.map((r: string) => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}
                  </div>
                </div>
                <Select onValueChange={(v) => setRole(u.id, v)}>
                  <SelectTrigger className="w-[200px]"><SelectValue placeholder="Alterar papel..." /></SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="catalogo" className="mt-4 space-y-4">
          {categorias.map((c) => {
            const subs = subcats.filter((s) => s.categoria_id === c.id);
            return (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-[#003a70]">{c.nome}</CardTitle>
                  {c.descricao && <CardDescription>{c.descricao}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {subs.map((s) => (
                      <div key={s.id} className="rounded border p-3 text-sm">
                        <div className="font-medium">{s.nome}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          <Badge className="bg-[#003a70] text-white text-xs">{s.nivel_padrao}</Badge>
                          <Badge variant="outline" className="text-xs capitalize">{s.prioridade_padrao}</Badge>
                          <Badge variant="outline" className="text-xs">SLA {s.sla_horas}h</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Edição completa do catálogo (criar/editar/remover) será adicionada na próxima iteração — por ora os dados são geridos pelo backend.
          </p>
        </TabsContent>

        <TabsContent value="unidades" className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {unidades.map((u) => (
            <Card key={u.id}>
              <CardContent className="p-4">
                <div className="font-bold text-[#003a70]">{u.sigla}</div>
                <div className="text-sm">{u.nome}</div>
                {u.cidade && <div className="text-xs text-muted-foreground">{u.cidade}</div>}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
