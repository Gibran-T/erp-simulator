import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { Shield, Users, BookOpen } from "lucide-react";

export default function AdminPanel() {
  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const { data: cohorts } = trpc.cohorts.list.useQuery();
  const { data: runs } = trpc.monitor.allRuns.useQuery();

  return (
    <FioriShell title="Panneau d'Administration" breadcrumbs={[{ label: "Administration" }]}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "Scénarios", value: scenarios?.length ?? 0, color: "text-[#0070f2]", bg: "bg-[#e8f0fe]" },
          { icon: Users, label: "Cohortes", value: cohorts?.length ?? 0, color: "text-[#107e3e]", bg: "bg-[#d4edda]" },
          { icon: Shield, label: "Simulations totales", value: runs?.length ?? 0, color: "text-[#5b4b8a]", bg: "bg-[#ede7f6]" },
        ].map(card => (
          <div key={card.label} className="bg-white border border-[#d9d9d9] rounded-md p-5">
            <div className={`w-9 h-9 ${card.bg} rounded-md flex items-center justify-center mb-3`}>
              <card.icon size={16} className={card.color} />
            </div>
            <p className="text-2xl font-bold text-[#0f2a44]">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="alert-info">
        <p className="text-xs font-semibold mb-1 flex items-center gap-2"><Shield size={12} /> Panneau Administrateur</p>
        <p className="text-xs">Pour promouvoir un utilisateur au rôle enseignant, modifiez le champ <code className="bg-white/60 px-1 rounded">role</code> dans la base de données via le panneau Database de Manus.</p>
      </div>
    </FioriShell>
  );
}
