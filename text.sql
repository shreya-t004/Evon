CREATE TABLE attendee (
    name VARCHAR(255) NOT NULL,
    no VARCHAR(255) NOT NULL,
    dob VARCHAR(255) NOT NULL,
    city VARCHAR(255),
    event1 VARCHAR(255) NOT NULL,
    event1pt VARCHAR(255),
    event2 VARCHAR(255),
    event2pt VARCHAR(255),
    tshirt VARCHAR(255) NOT NULL,
    shorts VARCHAR(255) NOT NULL,
    food VARCHAR(255) NOT NULL,
    drinks VARCHAR(255),
    stay VARCHAR(255) NOT NULL,
    refid VARCHAR(255) NOT NULL
);

CREATE TABLE ranking (
    name VARCHAR(255) NOT NULL,
    no VARCHAR(255) NOT NULL,
    event VARCHAR(255) NOT NULL,
    eventpt VARCHAR(255),
    ranks int default 0
);
