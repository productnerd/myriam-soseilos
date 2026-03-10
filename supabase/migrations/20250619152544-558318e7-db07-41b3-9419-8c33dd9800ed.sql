
-- Update ALL sidequests with random images from background-images bucket
-- This will assign different random images to each record
UPDATE sidequests 
SET image = (
  SELECT name 
  FROM storage.objects 
  WHERE bucket_id = 'background-images' 
    AND name IS NOT NULL
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE id IN (SELECT id FROM sidequests);

-- Update ALL sidequests with random icons from icon-images bucket  
-- This will assign different random icons to each record
UPDATE sidequests 
SET icon = (
  SELECT name 
  FROM storage.objects 
  WHERE bucket_id = 'icon-images' 
    AND name IS NOT NULL
  ORDER BY RANDOM() 
  LIMIT 1
)
WHERE id IN (SELECT id FROM sidequests);
