import Image from "next/image";
import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_18%_10%,#e0f2fe_0%,transparent_34%),radial-gradient(circle_at_82%_82%,#dbeafe_0%,transparent_30%),linear-gradient(180deg,#edf5ff_0%,#f8fbff_55%,#f2f5fb_100%)] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-6xl items-center justify-center">
        <section className="relative grid w-full max-w-[1180px] overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.18)] sm:rounded-[2.4rem] md:grid-cols-[38%_62%] md:min-h-[760px]">
          <div className="relative isolate min-h-[260px] overflow-hidden border-b border-slate-200 md:min-h-0 md:border-b-0 md:border-r">
            <Image
              src="/hero-calendar.svg"
              alt="Wall calendar hero"
              fill
              priority
              className="object-contain object-top p-6 sm:p-8"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/20 via-transparent to-white/10" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/85 to-transparent" />
            <div className="absolute bottom-0 left-0 h-24 w-[45%] bg-sky-500/85 [clip-path:polygon(0_38%,100%_100%,0_100%)]" />
            <div className="absolute bottom-0 right-0 h-24 w-[45%] bg-sky-500/85 [clip-path:polygon(0_100%,100%_38%,100%_100%)]" />
            <div className="absolute left-1/2 top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-700 shadow-sm" aria-hidden="true" />
            <div className="absolute left-1/2 top-5 h-px w-24 -translate-x-1/2 bg-slate-400/80" aria-hidden="true" />
            <div className="absolute left-[calc(50%-3rem)] top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-700 shadow-sm" aria-hidden="true" />
            <div className="absolute left-[calc(50%+3rem)] top-4 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-700 shadow-sm" aria-hidden="true" />
          </div>

          <div className="min-h-0 overflow-hidden">
            <Calendar />
          </div>
        </section>
      </div>
    </main>
  );
}
