---
name: alta-promotora-con-proyectos
description: Al añadir proyectos de una promotora no listada, crear también su cuenta de desarrolladora y vincular sus proyectos
type: preference
---
Cuando el usuario pida introducir proyectos de una empresa promotora que NO esté ya listada en la plataforma:
1. Crear automáticamente su cuenta de desarrolladora (auth user + profile + user_roles 'developer' + developer_profiles con onboarding_status='complete' y plan adecuado).
2. Usar todos los datos reales proporcionados (nombre legal, RUC, dirección, ciudad, teléfono, email corporativo, web, logo). Si falta el email, usar uno coherente con su dominio.
3. Generar contraseña con patrón [Nombre]2024!.
4. Vincular todos los proyectos creados a esa cuenta vía projects.developer_id.
5. Informar al usuario las credenciales generadas al finalizar.

**Why:** Flujo estándar definido por el usuario para mantener consistencia y que cada promotora tenga acceso autónomo a su panel.
