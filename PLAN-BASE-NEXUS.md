# PLAN-BASE-NEXUS

> **LOCAL — no sincronizar con el cerebro-remoto (Gitea/homelab) ni commitear hasta que el CEO lo indique.**
> Contenido: BASE NEXUS definitiva (2026-09-12, fuente: vault `03_Conocimiento/sintesis/base-nexus-definitiva.md`) + **sistema de afiliados** (sección nueva, orden del CEO).
> Estado: plan conceptual — **no tocar código** hasta validación.

---

# BASE NEXUS — Síntesis definitiva (antes de tocar código)

## 0. El problema que esta base resuelve

Nexus se sentía fragmentado porque se diseñaba por organización/cliente (gym a medida, caja menor a medida) en vez de por producto. La raíz: se mezclaban niveles conceptuales. Separarlos en 4 niveles lo arregla.

## 1. Vocabulario — 4 niveles que NO se mezclan

| Nivel | Qué es | Ejemplo |
|---|---|---|
| **NEXUS** | La marca | Nexus |
| **Campo** | Taxonomía interna (monorepo/vault) | Finance, Services |
| **Módulo** | Producto reutilizable, se construye una vez | Caja Menor, Gym |
| **Organización** | Cliente real que activa módulos | Casa Museo Pozón, Zona Rosa |

**Regla de oro:** el cliente solo ve NEXUS y módulos. Los campos son plomería interna. Organización y módulo no compiten: uno es el producto, el otro es quién lo usa.

## 2. Qué es Nexus

- **Identidad de marca**: el punto de unión entre un negocio y sus datos. Todo módulo comparte la promesa: *registrar, cobrar, decidir*.
- **Al cliente le hablás del dolor, no del sistema**: "¿no sabés si perdiste plata el mes pasado?" — nunca "es un sistema operativo", "campos", "nodos".
- Nexus **no es una suite de apps**: es una marca con productos (módulos). Que un cliente contrate un módulo no le muestra el resto de la plomería.

## 3. Estructura interna (código y vault)

- **2 campos hoy**: Finance, Services (taxonomía, no marca).
- **Módulos por campo**:
  - **Finance → Caja Menor** — validado, Casa Museo Pozón pagando
  - **Services → Gym** — validando, demo Zona Rosa en curso
- **Núcleo compartido** (cuenta, organización, roles, suscripción, configuración, reportes) → se construye cuando la repetición real lo pida (regla §9). No abstraer con 1–2 casos.
- **Capacidades transversales (futuro, no módulos)**: Nexus AI (alertas), Automation (WhatsApp/PSE/Stripe), Export/Reportes, canales Mobile.
- **Herramientas internas (no producto)**: Linux/homelab, la IA como tu asistente.

## 4. Roles

| Rol | Qué hace |
|---|---|
| **Dueño / Admin** | Paga, decide, ve todo, gestiona personal |
| **Operador** | Tareas diarias (cobrar, anotar, registrar) — permisos por módulo |
| **Socio / Cliente final** | Atendido por el negocio; perfil habilitable |
| **CEO de Nexus** | Consola global agregada, sin datos sensibles de terceros |
| **Asesor externo** | Contador/coach con acceso acotado |

## 5. Segmentos (prospección, NO se venden)

| Segmento | Descripción |
|---|---|
| Personal | 1 persona |
| Negocio pequeño | 1–5 personas — **ICP actual** |
| Mediano | 5–50, varios procesos |
| Empresarial | 50+ |

## 6. Registro y onboarding "de verdad"

**Registro**: nombre + email + contraseña. La cuenta es la persona.

**Onboarding — 5 pasos, 5 minutos, editable después**:

| Paso | Pregunta |
|---|---|
| 1. Qué es | Nombre del negocio (o "es para mí") |
| 2. Rubro | Gym / restaurante / tienda / taller / constructora / otro (lenguaje del cliente) |
| 3. Lugar | País + moneda (COP, USD) |
| 4. Equipo | "Solo yo" o "yo + emails" |
| 5. Dolor primero | Cobrar mejor / no perder plata / saber cuánto entra y sale |

**Fin**: módulo activo + dashboard funcionando + checklist (clientes → cobro → gasto). Nada de "próximamente".

