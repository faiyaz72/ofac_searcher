SET search_path TO ofac;

DELETE FROM ofac."ALT";
DELETE FROM ofac."CONS_ALT";
DELETE FROM ofac."CONS_PRIM";
DELETE FROM ofac."SDN";

\copy ofac."ALT" (ent_num, alt_num, alt_type, alt_name, alt_remarks) FROM './DATA_O~1/sdn/alt.csv' DELIMITER ',' CSV QUOTE '"' ESCAPE '"';
\copy ofac."CONS_ALT" (ent_num, alt_num, alt_type, alt_name, alt_remarks) FROM './DATA_O~1/consall/cons_alt.csv' DELIMITER ',' CSV QUOTE '"' ESCAPE '"';
\copy ofac."CONS_PRIM" (ent_num, sdn_name, sdn_type, program, title, call_sign, vess_type, tonnage, grt, vess_flag, vess_owner, remarks) FROM './DATA_O~1/consall/cons_prim.csv' DELIMITER ',' CSV QUOTE '"' ESCAPE '"';
\copy ofac."SDN" (ent_num, sdn_name, sdn_type, program, title, call_sign, vess_type, tonnage, grt, vess_flag, vess_owner, remarks) FROM './DATA_O~1/sdn/sdn.csv' DELIMITER ',' CSV QUOTE '"' ESCAPE '"';