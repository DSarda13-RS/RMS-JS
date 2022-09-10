/* Replace with your SQL commands */

ALTER TABLE sessions
ALTER COLUMN end_time SET DEFAULT NOW() + INTERVAL '30minutes';
