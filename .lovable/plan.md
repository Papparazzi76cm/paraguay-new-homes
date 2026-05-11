## Flujo de onboarding tras verificación de email

### 1. Datos de la empresa (paso obligatorio)
Crear tabla `developer_profiles` con datos completos:
- Razón social, RUC/CI, dirección fiscal, ciudad, país
- Teléfono de contacto, web, descripción
- Logo (subida a bucket `developer-logos`)
- Persona responsable (nombre, cargo, email)
- Plan seleccionado (`basico` / `profesional` / `premium`) — leído de `localStorage`
- Estado de onboarding (`pending_company` / `pending_payment` / `complete`)

RLS: el desarrollador solo puede ver/editar su propio registro; admins ven todos.

### 2. Medio de pago con cargo 0 (autorización + trial)
Cuando el desarrollador completa el formulario, se redirige al checkout integrado de Stripe en **modo suscripción con `trial_period_days: 30`**:
- Stripe pide un medio de pago válido
- No realiza cargo durante los 30 días de prueba
- Al finalizar el trial, cobra automáticamente el plan elegido
- El desarrollador puede cancelar gratis dentro del periodo de prueba

Para esto, modificar `create-checkout` para aceptar `trialDays` y propagarlo a `subscription_data.trial_period_days`. El webhook ya existente guardará la suscripción en estado `trialing` con `current_period_end` = fin del trial.

### 3. Ruta y redirecciones
- Nueva ruta `/developer/onboarding` con dos pasos visuales (Empresa → Medio de pago)
- Tras login/verificación de email, si el desarrollador no tiene `developer_profiles` completo o no tiene fila en `subscriptions`, se redirige automáticamente a `/developer/onboarding`
- Una vez completado, redirige a `/developer`

### 4. Banner de prueba
Actualizar `TrialBanner` para leer la fecha real desde `subscriptions.current_period_end` (en estado `trialing`) en lugar de `profiles.created_at`, así refleja la fecha exacta del primer cobro.

### Detalles técnicos
- Migración: tabla `developer_profiles` + RLS + trigger `updated_at`
- Edge function `create-checkout`: añadir parámetro opcional `trialDays`
- Frontend nuevo: `src/pages/developer/Onboarding.tsx` con formulario zod + checkout embebido
- Hook `useDeveloperOnboardingStatus` para gating de rutas
- Guard en `DeveloperLayout` que fuerza onboarding si está incompleto
- `Auth.tsx`: tras detectar sesión de desarrollador, redirigir a `/developer/onboarding` si falta data
- `TrialBanner.tsx`: cambiar fuente de fecha a tabla `subscriptions`

### Lo que NO cambia
- Los botones de planes en `/para-promotores` siguen llevando a registro (ya implementado)
- No se cobra nada durante los 30 días — Stripe solo valida la tarjeta

¿Confirmás para implementarlo así?