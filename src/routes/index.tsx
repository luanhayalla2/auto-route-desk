import { createFileRoute, Link } from "@tanstack/react-router";
import senacLogo from "../assets/senac-logo.png";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Headphones,
  Clock,
  Users,
  CheckCircle2,
  Layers,
  Activity,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartDesk SENAC-MA — Service Desk corporativo" },
      {
        name: "description",
        content:
          "SmartDesk SENAC-MA: abertura de chamados, classificação automática N1/N2/N3 e monitoramento de SLA em tempo real para todas as unidades do SENAC Maranhão.",
      },
      { property: "og:title", content: "SmartDesk SENAC-MA" },
      {
        property: "og:description",
        content:
          "Service Desk corporativo do SENAC-MA — atendimento inteligente N1/N2/N3 com SLA e rastreabilidade.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-dvh bg-[var(--senac-bg)] text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-30 backdrop-blur bg-white/85 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="bg-white rounded-lg p-1.5 ring-1 ring-slate-200">
              <img src={senacLogo} alt="Logo SENAC" className="h-7" />
            </div>
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-[var(--senac-blue)]/70">
                SENAC Maranhão
              </div>
              <div className="font-bold text-[var(--senac-blue)]">SmartDesk</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#recursos" className="hover:text-[var(--senac-blue)] transition">Recursos</a>
            <a href="#fluxo" className="hover:text-[var(--senac-blue)] transition">Como funciona</a>
            <a href="#sla" className="hover:text-[var(--senac-blue)] transition">SLA</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="hidden sm:inline-flex items-center text-sm font-medium text-[var(--senac-blue)] hover:underline px-3 py-2"
            >
              Entrar
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--senac-blue)] to-[var(--senac-blue-light)] hover:shadow-lg hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--senac-blue)] focus-visible:ring-offset-2"
            >
              Acessar sistema <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(80% 60% at 20% 0%, rgba(0,58,112,0.12), transparent 60%), radial-gradient(60% 50% at 100% 20%, rgba(245,130,32,0.14), transparent 60%)",
          }}
        />
        <div
          className="absolute inset-0 -z-10 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(0,58,112,0.18) 1px, transparent 0)",
            backgroundSize: "26px 26px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-slate-200 shadow-sm text-[var(--senac-blue)]">
              <Sparkles size={13} className="text-[var(--senac-orange)]" />
              Service Desk Corporativo · Versão 2026
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--senac-blue)] leading-[1.05]">
              Atendimento de TI{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-[var(--senac-orange)]">
                  inteligente
                </span>
                <span className="absolute left-0 bottom-1 h-3 w-full bg-[var(--senac-orange)]/15 -z-0 rounded" />
              </span>{" "}
              para todo o SENAC-MA.
            </h1>

            <p className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed">
              Centralize chamados de todas as unidades, com classificação
              automática N1/N2/N3, SLA em tempo real e dashboards que mostram
              exatamente onde sua equipe precisa agir.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-br from-[var(--senac-blue)] to-[var(--senac-blue-light)] shadow-lg shadow-[var(--senac-blue)]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--senac-blue)] focus-visible:ring-offset-2"
              >
                Acessar o SmartDesk <ArrowRight size={17} />
              </Link>
              <a
                href="#recursos"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[var(--senac-blue)] bg-white border border-slate-200 hover:border-[var(--senac-blue)]/40 hover:bg-slate-50 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--senac-blue)] focus-visible:ring-offset-2"
              >
                Conhecer recursos
              </a>
            </div>

            {/* Trust strip */}
            <div className="mt-10 grid grid-cols-3 max-w-md gap-6">
              <Stat value="5" label="Unidades" />
              <Stat value="<4h" label="SLA médio" />
              <Stat value="98%" label="Satisfação" />
            </div>
          </div>

          {/* Hero card / mock */}
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-3xl blur-2xl opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, var(--senac-blue), var(--senac-orange))",
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 h-9 border-b bg-slate-50">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[11px] text-slate-500 font-mono">
                  smartdesk.senac.ma / fila
                </span>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                      Fila ativa
                    </div>
                    <div className="text-lg font-bold text-[var(--senac-blue)]">
                      Chamados em andamento
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Ao vivo
                  </span>
                </div>
                <MockTicket level="N1" code="CH-2026-001284" title="Impressora travada — Sala 12" sla={92} color="emerald" />
                <MockTicket level="N2" code="CH-2026-001281" title="Acesso ao Moodle indisponível" sla={61} color="amber" />
                <MockTicket level="N3" code="CH-2026-001277" title="Falha de roteamento — Unidade Cohab" sla={18} color="red" />
                <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                  <MiniKpi label="Abertos" value="24" tone="orange" />
                  <MiniKpi label="Em andamento" value="11" tone="blue" />
                  <MiniKpi label="Resolvidos hoje" value="48" tone="green" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="recursos" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--senac-orange)]">
              Recursos
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--senac-blue)]">
              Tudo que sua equipe de TI precisa, em um só lugar
            </h2>
            <p className="mt-3 text-slate-600">
              Da abertura do chamado à pesquisa de satisfação — com automação
              em cada passo do fluxo.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Feature
              icon={<Zap size={20} />}
              title="Abertura inteligente"
              desc="Wizard guiado com classificação automática por categoria, subcategoria e nível de atendimento."
            />
            <Feature
              icon={<Layers size={20} />}
              title="Filas N1 · N2 · N3"
              desc="Triagem por especialidade com escalonamento controlado e histórico completo de cada movimentação."
            />
            <Feature
              icon={<Activity size={20} />}
              title="SLA em tempo real"
              desc="Cronômetros ao vivo, alertas visuais e atualização automática a cada 30 segundos."
            />
            <Feature
              icon={<BarChart3 size={20} />}
              title="Dashboards executivos"
              desc="KPIs por nível, status e unidade — gráficos que mostram tendências e gargalos."
            />
            <Feature
              icon={<ShieldCheck size={20} />}
              title="Segurança institucional"
              desc="Row-Level Security, perfis granulares e auditoria completa de todas as ações."
            />
            <Feature
              icon={<Headphones size={20} />}
              title="Satisfação do solicitante"
              desc="Pesquisa em 5 dimensões com nota 1–5 estrelas após cada resolução."
            />
          </div>
        </div>
      </section>

      {/* FLUXO / Steps */}
      <section id="fluxo" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--senac-orange)]">
              Como funciona
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-[var(--senac-blue)]">
              Do clique ao chamado resolvido
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { n: "01", t: "Solicite", d: "Abra o chamado com poucos cliques pelo portal." },
              { n: "02", t: "Classifique", d: "O sistema sugere categoria, nível e SLA automaticamente." },
              { n: "03", t: "Atenda", d: "Equipe N1/N2/N3 trabalha em fila com SLA visível." },
              { n: "04", t: "Avalie", d: "O solicitante valida e avalia o atendimento." },
            ].map((s) => (
              <div
                key={s.n}
                className="relative bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="text-4xl font-extrabold text-[var(--senac-orange)]/30 group-hover:text-[var(--senac-orange)] transition">
                  {s.n}
                </div>
                <div className="mt-2 font-bold text-[var(--senac-blue)]">{s.t}</div>
                <p className="mt-1.5 text-sm text-slate-600">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SLA strip */}
      <section
        id="sla"
        className="py-16 relative overflow-hidden text-white"
        style={{
          background:
            "linear-gradient(135deg, var(--senac-blue) 0%, var(--senac-blue-dark) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold">
              Pronto para acelerar o atendimento da sua unidade?
            </h2>
            <p className="mt-2 text-white/75 max-w-2xl">
              Entre com sua conta institucional e comece a usar agora — sem
              instalação, com SLA padronizado para todo o SENAC-MA.
            </p>
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg font-semibold text-[var(--senac-blue)] bg-white hover:bg-slate-100 shadow-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--senac-blue)]"
          >
            Acessar o SmartDesk <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <img src={senacLogo} alt="SENAC" className="h-6" />
            <span>© {new Date().getFullYear()} SENAC Maranhão · SmartDesk</span>
          </div>
          <div className="flex items-center gap-5 text-slate-500">
            <span className="flex items-center gap-1.5"><Users size={14} /> 5 unidades</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> SLA &lt; 4h</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> 98% satisfação</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold text-[var(--senac-blue)]">{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-[var(--senac-blue)]/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
      <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-[var(--senac-blue)]/8 text-[var(--senac-blue)] group-hover:bg-[var(--senac-blue)] group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="mt-4 font-bold text-[var(--senac-blue)]">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function MockTicket({
  level,
  code,
  title,
  sla,
  color,
}: {
  level: string;
  code: string;
  title: string;
  sla: number;
  color: "emerald" | "amber" | "red";
}) {
  const colorMap = {
    emerald: { bar: "bg-emerald-500", chip: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    amber: { bar: "bg-amber-500", chip: "bg-amber-50 text-amber-700 border-amber-200" },
    red: { bar: "bg-red-500", chip: "bg-red-50 text-red-700 border-red-200" },
  }[color];
  return (
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-white transition">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${colorMap.chip} border`}>{level}</span>
          <span className="font-mono text-[11px] text-slate-500">{code}</span>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">{sla}% SLA</span>
      </div>
      <div className="mt-1.5 text-sm font-medium text-slate-800 truncate">{title}</div>
      <div className="mt-2 h-1 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full ${colorMap.bar}`} style={{ width: `${sla}%` }} />
      </div>
    </div>
  );
}

function MiniKpi({ label, value, tone }: { label: string; value: string; tone: "orange" | "blue" | "green" }) {
  const c = {
    orange: "text-[var(--senac-orange)]",
    blue: "text-[var(--senac-blue)]",
    green: "text-emerald-600",
  }[tone];
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${c}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</div>
    </div>
  );
}
