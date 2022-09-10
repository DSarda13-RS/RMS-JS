/* Replace with your SQL commands */

DROP INDEX IF EXISTS unique_restaurant;

ALTER TABLE locations
DROP COLUMN p_address,
ADD COLUMN p_latitude FLOAT,
ADD COLUMN p_longitude FLOAT;

ALTER TABLE restaurants
DROP COLUMN r_address,
ADD COLUMN r_latitude FLOAT,
ADD COLUMN r_longitude FLOAT;

CREATE UNIQUE INDEX unique_restaurant on restaurants(name,r_latitude,r_longitude)
WHERE archived_at IS NULL;

