"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-[#060a14] dark:via-[#0a1628] dark:to-[#0c1220]" />

      {/* Floating orbs */}
      <div className="orb orb-1" style={{ top: "5%", left: "10%" }} />
      <div className="orb orb-2" style={{ top: "60%", right: "5%" }} />
      <div className="orb orb-3" style={{ bottom: "10%", left: "30%" }} />
      <div className="orb orb-4" style={{ top: "30%", right: "25%" }} />

      {/* Subtle noise/grain overlay for depth */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
