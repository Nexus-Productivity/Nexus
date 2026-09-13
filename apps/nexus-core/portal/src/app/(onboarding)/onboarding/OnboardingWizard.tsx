"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Coffee,
  Dumbbell,
  HardHat,
  MapPin,
  Rocket,
  ShoppingBag,
  Sparkles,
  Store,
  Target,
  Users,
  Wrench,
} from "lucide-react";
import { Button, FormField, Logo } from "@nexus/ui";
import { guardarOnboarding } from "@/lib/acciones-gym";

/**
 * Wizard de onboarding — 6 pasos:
 *  0. Intro de visión: del problema a "NEXUS es la solución".
 *  1. Nombre del negocio · 2. Rubro · 3. País + moneda · 4. Equipo · 5. Dolor primero.
 * 6. Resumen y guardado (server action guardarOnboarding → /?tour=1).
 *
 * El paso 2 marca el rubro para el rubro del módulo. Hoy sólo el gimnasio tiene
 * módulo activo; las demás opciones se guardan igualmente (llegan en el roadmap).
 */

const TOTAL = 6;

const RUBROS = [
  { id: "gimnasio", label: "Gimnasio", icono: Dumbbell, activo: true },
  { id: "restaurante", label: "Restaurante / Café", icono: Coffee },
  { id: "tienda", label: "Tienda", icono: ShoppingBag },
  { id: "taller", label: "Taller", icono: Wrench },
  { id: "constructora", label: "Constructora", icono: HardHat },
  { id: "otro", label: "Otro negocio", icono: Building2 },
];

const PAISES = [
  { codigo: "CO", nombre: "Colombia" },
  { codigo: "US", nombre: "Estados Unidos" },
  { codigo: "MX", nombre: "México" },
  { codigo: "AR", nombre: "Argentina" },
  { codigo: "CL", nombre: "Chile" },
  { codigo: "PE", nombre: "Perú" },
];

const MONEDAS = ["COP", "USD", "MXN", "ARS", "CLP", "PEN"];

const DOLORES = [
  {
    id: "cobrar",
    titulo: "Cobrar mejor",
    texto: "Nunca más un socio con la mensualidad vencida. Vencimientos claros, cobros en 3 toques.",
  },
  {
    id: "no-perder",
    titulo: "No perder plata",
    texto: "Control de gastos: sabé si el mes cerró en verde o en rojo y qué se llevó la plata.",
  },
  {
    id: "saber-flujo",
    titulo: "Saber cuánto entra y sale",
    texto: "Reportes claros, sin Excel ni papel. Decisiones con datos, no con recuerdos.",
  },
];

const EQUIPO = [
  { id: "solo-yo", label: "Solo yo", texto: "Llevo mi negocio yo mismo" },
  { id: "equipo", label: "Yo y mi equipo", texto: "Varias personas usan Nexus (las invito después)" },
];

type Datos = {
  nombre: string;
  rubro: string;
  pais: string;
  moneda: string;
  equipo: string;
  dolor: string;
};

