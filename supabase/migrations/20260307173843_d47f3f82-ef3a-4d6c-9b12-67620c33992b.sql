
ALTER TABLE public.projects
ADD COLUMN programa_financiacion text DEFAULT NULL,
ADD COLUMN tipo_financiacion text DEFAULT NULL,
ADD COLUMN precio_financiable numeric DEFAULT NULL,
ADD COLUMN cuota_estimativa numeric DEFAULT NULL,
ADD COLUMN entidad_financiera text DEFAULT NULL,
ADD COLUMN plazo_maximo integer DEFAULT NULL,
ADD COLUMN subsidio_estado boolean DEFAULT false;
