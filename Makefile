cornucopia-generate:
	cornucopia \
		-q ./backend/sql/queries \
		-d ./backend/sql/mod.rs \
		schema ./backend/sql/schema.sql