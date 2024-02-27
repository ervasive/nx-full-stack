begin;

grant connect on database :DB_NAME to :DB_OWNER_USER;
grant connect on database :DB_NAME to :DB_AUTH_USER;
grant all on database :DB_NAME to :DB_OWNER_USER;

-- Some extensions require superuser privileges, so we create them before migration time.
create extension if not exists plpgsql with schema pg_catalog;
create extension if not exists "uuid-ossp" with schema public;
create extension if not exists citext with schema public;
create extension if not exists pgcrypto with schema public;

commit;
