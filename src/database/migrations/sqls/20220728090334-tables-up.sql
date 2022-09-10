/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS person
(
    pid          SERIAL PRIMARY KEY,
    name         TEXT,
    email        TEXT,
    password     TEXT,
    is_user      BOOLEAN   DEFAULT false,
    is_sub_admin BOOLEAN   DEFAULT false,
    is_admin     BOOLEAN   DEFAULT false,
    created_by   INT       DEFAULT 0,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP,
    archived_at  TIMESTAMP
);

CREATE UNIQUE INDEX unique_person on person(email)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS locations
(
    lid         SERIAL PRIMARY KEY,
    p_address   TEXT,
    pid         INT REFERENCES person (pid) NOT NULL,
    updated_at  TIMESTAMP,
    archived_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants
(
    rid         SERIAL PRIMARY KEY,
    name        TEXT,
    r_address   TEXT,
    password    TEXT,
    created_by  INT REFERENCES person (pid) NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP,
    archived_at TIMESTAMP
);

CREATE UNIQUE INDEX unique_restaurant on restaurants(name,r_address)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS dishes
(
    did         SERIAL PRIMARY KEY,
    name        TEXT,
    price       INT,
    rid         INT REFERENCES restaurants (rid) NOT NULL,
    created_by  INT REFERENCES person (pid)      NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP,
    archived_at TIMESTAMP
);

CREATE UNIQUE INDEX unique_dish on dishes(name)
WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS sessions
(
    sid        SERIAL PRIMARY KEY,
    pid        INT REFERENCES person (pid) NOT NULL,
    start_time TIMESTAMP DEFAULT NOW(),
    end_time   TIMESTAMP,
    is_ended   BOOLEAN   DEFAULT false
);
