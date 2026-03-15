import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

export default function CohortManager() {
  const { data: cohorts, refetch } = trpc.cohorts.list.useQuery();
  const createCohort = trpc.cohorts.create.useMutation({ onSuccess: () => { toast.success("Cohorte créée"); refetch(); setName(""); } });
  const [name, setName] = useState("");

  return (
    <FioriShell title="Gestion des Cohortes" breadcrumbs={[{ label: "Tableau de bord", href: "/teacher" }, { label: "Cohortes" }]}>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom de la cohorte (ex: Groupe A — Automne 2025)"
            className="fiori-field-input flex-1" />
          <button onClick={() => { if (!name.trim()) return; createCohort.mutate({ name }); }}
            disabled={createCohort.isPending}
            className="flex items-center gap-1.5 bg-[#0070f2] text-white text-xs font-semibold px-4 py-2.5 rounded-md hover:bg-[#0058c7] disabled:opacity-50">
            <Plus size={13} /> Créer
          </button>
        </div>
        <div className="space-y-2">
          {cohorts?.map((c: any) => (
            <div key={c.id} className="bg-white border border-[#d9d9d9] rounded-md p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-[#e8f0fe] rounded-full flex items-center justify-center flex-shrink-0">
                <Users size={14} className="text-[#0070f2]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0f2a44]">{c.name}</p>
                <p className="text-[10px] text-gray-400">Cohorte #{c.id} · Créée le {new Date(c.createdAt).toLocaleDateString("fr-CA")}</p>
              </div>
            </div>
          ))}
          {cohorts?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Users size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Aucune cohorte créée</p>
            </div>
          )}
        </div>
      </div>
    </FioriShell>
  );
}
