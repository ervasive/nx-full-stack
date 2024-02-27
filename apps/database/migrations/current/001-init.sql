/*
 * Graphile Migrate will run our `current/...` migrations in one batch. Since
 * this is our first migration it's defining the entire database, so we first
 * drop anything that may have previously been created
 * (app_public/app_hidden/app_private) so that we can start from scratch.
 */
drop schema if exists app_public cascade;
drop schema if exists app_hidden cascade;
drop schema if exists app_private cascade;

/*
 * The `public` *schema* contains things like PostgreSQL extensions. We
 * deliberately do not install application logic into the public schema
 * (instead storing it to app_public/app_hidden/app_private as appropriate),
 * but none the less we don't want untrusted roles to be able to install or
 * modify things into the public schema.
 *
 * The `public` *role* is automatically inherited by all other roles; we only
 * want specific roles to be able to access our database so we must revoke
 * access to the `public` role.
 */
revoke all on schema public from public;

alter default privileges revoke all on sequences from public;
alter default privileges revoke all on functions from public;

-- Of course we want our database owner to be able to do anything inside the
-- database, so we grant access to the `public` schema:
grant all on schema public to :DB_OWNER_USER;

/*
 * Create schemas
 */
create schema app_public;
create schema app_hidden;
create schema app_private;

-- The following roles (used by PostGraphile to represent an end user) may
-- access the public, app_public and app_hidden schemas (but _NOT_ the
-- app_private schema).
-- NOTE: additional `app` roles (manager, admin) inherit permissions from the
-- "visitor" role, so we do not need to specify them separately
grant usage on schema public, app_public, app_hidden to :APP_VISITOR;
grant usage on schema public, app_public, app_hidden to :DB_AUTH_USER;

-- We want the `app` roles to be able to insert rows (`serial` data type
-- creates sequences, so we need to grant access to that).
alter default privileges in schema public, app_public, app_hidden
  grant usage, select on sequences to :APP_VISITOR;

-- And the `app` roles should be able to call functions too.
alter default privileges in schema public, app_public, app_hidden
  grant execute on functions to :APP_VISITOR;
