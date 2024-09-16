CREATE TABLE users(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying
);

CREATE TABLE reviews(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id),
  body character varying,
  title character varying,
  created_at timestamp
);

