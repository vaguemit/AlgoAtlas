-- Create a function to get all tables in the public schema
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS SETOF json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT json_build_object(
    'table_name', tablename
  )
  FROM pg_catalog.pg_tables
  WHERE schemaname = 'public';
END;
$$; 