**No pedir en onboarding**: cédula, dirección, tarjeta, plan, datos sensibles. La tarjeta llega al final del trial; los datos del cliente solo donde se usan.

## 7. Ciclo de vida 0 → 12 meses

| Fase | Qué ve el dueño |
|---|---|
| Registro | Cuenta creada |
| Onboarding | Su negocio + módulo activo + dashboard |
| Semana 1 | Datos reales → dashboard con números reales |
| Mes 1–3 | Módulo funcionando, deja el Excel/cuaderno |
| Mes 3–6 | NexusAI avisa: vencimientos, gastos que suben, conciliación |
| Mes 6–12 | Histórico anual, exportación, Nexus es la rutina |

**Transversal**: el dueño es dueño de SU data (exporta), nada se borra (anulación con motivo), celular primero.

## 8. Diferenciación — en qué liga se gana

- **No competir por features/tamaño** contra Odoo, Zoho, Fresha, Toast — perdés por definición.
- **Ventaja estructural**: negocios locales no modernizados que a un jugador grande no le sale rentable atender uno por uno. Ahí no pueden bajar.
- **Ventaja real hoy**: cercanía, simplicidad, entender el dolor exacto, boca a boca local.
- **"Escalar exponencial" es pregunta para después de 2–3 clientes pagando.** Hoy: medir tiempo-por-cliente y qué se repite, sin forzarlo.

## 9. Regla de expansión de módulos

1. Un módulo nace de un **dolor validado con cliente real** (sistema de ideas / 7 nodos) — no de listas imaginadas.
2. **No abstraer componentes compartidos** hasta tener **2 casos reales** que lo necesiten — mismo patrón que @nexus/ui, que nació de repetición real.
3. **Nombrar y limitar el módulo es lo que permite reutilizarlo** sin estar presente en cada activación. El nombre no ata: libera.

## 10. Campos de caza (prospección)

| Estado | Módulo (campo) |
|---|---|
| Validado, pagando | Caja Menor (Finance) |
| Validando, demo en curso | Gym (Services) |
| Pipeline — entrevista pendiente | Presupuestos · Pedidos |
| Sin contacto real | Restaurante, Café, Tienda |

## 11. Deuda consciente (NO se toca todavía)

- **Pricing/planes** → con 2–3 clientes pagando. No prometer "gratis" ni "paga lo que usas" antes.
- **Auto-configuración** (que el cliente arme su propio sistema) → sin evidencia; el valor hoy es que Nexus resuelve el problema por él.
- **"Services deja de existir" / kit genérico** → pivot de modelo de negocio, no decisión de arquitectura; no se toma sin evidencia.

## 12. Próximos pasos concretos

1. **Cerrar con Zona Rosa** (la demo gym ya está lista y funcionando en `gym/prototipo`).
2. **Entrevistar Constructora y Carpintería** con el guion listo del vault.
3. Con un **segundo caso de dolor repetido**, decidir ahí qué se extrae a componente compartido.
4. **Copy de landing por módulo** (empezar por Caja Menor): dolor → solución específica → simple, sin prometer precio.

---

# 13. Sistema de Afiliados — Programa Embajadores Nexus (público)

> **Idea nueva (2026-09-12, orden del CEO).** Se agrega a la base como estrategia pública de crecimiento.
> **Regla de implementación**: el reconocimiento/visibilidad se puede lanzar en **piloto hoy**; la **recompensa monetaria** se activa cuando exista pricing (§11) — no prometer dinero antes de tener números reales.

## 13.1 Qué es

Un programa público donde **cualquier cliente activo de Nexus (y aliados externos) invita negocios a Nexus** y gana, primero reconocimiento y luego recompensa, por cada referido real. La marca pública del programa: **"Embajadores Nexus"** — suena a club exclusivo, no a "referidos por comisión".

**Por qué encaja con la base:** es el canal natural del boca a boca local (§8) formalizado. No busca volumen masivo: busca **confianza local y clústeres por rubro** (§10) — exactamente donde Nexus gana.

## 13.2 Quién puede ser afiliado

