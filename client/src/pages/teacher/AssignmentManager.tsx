import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { ClipboardList, Trash2 } from "lucide-react";

export default function AssignmentManager() {
  const { data: assignments, refetch } = trpc.assignments.all.useQuery();
  const { data: scenarios } = trpc.scenarios.list.useQuery();
  const { data: cohorts } = trpc.cohorts.list.useQuery();

  const scenarioMap = Object.fromEntries((scenarios ?? []).map((s: any) => [s.id, s.name]));
  const cohortMap = Object.fromEntries((cohorts ?? []).map((c: any) => [c.id, c.name]));

  return (
    <FioriShell title="Gestion des Devoirs" breadcrumbs={[{ label: "Tableau de bord", href: "/teacher" }, { label: "Devoirs" }]}>
      <div className="bg-white border border-[#d9d9d9] rounded-md">
        <div className="px-5 py-3 border-b border-[#ededed]">
          <p className="text-xs font-semibold text-[#0f2a44] flex items-center gap-2">
            <ClipboardList size={13} /> Devoirs assignés ({assignments?.length ?? 0})
          </p>
        </div>
        <div className="divide-y divide-[#ededed]">
          {assignments?.length === 0 && (
            <div className="py-12 text-center text-gray-400 text-xs">
              <ClipboardList size={28} className="mx-auto mb-3 opacity-40" />
              Aucun devoir assigné. Allez dans Scénarios pour assigner.
            </div>
          )}
          {assignments?.map((item: any) => {
            // getAllAssignments returns { assignment, scenario } nested objects
            const a = item.assignment ?? item;
            const scenarioName = item.scenario?.name ?? scenarioMap[a.scenarioId] ?? `Scénario #${a.scenarioId}`;
            return (
              <div key={a.id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#0f2a44]">{scenarioName}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    Cohorte : {cohortMap[a.cohortId] ?? (a.cohortId ? `#${a.cohortId}` : "—")} ·
                    Étudiant : {a.userId ? `#${a.userId}` : "Tous"} ·
                    Échéance : {a.dueDate ? new Date(a.dueDate).toLocaleDateString("fr-CA") : "Aucune"}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${a.status === "active" ? "bg-[#d4edda] text-[#107e3e]" : "bg-[#f0f0f0] text-gray-500"}`}>
                  {a.status ?? "active"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </FioriShell>
  );
}
