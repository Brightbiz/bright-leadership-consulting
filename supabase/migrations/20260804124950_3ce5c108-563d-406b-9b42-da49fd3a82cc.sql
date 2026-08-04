CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      -- callers with a user session may only query their own roles;
      -- server-side (service_role) contexts have no auth.uid() and are unrestricted
      AND (auth.uid() IS NULL OR _user_id = auth.uid())
  )
$function$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;