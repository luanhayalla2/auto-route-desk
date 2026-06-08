
-- ============ ENUMS ============
CREATE TYPE public.app_role AS ENUM ('admin','gestor','tecnico_n1','tecnico_n2','tecnico_n3','solicitante');
CREATE TYPE public.ticket_status AS ENUM ('aberto','em_andamento','aguardando_validacao','resolvido','reaberto','fechado');
CREATE TYPE public.ticket_level AS ENUM ('N1','N2','N3');
CREATE TYPE public.ticket_priority AS ENUM ('baixa','media','alta','critica');

-- ============ updated_at helper ============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============ UNIDADES ============
CREATE TABLE public.unidades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  sigla text NOT NULL UNIQUE,
  cidade text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.unidades TO authenticated;
GRANT ALL ON public.unidades TO service_role;
ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "unidades_select_auth" ON public.unidades FOR SELECT TO authenticated USING (true);

-- ============ CATEGORIAS ============
CREATE TABLE public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  descricao text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categorias TO authenticated;
GRANT ALL ON public.categorias TO service_role;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categorias_select_auth" ON public.categorias FOR SELECT TO authenticated USING (true);

-- ============ SUBCATEGORIAS ============
CREATE TABLE public.subcategorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id uuid NOT NULL REFERENCES public.categorias(id) ON DELETE CASCADE,
  nome text NOT NULL,
  nivel_padrao public.ticket_level NOT NULL DEFAULT 'N1',
  sla_horas integer NOT NULL DEFAULT 24,
  prioridade_padrao public.ticket_priority NOT NULL DEFAULT 'media',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(categoria_id, nome)
);
GRANT SELECT ON public.subcategorias TO authenticated;
GRANT ALL ON public.subcategorias TO service_role;
ALTER TABLE public.subcategorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "subcategorias_select_auth" ON public.subcategorias FOR SELECT TO authenticated USING (true);

-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome text NOT NULL,
  email text NOT NULL,
  matricula text,
  setor text,
  unidade_id uuid REFERENCES public.unidades(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============ USER_ROLES ============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id
    AND role IN ('admin','gestor','tecnico_n1','tecnico_n2','tecnico_n3'));
$$;

CREATE POLICY "user_roles_select_self_or_admin" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============ TICKETS ============
CREATE TABLE public.tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero text UNIQUE,
  solicitante_id uuid NOT NULL REFERENCES auth.users(id),
  atribuido_id uuid REFERENCES auth.users(id),
  unidade_id uuid REFERENCES public.unidades(id),
  categoria_id uuid REFERENCES public.categorias(id),
  subcategoria_id uuid REFERENCES public.subcategorias(id),
  titulo text NOT NULL,
  descricao text NOT NULL,
  nivel public.ticket_level NOT NULL DEFAULT 'N1',
  status public.ticket_status NOT NULL DEFAULT 'aberto',
  prioridade public.ticket_priority NOT NULL DEFAULT 'media',
  sla_horas integer NOT NULL DEFAULT 24,
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  closed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets_select_owner_or_staff" ON public.tickets FOR SELECT TO authenticated
  USING (solicitante_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "tickets_insert_self" ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (solicitante_id = auth.uid());
CREATE POLICY "tickets_update_staff_or_owner" ON public.tickets FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()) OR solicitante_id = auth.uid());

CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- numbering CH-YYYY-NNNNNN
CREATE SEQUENCE IF NOT EXISTS public.ticket_seq START 1;
CREATE OR REPLACE FUNCTION public.tg_ticket_numero()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
DECLARE n bigint;
BEGIN
  IF NEW.numero IS NULL THEN
    n := nextval('public.ticket_seq');
    NEW.numero := 'CH-' || to_char(now(),'YYYY') || '-' || lpad(n::text, 6, '0');
  END IF;
  -- classify by subcategoria
  IF NEW.subcategoria_id IS NOT NULL THEN
    SELECT nivel_padrao, sla_horas, prioridade_padrao
      INTO NEW.nivel, NEW.sla_horas, NEW.prioridade
      FROM public.subcategorias WHERE id = NEW.subcategoria_id;
  END IF;
  NEW.due_at := now() + (NEW.sla_horas || ' hours')::interval;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_tickets_pre_insert BEFORE INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.tg_ticket_numero();