| Tipo | Quién | Qué lo habilita |
|---|---|---|
| **Cliente activo** | Dueño de organización con ≥ 1 mes y datos reales | Habla desde la experiencia — el embajador natural |
| **Aliado externo** | Contador, trainer, coach, proveedor (no paga Nexus) | Conoce el dolor del negocio y lo ve en su red |
| **Restricción** | Uno por organización (lo decide el dueño) | Evita ruido y mantiene la marca limpia |

## 13.3 Cómo un cliente pasa a afiliado (flujo de 6 pasos)

1. **Invitación en el panel** — "Programa Embajadores" aparece para organizaciones activas (no para cualquiera).
2. **Adhesión** — acepta términos (1 link personal, compartir solo donde tiene presencia real, sin spam) y elige su recompensa.
3. **Página pública de recomendación** — "Recomendado por Casa Museo Pozón": mini landing del módulo que usa, con su historia en 3 frases.
4. **El referido entra con su link** — cada invitado queda asignado y visible en el panel del embajador.
5. **Se registra el referido real** — condición: creó cuenta + completó onboarding + primer dato real (nada de cuentas fantasma).
6. **Recompensa** — al primer pago del referido (cuando exista pricing) o al mes 1 con datos reales (hoy: reconocimiento).

## 13.4 Recompensas — hoy vs con pricing

**Hoy (piloto, sin prometer dinero):**
- Badge de **Embajador** en su dashboard.
- **Página pública** con su negocio ("recomendado por…").
- **Early access** a módulos beta (su nombre en la lista de agradecimientos).
- **Canal directo con el CEO** (respuesta en horas, no días).

**Con pricing definido (2–3 clientes pagando):**
- Meses de servicio gratis por cada referido que paga.
- O porcentaje sobre el primer pago del referido.
- Se define con números reales; **no se promete nada antes** (regla §11).

## 13.5 Pautas para ganar más visibilidad

- **Clúster local por rubro**: premiar/priorizar referir dentro del mismo campo (un gym → otro gym). El módulo encaja mejor y la confianza es mayor (§8).
- **Card descargable "Yo uso Nexus"** + historia de 3 líneas lista para WhatsApp; **placa/sticker para el mostrador** (visible, no digital-only).
- **Directorio de negocios Nexus** (con permiso): cada embajador con su página en el sitio → "negocios como el tuyo ya están acá" (prueba social local).
- **Caso de éxito por módulo**: cada referido activo alimenta la landing del módulo (evidencia real, regla §9).
- **Muro de embajadores** en la web pública + badge visible dentro del producto.

## 13.6 Cómo se siente "premium" el cliente

- **Badge dorado** visible en su dashboard (coherente con la estética del sistema: negro + dorado).
- **Número de fundador** de los primeros 5 pagantes — placa permanente.
- **Exclusividad, no descuento barato**: premium = reconocimiento + velocidad de respuesta + pertenencia, no regalar el producto.
- **Early access + lista de agradecimientos**: es de los primeros en cada módulo nuevo.
- **Canal directo con el CEO**: WhatsApp prioritario.

## 13.7 Límites e integridad (nada de basura)

- **Sin spam**: se comparte solo donde hay presencia real; venta de listas o publicidad engañosa = baja del programa.
- **Anti-fraude**: referido = organización nueva real (se cruza email/IP/datos); auto-referencias y cuentas falsas no cuentan.
- **Privacidad**: el embajador NUNCA ve datos de otros negocios; el referido sabe que llegó por un embajador (la página pública lo dice).
- **Un solo nivel, no multinivel**: solo referidos directos; nada de cadenas ni estructuras piramidales (se ve premium y se evita el efecto MLM).

## 13.8 Cuándo se lanza

- **Piloto hoy**: reconocimiento (badge, página, early access, canal CEO) desde el próximo cliente activo — cuesta casi nada y construye cultura desde el inicio.
- **Recompensa monetaria**: al definir pricing (§11). El programa queda aprobado desde ahora como estrategia pública de adquisición.
- **Primera implementación técnica mínima** (cuando se toque código): tabla `Referral`/`Afiliado` en el núcleo (afiliado, referido, estado, recompensa) — entra al schema cuando el piloto tenga 2+ casos reales (regla §9).