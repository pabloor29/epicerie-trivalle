-- Ajouter les champs d'option de poids aux produits
ALTER TABLE products 
ADD COLUMN weight_option BOOLEAN DEFAULT FALSE,
ADD COLUMN weight_min INTEGER DEFAULT 100,
ADD COLUMN weight_max INTEGER DEFAULT 1000,
ADD COLUMN weight_step INTEGER DEFAULT 50;

-- Ajouter les champs de date et heure de retrait aux commandes
ALTER TABLE orders
ADD COLUMN pickup_date DATE,
ADD COLUMN pickup_time VARCHAR(5);

