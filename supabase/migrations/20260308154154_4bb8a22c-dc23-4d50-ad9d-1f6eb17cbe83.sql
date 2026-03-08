-- Fix IDESA projects developer name
UPDATE projects SET developer_name = 'IDESA' WHERE developer_name = 'Inmobiliaria del Este';

-- Delete placeholder projects from fake developers
DELETE FROM project_images WHERE project_id IN (
  SELECT id FROM projects WHERE developer_name IN (
    'Capital Towers SA', 'CDE Developers', 'Constructora Guaraní', 'Desarrollos Premium',
    'EcoVerde Desarrollos', 'Grupo Constructor PY', 'Grupo Lago SA', 'Inmobiliaria Sol SA',
    'Paraná Desarrollos', 'Urban Dev PY'
  )
);

DELETE FROM project_units WHERE project_id IN (
  SELECT id FROM projects WHERE developer_name IN (
    'Capital Towers SA', 'CDE Developers', 'Constructora Guaraní', 'Desarrollos Premium',
    'EcoVerde Desarrollos', 'Grupo Constructor PY', 'Grupo Lago SA', 'Inmobiliaria Sol SA',
    'Paraná Desarrollos', 'Urban Dev PY'
  )
);

DELETE FROM contact_leads WHERE project_id IN (
  SELECT id FROM projects WHERE developer_name IN (
    'Capital Towers SA', 'CDE Developers', 'Constructora Guaraní', 'Desarrollos Premium',
    'EcoVerde Desarrollos', 'Grupo Constructor PY', 'Grupo Lago SA', 'Inmobiliaria Sol SA',
    'Paraná Desarrollos', 'Urban Dev PY'
  )
);

DELETE FROM projects WHERE developer_name IN (
  'Capital Towers SA', 'CDE Developers', 'Constructora Guaraní', 'Desarrollos Premium',
  'EcoVerde Desarrollos', 'Grupo Constructor PY', 'Grupo Lago SA', 'Inmobiliaria Sol SA',
  'Paraná Desarrollos', 'Urban Dev PY'
);