export function OnboardingWizard({ orgNombre }: { orgNombre: string }) {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState<Datos>({
    nombre: orgNombre,
    rubro: "gimnasio",
    pais: "CO",
    moneda: "COP",
    equipo: "solo-yo",
    dolor: "",
  });

  const siguiente = () => setPaso((p) => Math.min(p + 1, TOTAL));
  const atras = () => setPaso((p) => Math.max(p - 1, 0));

  const puedeSeguir =
    paso === 1 ? datos.nombre.trim().length > 1 : paso === 5 ? datos.dolor !== "" : true;

  return (
    <main
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-nexus-bg px-4 py-10"
      style={{
        backgroundImage:
          "radial-gradient(650px 340px at 50% -10%, rgb(201 130 26 / 0.16), transparent 70%)",
      }}
    >
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center text-center">
          <Logo size="lg" />
          <p className="mt-4 text-sm text-nexus-muted">Tu negocio, conectado.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-nexus-border bg-nexus-surface/95 p-7 shadow-lg shadow-nexus-ink/5">
          {/* Progreso (se oculta en la intro) */}
          {paso >= 1 && paso < TOTAL && (
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-nexus-muted">
                <span>
                  Paso {paso} de {TOTAL - 1}
                </span>
                <span>Podés cambiar todo esto después</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-nexus-border/50">
                <div
                  className="h-full rounded-full bg-nexus-gold transition-all"
                  style={{ width: `${(paso / (TOTAL - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* PASO 0 — INTRO: del problema a NEXUS ES LA SOLUCIÓN */}
          {paso === 0 && <Intro onEmpezar={siguiente} />}

          {/* PASO 1 — NOMBRE */}
          {paso === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-nexus-ink">
                  <Store className="h-5 w-5 text-nexus-gold" /> ¿Cómo se llama tu negocio?
                </h1>
                <p className="mt-1 text-sm text-nexus-muted">
                  Es lo que vas a ver en Nexus y en tus reportes.
                </p>
              </div>
              <FormField label="Nombre del negocio">
                <input
                  type="text"
                  value={datos.nombre}
                  onChange={(e) => setDatos((d) => ({ ...d, nombre: e.target.value }))}
                  className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink focus:border-nexus-gold focus:outline-none focus:ring-2 focus:ring-nexus-gold/20"
                  placeholder="Gimnasio Zona Rosa"
                  autoFocus
                />
              </FormField>
            </div>
          )}

          {/* PASO 2 — RUBRO */}
          {paso === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-nexus-ink">
                  <Store className="h-5 w-5 text-nexus-gold" /> ¿A qué se dedica?
                </h1>
                <p className="mt-1 text-sm text-nexus-muted">
                  Define qué módulos usa tu negocio en Nexus.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {RUBROS.map((r) => {
                  const sel = datos.rubro === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setDatos((d) => ({ ...d, rubro: r.id }))}
                      className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 text-left transition ${
                        sel
                          ? "border-nexus-gold bg-nexus-gold-soft"
                          : "border-nexus-border bg-nexus-surface hover:border-nexus-gold/50"
                      }`}
                    >
                      <r.icono className={`h-5 w-5 ${sel ? "text-nexus-gold" : "text-nexus-muted"}`} />
                      <span className="text-sm font-medium text-nexus-ink">{r.label}</span>
                      {r.activo && (
                        <span className="rounded-full bg-nexus-gold/15 px-2 py-0.5 text-[10px] font-semibold text-nexus-gold-text">
                          Activo hoy
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3 — PAÍS + MONEDA */}
          {paso === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-nexus-ink">
                  <MapPin className="h-5 w-5 text-nexus-gold" /> ¿Dónde está tu negocio?
                </h1>
                <p className="mt-1 text-sm text-nexus-muted">
                  Nexus formatea todo (precios, fechas, reportes) con esto.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="País">
                  <select
                    value={datos.pais}
                    onChange={(e) => setDatos((d) => ({ ...d, pais: e.target.value }))}
                    className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink focus:border-nexus-gold focus:outline-none focus:ring-2 focus:ring-nexus-gold/20"
                  >
                    {PAISES.map((p) => (
                      <option key={p.codigo} value={p.codigo}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Moneda">
                  <select
                    value={datos.moneda}
                    onChange={(e) => setDatos((d) => ({ ...d, moneda: e.target.value }))}
                    className="w-full rounded-md border border-nexus-border bg-nexus-surface px-3 py-2 text-sm text-nexus-ink focus:border-nexus-gold focus:outline-none focus:ring-2 focus:ring-nexus-gold/20"
                  >
                    {MONEDAS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {/* PASO 4 — EQUIPO */}
          {paso === 4 && (
            <div className="space-y-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-nexus-ink">
                  <Users className="h-5 w-5 text-nexus-gold" /> ¿Quién usa Nexus?
                </h1>
                <p className="mt-1 text-sm text-nexus-muted">
                  El dueño siempre ve todo. Acá definís si entra más gente.
                </p>
              </div>
              <div className="grid gap-2.5">
                {EQUIPO.map((op) => {
                  const sel = datos.equipo === op.id;
                  return (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setDatos((d) => ({ ...d, equipo: op.id }))}
                      className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-left transition ${
                        sel
                          ? "border-nexus-gold bg-nexus-gold-soft"
                          : "border-nexus-border bg-nexus-surface hover:border-nexus-gold/50"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-nexus-ink">{op.label}</p>
                        <p className="mt-0.5 text-xs text-nexus-muted">{op.texto}</p>
                      </div>
                      {sel && <Check className="h-5 w-5 shrink-0 text-nexus-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 5 — DOLOR PRIMERO */}
          {paso === 5 && (
            <div className="space-y-5">
              <div>
                <h1 className="flex items-center gap-2 text-lg font-semibold text-nexus-ink">
                  <Target className="h-5 w-5 text-nexus-gold" /> ¿Qué te duele más hoy?
                </h1>
                <p className="mt-1 text-sm text-nexus-muted">
                  Elegí el primero: Nexus lo enfoca desde el día uno.
                </p>
              </div>
              <div className="grid gap-2.5">
                {DOLORES.map((d) => {
                  const sel = datos.dolor === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDatos((s) => ({ ...s, dolor: d.id }))}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                        sel
                          ? "border-nexus-gold bg-nexus-gold-soft"
                          : "border-nexus-border bg-nexus-surface hover:border-nexus-gold/50"
                      }`}
                    >
                      <Target className={`mt-0.5 h-5 w-5 shrink-0 ${sel ? "text-nexus-gold" : "text-nexus-muted"}`} />
                      <div>
                        <p className="text-sm font-semibold text-nexus-ink">{d.titulo}</p>
                        <p className="mt-0.5 text-xs text-nexus-muted">{d.texto}</p>
                      </div>
                      {sel && <Check className="ml-auto h-5 w-5 shrink-0 text-nexus-gold" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 6 — RESUMEN + GUARDADO */}
          {paso === TOTAL && (
            <Resumen datos={datos} />
          )}

          {/* Navegación */}
          {paso > 0 && paso < TOTAL && (
            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={atras}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-nexus-muted transition hover:bg-nexus-surface-alt hover:text-nexus-ink"
              >
                <ArrowLeft className="h-4 w-4" /> Atrás
              </button>
              <Button size="lg" onClick={siguiente} disabled={!puedeSeguir} className="min-w-[150px]">
                {paso === TOTAL - 1 ? "Ver resumen" : "Siguiente"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-nexus-muted">
          Nexus es el punto de unión entre tu negocio y sus datos: registrás, cobrás, decidís.
        </p>
      </div>
    </main>
  );
}

function Intro({ onEmpezar }: { onEmpezar: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nexus-gold/15">
        <Sparkles className="h-6 w-6 text-nexus-gold" />
      </div>

      <h1 className="text-xl font-bold leading-snug text-nexus-ink">
        ¿Sabés si perdiste plata
        <br />
        el mes pasado?
      </h1>

      <div className="space-y-1.5 text-sm text-nexus-muted">
        <p>¿Quién te debe hoy? ¿Cuánto entra y cuánto sale este mes?</p>
        <p className="font-medium text-nexus-ink">Si lo tenés que pensar, Nexus es para tu negocio.</p>
      </div>

      <div className="rounded-xl border border-nexus-gold/30 bg-nexus-gold-soft p-4 text-left">
        <p className="text-sm font-semibold text-nexus-ink">NEXUS es la solución</p>
        <p className="mt-1 text-xs text-nexus-muted">
          Registrás lo que entra y sale, cobrás sin dejar deudas sueltas y decidís con datos
          reales. Sin Excel, sin papel, sin adivinar. Primero armamos tu negocio — 5 minutos —
          y después te mostramos el panel con una guía.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={onEmpezar}>
        Empezá · 5 minutos <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}

function Resumen({ datos }: { datos: Datos }) {
  const rubro = RUBROS.find((r) => r.id === datos.rubro)?.label ?? "Otro negocio";
  const pais = PAISES.find((p) => p.codigo === datos.pais)?.nombre ?? datos.pais;
  const equipo = datos.equipo === "equipo" ? "Yo y mi equipo" : "Solo yo";
  const dolor = DOLORES.find((d) => d.id === datos.dolor)?.titulo ?? "—";

  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-nexus-gold/15">
          <Rocket className="h-6 w-6 text-nexus-gold" />
        </div>
        <h1 className="mt-3 text-lg font-semibold text-nexus-ink">Tu negocio ya está en Nexus</h1>
        <p className="mt-1 text-sm text-nexus-muted">
          Revisá que esté todo bien — después podés cambiarlo.
        </p>
      </div>

      <dl className="divide-y divide-nexus-border/70 rounded-xl border border-nexus-border bg-nexus-surface">
        {[
          ["Negocio", datos.nombre],
          ["Rubro", rubro],
          ["Ubicación", `${pais} · ${datos.moneda}`],
          ["Equipo", equipo],
          ["Primer foco", dolor],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs font-medium uppercase tracking-wide text-nexus-muted">{k}</dt>
            <dd className="text-sm font-medium text-nexus-ink">{v}</dd>
          </div>
        ))}
      </dl>

      {/* El guardado real lo hace la server action: guardarOnboarding → /?tour=1 */}
      <form action={guardarOnboarding}>
        <input type="hidden" name="nombre" value={datos.nombre} />
        <input type="hidden" name="rubro" value={datos.rubro} />
        <input type="hidden" name="pais" value={datos.pais} />
        <input type="hidden" name="moneda" value={datos.moneda} />
        <input type="hidden" name="equipo" value={datos.equipo} />
        <input type="hidden" name="dolor" value={datos.dolor} />
        <Button type="submit" size="lg" className="w-full">
          Entrar a Nexus <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
      <p className="text-center text-xs text-nexus-muted">
        Al entrar te mostramos el panel con una guía paso a paso.
      </p>
    </div>
  );
}