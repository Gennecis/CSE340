INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;
DELETE FROM public.account WHERE account_id = 1;

UPDATE public.inventory SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior') WHERE inv_id = 10;

SELECT inv.inv_make, inv.inv_model, class.classification_name
FROM public.inventory inv
INNER JOIN public.classification class ON inv.classification_id = class.classification_id
WHERE class.classification_name = 'Sport';

UPDATE public.inventory SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'), inv_thumbnail = REPLACE (inv_thumbnail, '/images', '/images/vehicles');