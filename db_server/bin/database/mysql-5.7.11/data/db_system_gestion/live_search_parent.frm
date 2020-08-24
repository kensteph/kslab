TYPE=VIEW
query=select `db_system_gestion`.`parents`.`id_personne` AS `id_personne`,`db_system_gestion`.`parents`.`type` AS `type`,concat(`db_system_gestion`.`personnes`.`prenom`,\' \',`db_system_gestion`.`personnes`.`nom`,\' (ID : \',`db_system_gestion`.`personnes`.`id`,\')\',\' \',`db_system_gestion`.`personnes`.`telephone`,\' | \',`db_system_gestion`.`parents`.`type`) AS `critere_recherche` from `db_system_gestion`.`personnes` join `db_system_gestion`.`parents` where (`db_system_gestion`.`personnes`.`id` = `db_system_gestion`.`parents`.`id_personne`)
md5=57e615a95736e01b87a970c5f4c4abff
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=2
with_check_option=0
timestamp=2020-02-23 00:05:39
create-version=1
source=SELECT id_personne,type,CONCAT(prenom," ",nom," (ID : ",personnes.id,")"," ",telephone," | ",type) as critere_recherche FROM personnes,parents where personnes.id=parents.id_personne
client_cs_name=utf8mb4
connection_cl_name=utf8mb4_unicode_ci
view_body_utf8=select `db_system_gestion`.`parents`.`id_personne` AS `id_personne`,`db_system_gestion`.`parents`.`type` AS `type`,concat(`db_system_gestion`.`personnes`.`prenom`,\' \',`db_system_gestion`.`personnes`.`nom`,\' (ID : \',`db_system_gestion`.`personnes`.`id`,\')\',\' \',`db_system_gestion`.`personnes`.`telephone`,\' | \',`db_system_gestion`.`parents`.`type`) AS `critere_recherche` from `db_system_gestion`.`personnes` join `db_system_gestion`.`parents` where (`db_system_gestion`.`personnes`.`id` = `db_system_gestion`.`parents`.`id_personne`)
