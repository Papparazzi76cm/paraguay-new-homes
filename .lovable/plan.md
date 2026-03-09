

## Problema encontrado

El bug está en la línea 29 de `DeveloperLayout.tsx`. El `useEffect` de redirección comprueba `authLoading || roleLoading`, pero NO comprueba `setupDone`. 

Cuando `setupDone` es `false`, el hook `useIsDeveloper` recibe `undefined` como userId, lo que hace que `roleLoading` sea `false` inmediatamente (no hay nada que cargar). Resultado: el efecto pasa el guard, ve `isDeveloper: false` y redirige a `/` **antes** de que el setup termine y el rol se verifique.

La línea 41 muestra un loader cuando `!setupDone`, pero el `useEffect` de la línea 28 ya ha disparado `navigate("/")` antes de que el componente se renderice.

## Solución

Un cambio de una línea en `src/components/developer/DeveloperLayout.tsx`:

**Línea 29**: Añadir `!setupDone` al guard del useEffect de redirección:

```ts
if (authLoading || !setupDone || roleLoading) return;
```

Esto asegura que no se tome ninguna decisión de redirección hasta que:
1. La autenticación haya cargado
2. El `ensure_user_setup` haya terminado
3. El rol haya sido verificado

