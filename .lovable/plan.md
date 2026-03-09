

## Diagnóstico

El problema es claro: cuando un usuario ya autenticado (ej: admin) hace clic en "Publicar Proyecto", navega a `/auth?role=developer`. La página `Auth.tsx` tiene un `useEffect` que detecta la sesión existente e inmediatamente redirige según el rol actual del usuario — al admin lo manda a `/admin`, y a un usuario normal a `/`. Nunca llega a ver el formulario de registro.

Esto también afecta a desarrolladores ya logueados: los redirige a `/developer` en vez de permitirles crear un proyecto.

## Solución

Modificar el botón "Publicar Proyecto" en `Navbar.tsx` y `CtaBanner.tsx` para que sea inteligente según el estado del usuario:

| Estado del usuario | Destino al hacer clic |
|---|---|
| No autenticado | `/auth?role=developer` (registro como desarrollador) |
| Ya es developer | `/developer/projects/new` (crear proyecto directo) |
| Es admin | `/admin/projects/new` (crear proyecto desde admin) |
| Usuario normal | `/auth?role=developer` (que se registre como dev) |

### Archivos a modificar

1. **`src/components/Navbar.tsx`** — Reemplazar los dos `<Link to="/auth?role=developer">` por lógica condicional que use `user`, `isAdmin`, `isDeveloper` (ya disponibles en el componente) para elegir la ruta correcta.

2. **`src/components/CtaBanner.tsx`** — Mismo cambio: importar `useAuth`, `useIsAdmin`, `useIsDeveloper` y aplicar la misma lógica al `onClick` del botón.

3. **`src/pages/Auth.tsx`** — En el `useEffect` de detección de sesión, respetar el parámetro `?role=developer`: si el usuario ya está logueado pero NO es developer, no redirigir inmediatamente sino mostrar un mensaje indicando que necesita registrarse como desarrollador, o redirigir a una página informativa.

