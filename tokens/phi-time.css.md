/\* apps/patternlens-b2c/app/styles/phi-time.css \*/  
:root {  
  \--phi: 1.618033988749895;  
  \--golden-ms: 1618;

  /\* Skala φ wokół 1618ms \*/  
  \--dur-micro:    100ms;   /\* φ⁻⁴ \*/  
  \--dur-swift:    162ms;   /\* φ⁻³ \*/  
  \--dur-standard: 262ms;   /\* φ⁻² \*/  
  \--dur-moderate: 424ms;   /\* φ⁻¹ \*/  
  \--dur-golden:   1618ms;  /\* φ⁰  — state transition \*/  
  \--dur-breath:   2618ms;  /\* φ¹  — calm entry \*/  
  \--dur-rest:     4236ms;  /\* φ²  — full breath cycle \*/

  /\* Easing: asymetryczny, „oddychający” wydech \*/  
  \--ease-golden: cubic-bezier(0.38, 0.0, 0.12, 1.0);

  /\* Profile oddechowe (Flow/Focus/Calm) \*/  
  \--breath-flow-cycle: 5000ms;  
  \--breath-focus-cycle: 9472ms;  
  \--breath-calm-cycle: 12090ms;

  /\* Fibonacci Damping Visuals \*/  
  \--damp-reset: 3000ms;  
}

@keyframes golden-pulse {  
  0%, 100% { opacity: 0.15; transform: scale(1); }  
  50% { opacity: 0.35; transform: scale(1.02); }  
}

.golden-rect-pulse {  
  animation: golden-pulse var(--breath-calm-cycle) var(--ease-golden) infinite;  
}

@media (prefers-reduced-motion: reduce) {  
  \*, \*::before, \*::after {  
    animation-duration: 0.01ms \!important;  
    transition-duration: 0.01ms \!important;  
  }  
}  
