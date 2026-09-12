# ROADMAP — Prototipo Gym (rama `gym/prototipo`)

> Visión a futuro de Nexus, aterrizada primero en un prototipo a la medida de
> un gimnasio real: **Clientes + Pagos + Gráficas + Gastos**, sin datos falsos
> y con formularios reales desde el día uno.
> Última actualización: 2026-09-12 · Autor: NexusAI (validado por el CEO).

---

## 1. Contexto y decisión

- **Problema detectado**: cuando un negocio nacía en Nexus se sentía vacío e
  incompleto ("módulo en construcción"), como si pidiera permiso. Un negocio
  arranca con lo básico: **registrar clientes, cobrarles, ver los números**.
- **Decisión (CEO, 2026-09-12)**: prototipo funcional para un solo gimnasio,
  hecho "a su medida", para impresionar y validar el flujo real. Nada de
  catálogo de módulos, nada de consola global, nada de datos inventados.
- Esta rama es **demostrable**: se entra con una cuenta, se registra un socio,
  se le cobra una membresía y el dashboard reacciona solo.

## 2. Lo que ya existe en esta rama (funcionando)

| Área | Estado |
| --- | --- |
| Alta de clientes (perfil: cédula, teléfono, correo, cumpleaños, nota) | ✅ |
| Membresías: planes (nombre, precio, días) | ✅ |
| Cobro de membresía → extiende el vencimiento del socio | ✅ |
| Estado del socio derivado: Activo / Vencido / Congelado (se auto-marca) | ✅ |
| Anulación de pagos y gastos con motivo (nada se borra) | ✅ |
| Gastos por categoría (arriendo, nómina, servicios, mantenimiento, publicidad) | ✅ |
| Dashboard: ingresos, gastos, balance, activos, vencidos, renovaciones próximas | ✅ |
| Gráficas con filtro **última semana / mes / año** | ✅ |
| Renovaciones próximas (7 días) con atajo "Cobrar" | ✅ |
| Login/registro de cuenta | ✅ |

Base de datos real (Postgres local), cero mocks: cada número sale de un query.

## 3. Fases a futuro

### Fase 1 — Endurecer el prototipo (siguiente)
- [ ] Editar perfil de cliente (hoy: crear + congelar/reactivar) — el form de edición ya existe en `acciones-gym.ts`, falta pantalla.
- [ ] Búsqueda por teléfono/nombre completa (ya está, pulir UX).
- [ ] Filtro de estado en la lista de clientes (Todos / Activos / Vencidos / Congelados).
- [ ] Exportar movimientos a CSV/Excel (auditoría del dueño).
- [ ] Rango personalizado (desde/hasta) además de semana/mes/año.

### Fase 2 — Cobro digital (el dueño lo pidió explícitamente)
- [ ] Pasar la rama a producción con un dominio propio y HTTPS.
- [ ] **PSE** (Colombia) como pasarela de pago en línea.
- [ ] **Stripe** como alternativa internacional (tarjeta + link de pago por WhatsApp).
- [ ] Link de pago directo para renovar sin registrar a mano: el socio recibe el
      link, paga, y Nexus registra el cobro y extiende la membresía automáticamente.
- [ ] Recordatorios de vencimiento por WhatsApp/e-mail (cron que consulta
      `periodoFin` de los próximos 3 días).

### Fase 3 — Perfil y autoservicio del socio
- [ ] Habilitar el "perfil del cliente" (login del socio con su correo):
      ver su membresía, su historial, su fecha de vencimiento.
- [ ] Renovación self-service: pagar desde el perfil (integra con Fase 2).
- [ ] Carnet digital con QR (código del socio) para el ingreso al gym.

### Fase 4 — Operación del negocio
- [ ] Asistencia / control de ingresos al gym (scan del QR del carnet).
- [ ] Facturación electrónica (factura de cada pago, según normativa CO).
- [ ] Múltiples sedes del mismo gym (misma marca, orgs separadas).

### Fase 5 — De vuelta a la plataforma (cuando el prototipo valide)
- [ ] Extraer de este prototipo el **núcleo de negocio base** que todo negocio
      necesita (clientes + cobros + gastos + dashboard).
- [ ] A partir de ahí, re-añadir el catálogo de módulos (caja, inventario,
      nómina, turnos…) sobre la base ya validada.
- [ ] Registrar datos sueltos del prototipo como ideas en el vault para
      decidir el destino de la demo (demo/gym congelada).

## 4. No hacer (por ahora)
- Consola global / multi-negocio / explorar módulos: esclavo del prototipo gym.
- Datos semilla inventados: la base arranca en cero y crece con uso real.
- Eliminar registros: todo cobro y gasto se **anula**, nunca se borra
  (auditoría del dueño).

## 5. Métricas de éxito del prototipo
1. Un dueño sin manual registra un socio y le cobra en < 1 minuto.
2. El dashboard muestra números que coinciden con los cobros reales.
3. Cero pantallas "en construcción" en el flujo del dueño.