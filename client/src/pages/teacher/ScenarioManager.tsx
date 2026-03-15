import FioriShell from "@/components/FioriShell";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, BookOpen, Users, UserCheck, ChevronDown, ChevronUp } from "lucide-react";

type AssignTarget = { type: "cohort" | "student"; id: string };

export default function ScenarioManager() {
  const { data: scenarios, refetch } = trpc.scenarios.list.useQuery();
  const { data: cohorts } = trpc.cohorts.list.useQuery();
  const { data: students } = trpc.admin.listStudents.useQuery();
  const createScenario = trpc.scenarios.create.useMutation({ onSuccess: () => { toast.success("Scénario créé"); refetch(); setShowForm(false); } });
  const createCohort = trpc.cohorts.create.useMutation({ onSuccess: () => { toast.success("Cohorte créée"); } });
  const createAssignment = trpc.assignments.create.useMutation({ onSuccess: () => toast.success("Devoir assigné avec succès") });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", descriptionFr: "", difficulty: "facile" as "facile" | "moyen" | "difficile" });
  const [cohortName, setCohortName] = useState("");
  const [assignTargets, setAssignTargets] = useState<Record<number, AssignTarget>>({});
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (id: number) => setCollapsed(prev => ({ ...prev, [id]: !prev[id] }));

  const handleAssign = (scenarioId: number) => {
    const target = assignTargets[scenarioId];
    if (!target || !target.id) { toast.error("Sélectionnez une cohorte ou un étudiant"); return; }
    if (target.type === "cohort") {
      createAssignment.mutate({ scenarioId, cohortId: parseInt(target.id), userId: null, dueDate: null });
    } else {
      createAssignment.mutate({ scenarioId, cohortId: null, userId: parseInt(target.id), dueDate: null });
    }
  };

  const difficultyBadge: Record<string, string> = {
    facile: "bg-[#d4edda] text-[#107e3e]",
    moyen: "bg-[#fff3cd] text-[#e9730c]",
    difficile: "bg-[#fde8e8] text-[#bb0000]",
  };

  const byModule: Record<number, typeof scenarios> = {};
  scenarios?.forEach(s => {
    const mid = s.moduleId ?? 1;
    if (!byModule[mid]) byModule[mid] = [];
    byModule[mid]!.push(s);
  });

  return (
    <FioriShell title="Gestion des Scénarios" breadcrumbs={[{ label: "Tableau de bord", href: "/teacher" }, { label: "Scénarios" }]}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0f2a44] flex items-center gap-2"><BookOpen size={15} /> Scénarios disponibles</h2>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 bg-[#0070f2] text-white text-xs font-semibold px-3 py-2 rounded-md hover:bg-[#0058c7] transition-colors">
              <Plus size={13} /> Nouveau scénario
            </button>
          </div>

          {showForm && (
            <div className="bg-white border border-[#d9d9d9] rounded-md p-4 space-y-3">
              <p className="text-xs font-semibold text-[#0f2a44]">Créer un nouveau scénario</p>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nom du scénario" className="fiori-field-input w-full" />
              <textarea value={form.descriptionFr} onChange={e => setForm(f => ({ ...f, descriptionFr: e.target.value }))}
                placeholder="Description (français)" rows={3} className="fiori-field-input w-full resize-none" />
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as any }))}
                className="fiori-field-input w-full">
                <option value="facile">Facile</option>
                <option value="moyen">Moyen</option>
                <option value="difficile">Difficile</option>
              </select>
              <div className="flex gap-2">
                <button onClick={() => createScenario.mutate({ moduleId: 1, ...form, initialStateJson: {} })}
                  disabled={createScenario.isPending}
                  className="bg-[#0070f2] text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-[#0058c7] disabled:opacity-50">
                  {createScenario.isPending ? "Création..." : "Créer"}
                </button>
                <button onClick={() => setShowForm(false)} className="text-xs text-gray-500 hover:text-gray-700 px-3 py-2">Annuler</button>
              </div>
            </div>
          )}

          {/* Grouped by module with collapsible sections */}
          {Object.entries(byModule).sort(([a], [b]) => Number(a) - Number(b)).map(([moduleId, moduleScenarios]) => {
            const mid = Number(moduleId);
            const isOpen = collapsed[mid] !== true;
            return (
              <div key={mid} className="border border-[#d9d9d9] rounded-md overflow-hidden">
                <button type="button" onClick={() => toggleCollapse(mid)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#f5f7fa] hover:bg-[#eef1f6] transition-colors">
                  <span className="text-xs font-bold text-[#0f2a44] flex items-center gap-2">
                    <BookOpen size={13} className="text-[#0070f2]" />
                    Module {mid} — {mid === 1 ? "Fondements ERP/WMS" : mid === 2 ? "Exécution d'entrepôt et gestion des emplacements" : mid === 3 ? "Contrôle des stocks et réapprovisionnement" : mid === 4 ? "Indicateurs de performance logistique" : mid === 5 ? "Simulation opérationnelle intégrée" : `Module ${mid}`}
                    <span className="text-[10px] font-normal text-gray-400 ml-1">({moduleScenarios?.length ?? 0} scénarios)</span>
                  </span>
                  {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="divide-y divide-[#f0f0f0]">
                    {moduleScenarios?.map((s) => (
                      <div key={s.id} className="bg-white p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#0f2a44] truncate">{s.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{s.descriptionFr}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${difficultyBadge[s.difficulty ?? "facile"] ?? ""}`}>
                                {s.difficulty}
                              </span>
                              <span className="text-[10px] text-gray-400">M{s.moduleId}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex flex-col gap-1">
                              <div className="flex rounded border border-[#d9d9d9] overflow-hidden text-[10px]">
                                <button type="button"
                                  onClick={() => setAssignTargets(prev => ({ ...prev, [s.id]: { type: "cohort", id: "" } }))}
                                  className={`px-2 py-1 transition-colors ${
                                    (assignTargets[s.id]?.type ?? "cohort") === "cohort"
                                      ? "bg-[#0070f2] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                                  }`}>
                                  <Users size={10} className="inline mr-0.5" />Cohorte
                                </button>
                                <button type="button"
                                  onClick={() => setAssignTargets(prev => ({ ...prev, [s.id]: { type: "student", id: "" } }))}
                                  className={`px-2 py-1 transition-colors ${
                                    assignTargets[s.id]?.type === "student"
                                      ? "bg-[#0070f2] text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                                  }`}>
                                  <UserCheck size={10} className="inline mr-0.5" />Étudiant
                                </button>
                              </div>
                              {(assignTargets[s.id]?.type ?? "cohort") === "cohort" ? (
                                <select
                                  value={assignTargets[s.id]?.id ?? ""}
                                  onChange={e => setAssignTargets(prev => ({ ...prev, [s.id]: { type: "cohort", id: e.target.value } }))}
                                  className="text-xs border border-[#d9d9d9] rounded px-2 py-1.5 focus:outline-none focus:border-[#0070f2] min-w-[160px]">
                                  <option value="">— Sélectionner cohorte —</option>
                                  {cohorts?.length === 0 && <option disabled>Aucune cohorte créée</option>}
                                  {cohorts?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              ) : (
                                <select
                                  value={assignTargets[s.id]?.id ?? ""}
                                  onChange={e => setAssignTargets(prev => ({ ...prev, [s.id]: { type: "student", id: e.target.value } }))}
                                  className="text-xs border border-[#d9d9d9] rounded px-2 py-1.5 focus:outline-none focus:border-[#0070f2] min-w-[160px]">
                                  <option value="">— Sélectionner étudiant —</option>
                                  {students?.length === 0 && <option disabled>Aucun étudiant inscrit</option>}
                                  {students?.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                              )}
                            </div>
                            <button onClick={() => handleAssign(s.id)} disabled={createAssignment.isPending}
                              className="text-xs bg-[#0f2a44] text-white px-3 py-1.5 rounded-md hover:bg-[#1a3a5c] transition-colors disabled:opacity-50 self-end">
                              Assigner
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right panel: Cohorts + Students */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#0f2a44] flex items-center gap-2"><Users size={15} /> Cohortes</h2>
            <div className="flex gap-2">
              <input value={cohortName} onChange={e => setCohortName(e.target.value)}
                placeholder="Nom de la cohorte" className="fiori-field-input flex-1 text-xs" />
              <button onClick={() => { if (!cohortName) return; createCohort.mutate({ name: cohortName }); setCohortName(""); }}
                className="bg-[#0070f2] text-white text-xs px-3 py-2 rounded-md hover:bg-[#0058c7]">
                <Plus size={13} />
              </button>
            </div>
            <div className="space-y-2">
              {cohorts?.length === 0 && <p className="text-xs text-gray-400 italic">Aucune cohorte. Créez-en une ci-dessus.</p>}
              {cohorts?.map((c: any) => (
                <div key={c.id} className="bg-white border border-[#d9d9d9] rounded-md p-3">
                  <p className="text-xs font-semibold text-[#0f2a44]">{c.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">ID: {c.id}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-[#0f2a44] flex items-center gap-2"><UserCheck size={15} /> Étudiants inscrits</h2>
            <div className="space-y-2">
              {students?.length === 0 && <p className="text-xs text-gray-400 italic">Aucun étudiant inscrit.</p>}
              {students?.map((u: any) => (
                <div key={u.id} className="bg-white border border-[#d9d9d9] rounded-md p-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0070f2]/10 flex items-center justify-center text-[10px] font-bold text-[#0070f2] flex-shrink-0">
                    {u.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#0f2a44] truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{u.email ?? "—"}</p>
                  </div>
                  {u.studentNumber ? (
                    <span className="text-[10px] font-mono bg-[#e8f4fd] text-[#0070f2] px-1.5 py-0.5 rounded flex-shrink-0" title="Numéro étudiant">{u.studentNumber}</span>
                  ) : (
                    <span className="text-[10px] text-gray-300 italic flex-shrink-0">N° —</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FioriShell>
  );
}
