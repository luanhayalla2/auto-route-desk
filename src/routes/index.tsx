import { createFileRoute } from "@tanstack/react-router";
import senacLogo from "../assets/senac-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartDesk SENAC-MA" },
      { name: "description", content: "Service Desk corporativo do SENAC-MA — atendimento inteligente N1/N2/N3 com SLA e rastreabilidade." },
      { property: "og:title", content: "SmartDesk SENAC-MA" },
      { property: "og:description", content: "Service Desk corporativo do SENAC-MA — atendimento inteligente N1/N2/N3 com SLA e rastreabilidade." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f5f7fa] px-4">
      <img
        src={senacLogo}
        alt="Logo SENAC Service Desk"
        width={400}
        className="mb-8"
      />
      <h1 className="text-3xl font-bold text-[#003a70]">SmartDesk SENAC-MA</h1>
      <p className="mt-2 text-center text-[#f58220] font-medium">
        Service Desk Corporativo — N1 · N2 · N3
      </p>
      <p className="mt-4 max-w-md text-center text-sm text-muted-foreground">
        Centralize o atendimento de TI e infraestrutura com classificação automática,
        filas inteligentes e monitoramento de SLA em tempo real.
      </p>
    </div>
  );
}
