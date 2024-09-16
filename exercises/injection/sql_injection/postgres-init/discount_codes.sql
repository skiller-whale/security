CREATE TABLE promo_codes(
  code character varying,
  discountpct int
);

INSERT INTO promo_codes (code, discountpct) VALUES
  ('10OFF', 10),
  ('EVERYLITTLEHELPS', 5),
  ('NEWSLETTER20', 20),
  ('STAFF75', 75);
