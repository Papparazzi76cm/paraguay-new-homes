

## Entendido: Simplificar la lógica del botón "Publicar Proyecto"

Dado que el admin nunca usa la web desplegada, no necesitamos la rama de admin. Solo hay dos casos reales en producción:

| Usuario en web desplegada | Destino |
|---|---|
| Developer logueado | `/developer/projects/new` |
| Cualquier otro (no logueado o usuario normal) | `/auth?role=developer` |

### Cambios

**`src/components/Navbar.tsx`** (líneas 81 y 122)
- Reemplazar la lógica ternaria triple por: `isDeveloper ? "/developer/projects/new" : "/auth?role=developer"`
- Eliminar la dependencia de `isAdmin` en esas líneas

**`src/components/CtaBanner.tsx`** (línea 20)
- Mismo cambio: `isDeveloper ? "/developer/projects/new" : "/auth?role=developer"`
- Eliminar `useIsAdmin` import y uso (ya no se necesita en este componente)

**`src/pages/Auth.tsx`** — En el `useEffect` de detección de sesión (que redirige si ya hay sesión):
- Si hay sesión y el parámetro `?role=developer` está presente, NO redirigir automáticamente. Dejar que el usuario vea la página o, si ya es developer, redirigir a `/developer/projects/new`
- Esto evita el loop: usuario no-dev hace clic → va a `/auth?role=developer` → la sesión lo expulsa → vuelve a `/`

Son 3 archivos, cambios mínimos en cada uno.

