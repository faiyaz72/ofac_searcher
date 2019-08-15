CREATE SCHEMA IF NOT EXISTS ofac;

DROP TABLE IF EXISTS ofac."ALT";

CREATE TABLE ofac."ALT"
(
    ent_num integer,
    alt_num integer NOT NULL,
    alt_type character varying COLLATE pg_catalog."default",
    alt_name character varying COLLATE pg_catalog."default",
    alt_remarks character varying COLLATE pg_catalog."default",
    CONSTRAINT "ALT_pkey" PRIMARY KEY (alt_num)
);

DROP TABLE IF EXISTS ofac."CONS_ALT";

CREATE TABLE ofac."CONS_ALT"
(
    ent_num integer,
    alt_num integer NOT NULL,
    alt_type character varying COLLATE pg_catalog."default",
    alt_name character varying COLLATE pg_catalog."default",
    alt_remarks character varying COLLATE pg_catalog."default",
    CONSTRAINT "CONS_ALT_pkey" PRIMARY KEY (alt_num)
);

DROP TABLE IF EXISTS ofac."CONS_PRIM";

CREATE TABLE ofac."CONS_PRIM"
(
    ent_num integer NOT NULL,
    sdn_name character varying COLLATE pg_catalog."default",
    sdn_type character varying COLLATE pg_catalog."default",
    program character varying COLLATE pg_catalog."default",
    title character varying COLLATE pg_catalog."default",
    call_sign character varying COLLATE pg_catalog."default",
    vess_type character varying COLLATE pg_catalog."default",
    tonnage character varying COLLATE pg_catalog."default",
    grt character varying COLLATE pg_catalog."default",
    vess_flag character varying COLLATE pg_catalog."default",
    vess_owner character varying COLLATE pg_catalog."default",
    remarks character varying COLLATE pg_catalog."default",
    CONSTRAINT "CONS_PRIM_pkey" PRIMARY KEY (ent_num)
);

DROP TABLE IF EXISTS ofac."SDN";

CREATE TABLE ofac."SDN"
(
    ent_num integer NOT NULL,
    sdn_name character varying COLLATE pg_catalog."default",
    sdn_type character varying COLLATE pg_catalog."default",
    program character varying COLLATE pg_catalog."default",
    title character varying COLLATE pg_catalog."default",
    call_sign character varying COLLATE pg_catalog."default",
    vess_type character varying COLLATE pg_catalog."default",
    tonnage character varying COLLATE pg_catalog."default",
    grt character varying COLLATE pg_catalog."default",
    vess_flag character varying COLLATE pg_catalog."default",
    vess_owner character varying COLLATE pg_catalog."default",
    remarks character varying COLLATE pg_catalog."default",
    CONSTRAINT "SDN_pkey" PRIMARY KEY (ent_num)
);