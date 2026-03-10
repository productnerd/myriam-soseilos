
-- Fix the random assignment to ensure each sidequest gets a different random image

-- Create a temporary function to assign random images
DO $$
DECLARE
    quest_record RECORD;
    random_image TEXT;
    random_icon TEXT;
BEGIN
    -- Loop through each sidequest and assign a random image and icon
    FOR quest_record IN SELECT id FROM sidequests LOOP
        -- Get a random image from background-images bucket
        SELECT name INTO random_image
        FROM storage.objects 
        WHERE bucket_id = 'background-images' 
            AND name IS NOT NULL
        ORDER BY RANDOM() 
        LIMIT 1;
        
        -- Get a random icon from icon-images bucket
        SELECT name INTO random_icon
        FROM storage.objects 
        WHERE bucket_id = 'icon-images' 
            AND name IS NOT NULL
        ORDER BY RANDOM() 
        LIMIT 1;
        
        -- Update this specific sidequest
        UPDATE sidequests 
        SET 
            image = random_image,
            icon = random_icon
        WHERE id = quest_record.id;
    END LOOP;
END $$;
