/**
 * Animated AI-themed floating gradient orbs.
 * Pure CSS animations — no heavy JS libraries.
 */
export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Gradient orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(43 70% 50%), transparent 70%)",
          top: "-15%",
          right: "-10%",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(43 70% 65%), transparent 70%)",
          bottom: "-10%",
          left: "-8%",
          animation: "float-delayed 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full opacity-[0.04] blur-[80px]"
        style={{
          background: "radial-gradient(circle, hsl(200 60% 50%), transparent 70%)",
          top: "40%",
          left: "50%",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 dot-grid opacity-[0.03]" />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
        }}
      />
    </div>
  );
}
