export default function ThreeDPageLoading() {
  return (
    <div
      className="font-dm-sans flex min-h-screen flex-col text-[#0f1412] lg:flex-row"
      style={{ background: "#0f1412" }}
    >
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 lg:hidden">
        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-32 animate-pulse rounded bg-white/10" />
      </header>

      <main className="relative order-1 flex min-h-[52svh] flex-1 flex-col items-center justify-center bg-[#eaecea] lg:order-1 lg:min-h-0 lg:flex-[2] lg:self-stretch">
        <div className="flex flex-col items-center gap-5 px-6 text-center">
          <div
            className="h-11 w-11 shrink-0 rounded-full border-2 border-[#d8dfe0] border-t-[#5fb3b3] motion-safe:animate-spin"
            aria-hidden
          />
          <div className="flex flex-col gap-2">
            <p
              className="text-[15px] font-semibold tracking-tight text-[#1c2321]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Loading configurator…
            </p>
            <p className="max-w-[280px] text-[13px] leading-snug text-[#6f7673]">
              Setting up the 3D workspace.
            </p>
          </div>
        </div>
      </main>

      <aside
        className="order-2 min-h-[120px] w-full shrink-0 animate-pulse bg-[#f7f9f8] lg:h-screen lg:w-[min(472px,40vw)] lg:shrink-0 lg:border-l lg:border-white/10"
        aria-hidden
      />
    </div>
  );
}
