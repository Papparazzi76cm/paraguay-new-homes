

## Plan: Proyecto TOP del Mes en el Hero

### Concepto
Reemplazar la imagen estática del hero por la imagen de portada de un "Proyecto TOP del mes", configurable desde la base de datos. El hero mostrará un badge destacado "PROYECTO TOP DEL MES", el nombre del proyecto/desarrolladora, y un botón CTA directo al proyecto. La SearchBar y las stats se mantienen.

### Cambios necesarios

#### 1. Base de datos — Nueva tabla `site_settings`
Tabla simple clave-valor para almacenar la configuración del proyecto top del mes:
- `key` (text, PK) — e.g. `"hero_project_slug"`
- `value` (text) — e.g. `"aether-civis"`
- `updated_at` (timestamptz)

RLS: lectura pública, escritura solo admins. Esto permite que un admin (tú) actualice el slug del proyecto top cada mes sin tocar código.

#### 2. Hook `useHeroProject`
Nuevo hook que:
1. Lee `site_settings` para obtener el slug del proyecto top
2. Hace fetch del proyecto por slug desde `projects`
3. Retorna el proyecto con su `cover_image_url`, `title`, `slug`, `developer_name`

#### 3. Modificar `Hero.tsx`
- Usar `useHeroProject()` para obtener el proyecto top
- Si existe, usar `cover_image_url` como imagen de fondo en lugar de `hero-building.jpg`
- Añadir un bloque CTA animado debajo del subtítulo (antes de SearchBar) con:
  - Badge dorado/accent: **"⭐ PROYECTO TOP DEL MES"**
  - Nombre del proyecto y desarrolladora
  - Botón `Link` → `/proyecto/{slug}` con texto "Ver Proyecto"
- Si no hay proyecto top configurado, mantener el hero actual como fallback

#### 4. Migración SQL
```sql
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
-- Lectura pública
CREATE POLICY "Site settings are publicly readable" ON public.site_settings FOR SELECT TO public USING (true);
-- Solo admins pueden modificar
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

-- Insertar proyecto top inicial (se actualizará cada mes)
INSERT INTO public.site_settings (key, value) VALUES ('hero_project_slug', '');
```

### Diseño visual del CTA en el Hero

```text
┌─────────────────────────────────────────────┐
│  [Navbar]                                   │
│                                             │
│     🏷️ Obra nueva en Paraguay               │
│     Encontrá tu próximo hogar               │
│     Subtitle text                           │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │ ⭐ PROYECTO TOP DEL MES             │    │
│  │ Nombre Proyecto — Desarrolladora    │    │
│  │        [ Ver Proyecto → ]           │    │
│  └─────────────────────────────────────┘    │
│                                             │
│     [SearchBar filters]                     │
│     120+ Proyectos  |  35 Devs  |  8 Cities │
└─────────────────────────────────────────────┘
  Background: cover_image_url del proyecto top
```

### Archivos a crear/editar
- **Crear**: migración SQL para `site_settings`
- **Crear**: `src/hooks/useHeroProject.ts`
- **Editar**: `src/components/Hero.tsx` — integrar proyecto top con CTA y imagen dinámica

