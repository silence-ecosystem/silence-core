import React from 'react';

/**
 * ExecutiveDashboard v7.0
 * Widok agregujący dla Tenant Adminów. Zero PII, pełny wgląd w kognitywne BHP firmy.
 */
export const ExecutiveDashboard = ({ tenantStats }: any) => {
  return (
    <div className="p-10 bg-slate-950 min-h-screen font-mono text-slate-300">
      <header className="mb-12 border-l-4 border-emerald-500 pl-6">
        <h1 className="text-4xl font-bold text-white uppercase tracking-tighter">Tenant_Overview</h1>
        <p className="text-xs text-slate-500 uppercase mt-2">Org: {tenantStats.orgName} | Compliance: S11_STRICT</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kognitywna Mapa Cieplna Działów */}
        <div className="col-span-2 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h2 className="text-xs font-bold uppercase mb-6 text-emerald-400">Department_Cognitive_Health</h2>
          <div className="space-y-6">
            {tenantStats.departments.map((dept: any) => (
              <div key={dept.name}>
                <div className="flex justify-between text-[10px] mb-2">
                  <span>{dept.name}</span>
                  <span>FLOW_STABILITY: {dept.flowScore}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${dept.flowScore}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Globalne Rekomendacje B2B */}
        <div className="p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
          <h2 className="text-xs font-bold uppercase mb-6 text-blue-400">Insights_Engine</h2>
          <p className="text-sm italic leading-relaxed">
            "Wykryto systemowe przeciążenie w dziale Design w czwartki. Sugerowana optymalizacja kognitywna: 'Silence-Thursday' (blokada spotkań)."
          </p>
        </div>
      </div>
    </div>
  );
};
