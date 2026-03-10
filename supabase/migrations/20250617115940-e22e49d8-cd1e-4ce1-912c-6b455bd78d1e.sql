
-- Update sidequests table to add icons from the newly uploaded images
-- Add icons to sidequests that don't have icons yet, distributing the new images
UPDATE sidequests 
SET icon = '/lovable-uploads/1398ecfb-70eb-447d-af40-8f17875cf1fb.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/739498f5-a508-43fb-8b53-89eecb10c5c2.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 1 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/8cd05917-4562-4200-b686-edd29888ff53.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 2 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/9cd80250-78ba-420f-997f-f489e206d6c3.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 3 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/06c623f3-18b1-4207-aabf-532f30f512a6.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 4 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/effab263-b94e-4de1-9650-67276bd5dc09.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 5 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/9e5e4d13-8a3c-43cf-84e0-caccbf669cf8.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 6 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/7da4d78c-c0a9-4197-a6d5-4e7afe32b06b.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 7 LIMIT 1
);

UPDATE sidequests 
SET icon = '/lovable-uploads/54a18f35-0359-434f-bbea-f2534ea64276.png'
WHERE (icon IS NULL OR icon = '') AND id IN (
  SELECT id FROM sidequests WHERE (icon IS NULL OR icon = '') ORDER BY created_at OFFSET 8 LIMIT 1
);

-- For any remaining sidequests without icons, cycle through the first few images
UPDATE sidequests 
SET icon = '/lovable-uploads/1398ecfb-70eb-447d-af40-8f17875cf1fb.png'
WHERE icon IS NULL OR icon = '';
