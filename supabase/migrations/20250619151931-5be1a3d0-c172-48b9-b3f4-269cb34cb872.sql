
-- Update ALL sidequests with random images from background-images bucket
UPDATE sidequests 
SET image = (
  SELECT name 
  FROM storage.objects 
  WHERE bucket_id = 'background-images' 
    AND name IS NOT NULL
  ORDER BY RANDOM() 
  LIMIT 1
);

-- Update ALL sidequests with random images from icon-images bucket  
UPDATE sidequests 
SET icon = (
  SELECT name 
  FROM storage.objects 
  WHERE bucket_id = 'icon-images' 
    AND name IS NOT NULL
  ORDER BY RANDOM() 
  LIMIT 1
);
