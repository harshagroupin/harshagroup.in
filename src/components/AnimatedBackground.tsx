export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(214,159,54,0.10),transparent_34%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.16]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),transparent_35%,rgba(0,0,0,0.18))]" />
    </div>
  );
}
