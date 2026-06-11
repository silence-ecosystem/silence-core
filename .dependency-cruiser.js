module.exports = {
  forbidden: [
    {
      name: "RULE-DOM-001-no-open-core-to-ee",
      severity: "error",
      from: { path: "^04_packages/@silence" },
      to: { path: "^03_ee/@silence" }
    },
    {
      name: "RULE-DOM-001-no-apps-direct-to-ee",
      severity: "error",
      from: { path: "^05_apps/" },
      to: { path: "^03_ee/@silence" }
    },
    {
      name: "RULE-DOM-001-no-import-from-archive",
      severity: "error",
      from: { path: "^(03_ee|04_packages|05_apps)/" },
      to: { path: "^07_archive/legacy_monorepo" }
    },
    {
      name: "RULE-DOM-001-no-medical-in-open-core",
      severity: "error",
      from: { path: "^(04_packages|05_apps)/" },
      to: { path: "^@silence/medical" }
    },
    {
      name: "RULE-DOM-001-no-predictive-in-open-core",
      severity: "error",
      from: { path: "^(04_packages|05_apps)/" },
      to: { path: "^@silence/predictive" }
    },
    {
      name: "RULE-DOM-001-no-intervention-timing-in-open-core",
      severity: "error",
      from: { path: "^(04_packages|05_apps)/" },
      to: { path: "^@silence/intervention-timing" }
    },
    {
      name: "RULE-DOM-001-no-behavioral-engine-in-open-core",
      severity: "error",
      from: { path: "^(04_packages|05_apps)/" },
      to: { path: "^@silence/behavioral-engine" }
    },
    {
      name: "RULE-DOM-001-no-behaviour-engine-in-open-core",
      severity: "error",
      from: { path: "^(04_packages|05_apps)/" },
      to: { path: "^@silence/behaviour-engine" }
    }
  ],
  options: {
    doNotFollow: {
      path: "node_modules"
    },
    exclude: {
      path: "\.(next|dist|out|coverage|\.turbo)/"
    }
  }
};
