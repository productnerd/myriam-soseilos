
-- Update sidequests table to replace unsplash URLs with actual uploaded images
-- First, update any existing unsplash URLs with random distribution of new images
UPDATE sidequests 
SET image = '/lovable-uploads/38dfd7de-87aa-4761-a2d6-db66a442eba7.png'
WHERE image LIKE '%unsplash%' AND id = (
  SELECT id FROM sidequests WHERE image LIKE '%unsplash%' ORDER BY created_at LIMIT 1
);

UPDATE sidequests 
SET image = '/lovable-uploads/9a56473b-0d9d-4c71-83a5-6c37506fe0f1.png'
WHERE image LIKE '%unsplash%' AND id = (
  SELECT id FROM sidequests WHERE image LIKE '%unsplash%' ORDER BY created_at OFFSET 1 LIMIT 1
);

UPDATE sidequests 
SET image = '/lovable-uploads/7e851dc3-538f-497d-bdca-b2258332a076.png'
WHERE image LIKE '%unsplash%' AND id = (
  SELECT id FROM sidequests WHERE image LIKE '%unsplash%' ORDER BY created_at OFFSET 2 LIMIT 1
);

UPDATE sidequests 
SET image = '/lovable-uploads/e80b3c9e-dee2-41a8-af64-b9c21f47e0e6.png'
WHERE image LIKE '%unsplash%' AND id = (
  SELECT id FROM sidequests WHERE image LIKE '%unsplash%' ORDER BY created_at OFFSET 3 LIMIT 1
);

UPDATE sidequests 
SET image = '/lovable-uploads/c73bd839-e361-47a4-9955-20882b9bcb18.png'
WHERE image LIKE '%unsplash%' AND id = (
  SELECT id FROM sidequests WHERE image LIKE '%unsplash%' ORDER BY created_at OFFSET 4 LIMIT 1
);

-- Update any remaining unsplash URLs
UPDATE sidequests 
SET image = '/lovable-uploads/38dfd7de-87aa-4761-a2d6-db66a442eba7.png'
WHERE image LIKE '%unsplash%';

-- Add images to any sidequests that don't have images yet
UPDATE sidequests 
SET image = '/lovable-uploads/9a56473b-0d9d-4c71-83a5-6c37506fe0f1.png'
WHERE image IS NULL OR image = '';
