/* Replace with your SQL commands */

ALTER TABLE locations
ADD COLUMN created_at TIMESTAMP DEFAULT NOW();

