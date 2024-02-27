/*
 * User role
 *
 * Map app users to one of the pre-defined database roles through which grants
 * and RLS policies are being applied
 */
create type app_private.user_role as enum (
  ':APP_VISITOR',
  ':APP_MANAGER',
  ':APP_ADMIN'
);

/*
 * Public user profiles
 */
create table app_public.users (
  id uuid default gen_random_uuid() primary key,
  username citext not null unique,
  avatar_url text
);

grant select on app_public.users to :APP_VISITOR;
grant update (username, avatar_url) on app_public.users to :APP_VISITOR;
-- creation and deletion is handled by app admins

alter table app_public.users enable row level security;

-- add policies after all required parts (e.g. current_user_id) are defined

/*
 * Secret user data
 */
create table app_private.user_secrets (
  id uuid primary key references app_public.users(id) on delete cascade,
  email citext not null unique,
  hashed_password text not null,
  role app_private.user_role not null default ':APP_VISITOR',
  failed_login_attempts smallint
);

/*
 * User sessions
 * @see https://lucia-auth.com/database/postgresql
 */
create table app_private.user_sessions (
  id text primary key,
  user_id uuid not null references app_private.user_secrets(id) on delete cascade,
  expires_at timestamptz not null
);

/*
 * Helper view for lucia to be able to grab all the required user data
 */
create view app_private.user_details as
  select u.id, u.username, u.avatar_url, s.email, s.role
    from app_public.users as u
    left join app_private.user_secrets as s on s.id = u.id;

/*
 * Utility function to create public/secret user data
 */
create function app_private.create_user(
  email text,
  password text,
  username text,
  avatar_url text default null,
  role app_private.user_role default ':APP_VISITOR'
) returns app_public.users as $$
  declare
    v_user app_public.users;
  begin
    insert into app_public.users (username, avatar_url)
      values ($3, $4) returning * into v_user;

    insert into app_private.user_secrets (id, email, hashed_password, role)
      values (v_user.id, $1, crypt($2, gen_salt('bf')), $5);

    return v_user;
  end;
$$ language plpgsql volatile security definer;

/*
 * This function is responsible for reading the `jwt.claims.session_id`
 * transaction setting (set from the `pgSettings` function within
 * graphile configuration) and checking it agains existing sessions in the
 * database.
 * Defining this inside a function means we can modify it in future to allow
 * additional ways of defining the session.
 *
 * Note we have this in `app_public` but it doesn't show up in the GraphQL
 * schema because we've used `postgraphile.tags.jsonc` to omit it. We could
 * have put it in app_hidden to get the same effect more easily, but it's often
 * useful to un-omit it to ease debugging auth issues.
 */
create function app_public.current_session_id() returns text as $$
  select id
    from app_private.user_sessions
    where id = pg_catalog.current_setting('jwt.claims.session_id', true);
$$ language sql stable security definer;

comment on function app_public.current_session_id() is
  E'Handy method to get the current session ID.';

/*
 * This function is responsible for getting the user ID of the current session
 * that may be used in RLS policies
 */
create function app_hidden.current_user_id() returns uuid as $$
  select user_id
    from app_private.user_sessions
    where id = app_public.current_session_id();
$$ language sql stable security definer;

comment on function app_hidden.current_user_id() is
  E'Handy method to get the current user ID for use in RLS policies, etc';

-- setting RLS policies after all the required functionality is defined
create policy "Access user"
  on app_public.users
  for select
  to :APP_VISITOR
  using (true);

create policy "Update user"
  on app_public.users
  for update
  to :APP_VISITOR
  using (id = current_user_id());



create table app_public.posts(
  id uuid default gen_random_uuid() primary key,
  title text,
  content text
);