-- ============ TICKET HISTORICO ============
CREATE TABLE public.ticket_historico (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  acao text NOT NULL,
  descricao text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_historico TO authenticated;
GRANT ALL ON public.ticket_historico TO service_role;
ALTER TABLE public.ticket_historico ENABLE ROW LEVEL SECURITY;
CREATE POLICY "historico_select_owner_or_staff" ON public.ticket_historico FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id
    AND (t.solicitante_id = auth.uid() OR public.is_staff(auth.uid()))));
CREATE POLICY "historico_insert_owner_or_staff" ON public.ticket_historico FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.tickets t WHERE t.id = ticket_id
    AND (t.solicitante_id = auth.uid() OR public.is_staff(auth.uid()))));

-- auto-log status changes
CREATE OR REPLACE FUNCTION public.tg_ticket_audit()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.ticket_historico(ticket_id, user_id, acao, descricao, metadata)
    VALUES (NEW.id, NEW.solicitante_id, 'criado', 'Chamado aberto',
      jsonb_build_object('nivel', NEW.nivel, 'prioridade', NEW.prioridade));
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      INSERT INTO public.ticket_historico(ticket_id, user_id, acao, descricao, metadata)
      VALUES (NEW.id, auth.uid(), 'status_alterado',
        OLD.status::text || ' → ' || NEW.status::text,
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
      IF NEW.status = 'resolvido' AND OLD.status <> 'resolvido' THEN
        NEW.resolved_at := now();
      END IF;
      IF NEW.status = 'fechado' AND OLD.status <> 'fechado' THEN
        NEW.closed_at := now();
      END IF;
    END IF;
    IF NEW.atribuido_id IS DISTINCT FROM OLD.atribuido_id THEN
      INSERT INTO public.ticket_historico(ticket_id, user_id, acao, descricao, metadata)
      VALUES (NEW.id, auth.uid(), 'atribuido', 'Atribuição alterada',
        jsonb_build_object('from', OLD.atribuido_id, 'to', NEW.atribuido_id));
    END IF;
    IF NEW.nivel IS DISTINCT FROM OLD.nivel THEN
      INSERT INTO public.ticket_historico(ticket_id, user_id, acao, descricao, metadata)
      VALUES (NEW.id, auth.uid(), 'escalonado',
        OLD.nivel::text || ' → ' || NEW.nivel::text,
        jsonb_build_object('from', OLD.nivel, 'to', NEW.nivel));
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_tickets_audit_ins AFTER INSERT ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.tg_ticket_audit();
CREATE TRIGGER trg_tickets_audit_upd BEFORE UPDATE ON public.tickets FOR EACH ROW EXECUTE FUNCTION public.tg_ticket_audit();

-- ============ AVALIACOES ============
CREATE TABLE public.ticket_avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL UNIQUE REFERENCES public.tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  nota_rapidez int NOT NULL CHECK (nota_rapidez BETWEEN 1 AND 5),
  nota_qualidade int NOT NULL CHECK (nota_qualidade BETWEEN 1 AND 5),
  nota_comunicacao int NOT NULL CHECK (nota_comunicacao BETWEEN 1 AND 5),
  nota_cordialidade int NOT NULL CHECK (nota_cordialidade BETWEEN 1 AND 5),
  nota_solucao int NOT NULL CHECK (nota_solucao BETWEEN 1 AND 5),
  comentario text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.ticket_avaliacoes TO authenticated;
GRANT ALL ON public.ticket_avaliacoes TO service_role;
ALTER TABLE public.ticket_avaliacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "aval_select_owner_or_staff" ON public.ticket_avaliacoes FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "aval_insert_owner" ON public.ticket_avaliacoes FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.tickets t WHERE t.id = ticket_id AND t.solicitante_id = auth.uid()));

-- ============ AUTO PROFILE + ROLE ON SIGNUP ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE total_users int;
BEGIN
  INSERT INTO public.profiles (id, nome, email, matricula, setor)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'matricula',
    NEW.raw_user_meta_data->>'setor'
  );
  SELECT count(*) INTO total_users FROM public.profiles;
  IF total_users = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'solicitante');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
