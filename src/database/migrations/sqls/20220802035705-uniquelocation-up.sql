/* Replace with your SQL commands */

CREATE UNIQUE INDEX unique_location on locations(pid,p_latitude,p_longitude)
WHERE archived_at IS NULL;

