CREATE TYPE public.account_type AS ENUM
    ('Client', 'Employee', 'Admin');
	
CREATE TABLE public.classification (
classification_id INT GENERATED BY DEFAULT AS IDENTITY,
classification_name CHARACTER VARYING NOT NULL,
CONSTRAINT classification_pk PRIMARY KEY (classification_id)
);

CREATE TABLE IF NOT EXISTS public.inventory (
inv_id INT NOT NULL GENERATED BY DEFAULT AS IDENTITY,
inv_make CHARACTER VARYING NOT NULL,
inv_model CHARACTER VARYING NOT NULL,
inv_year CHARACTER(4) NOT NULL,
inv_description text NOT NULL,
inv_image CHARACTER VARYING NOT NULL,
inv_thumbnail CHARACTER VARYING NOT NULL,
inv_price numeric(9,0) NOT NULL,
inv_miles INT NOT NULL,
inv_color CHARACTER VARYING NOT NULL,
classification_id INT NOT NULL,
CONSTRAINT inventory_pkey PRIMARY KEY (inv_id)
);

-- Create relationship between classification and inventory tables
ALTER TABLE IF EXISTS public.inventory
	ADD CONSTRAINT fk_classification FOREIGN KEY (classification_id)
	REFERENCES public.classification (classification_id) MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE NO ACTION;


-- Table structure for table `account`
CREATE TABLE IF NOT EXISTS public.account
(
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type account_type NOT NULL DEFAULT 'Client'::account_type,
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
);


INSERT INTO public.classification (classification_name)
VALUES ('Customs'), ('Sports'), ('SUV'), ('Truck'), ('Sedan');

-- 6-The inv_image and inv_thumbnail update query works
update public.inventory
set inv_image = replace(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = replace(inv_thumbnail, '/images/', '/images/vehicles/')
where inv_image like '/images/%' or inv_thumbnail like '/images/%';

