'use client';

import { site } from '@/lib/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

const STEPS = [
  {
    index: '01',
    title: 'Oles',
    body: 'Roti tebal dua sentimeter dioles mentega, lalu olesan utama sesuai varian. Tidak ada yang dioles di awal hari.',
  },
  {
    index: '02',
    title: 'Panggang',
    body: 'Di atas bara, dibalik dua kali. Tepinya harus garing, bagian dalamnya masih lembut dan hangat.',
  },
  {
    index: '03',
    title: 'Susun',
    body: 'Topping baru ditabur setelah roti turun dari bara, supaya keju tidak leleh berlebihan dan pisang tetap segar.',
  },
];

export function StorySection() {
  return (
    <section id="cerita" className="relative section-pad overflow-hidden">
      {/* Angka dekoratif di latar */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-10 select-none font-display text-[26vw] font-extrabold leading-none tracking-[-0.06em] text-outline opacity-40 md:right-0"
      >
        {site.established}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[36rem] w-[36rem] rounded-full bg-ember/[0.05] blur-[130px]"
      />

      <div className="container-page relative grid gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        <div>
          <SectionHeading
            index="03"
            eyebrow="Cerita"
            title={
              <>
                Dari gerobak kecil,
                <span className="text-cream/40"> ke meja makan kamu.</span>
              </>
            }
          />

          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-[15px] leading-[1.75] text-cream-dim/75">
              <p>
                Hersha mulai dari satu gerobak kecil di Karanganyar pada {site.established}. Waktu
                itu cuma ada tiga olesan, satu pemanggang arang, dan satu orang yang bolak-balik
                membalik roti.
              </p>
              <p>
                Variannya bertambah, tapi caranya tidak berubah: dipanggang per porsi, olesan dibuat
                sendiri setiap pagi, dan tidak ada roti yang disimpan untuk besok.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-7">
              {site.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd className="font-display text-3xl font-semibold tracking-[-0.03em] text-cream md:text-4xl">
                    {stat.value}
                  </dd>
                  <dd className="mt-2 text-[11px] leading-snug text-cream-dim/50">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="flex flex-col justify-center">
          <div className="space-y-0">
            {STEPS.map((step, index) => (
              <Reveal key={step.index} delay={0.05 + index * 0.07}>
                <div className="group grid grid-cols-[auto_1fr] gap-5 border-t border-white/[0.08] py-7 last:border-b sm:gap-8 sm:py-8">
                  <span className="font-body text-[11px] tabular-nums tracking-[0.2em] text-cheese/50 transition-colors group-hover:text-cheese">
                    {step.index}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-[-0.02em] text-cream sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-md text-[13.5px] leading-relaxed text-cream-dim/60">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <figure className="relative mt-10 overflow-hidden rounded-3xl border border-cheese/15 bg-gradient-to-br from-charcoal to-ink p-7 md:p-9">
              <div
                aria-hidden
                className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cheese/10 blur-3xl"
              />
              <span aria-hidden className="font-display text-4xl leading-none text-cheese/30">
                &ldquo;
              </span>
              <blockquote className="mt-2 font-display text-lg font-medium leading-snug tracking-[-0.015em] text-cream/90 md:text-xl">
                Kalau rotinya tidak garing di luar, kami tidak mengirimnya. Sesederhana itu.
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 text-[11px] text-cream/45">
                <span className="h-px w-8 bg-cheese/40" />
                Hersha — pendiri
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
