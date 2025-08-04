--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.0

-- Started on 2025-08-04 10:30:11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4879 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16431)
-- Name: event_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_categories (
    id integer NOT NULL,
    name character varying(100),
    display_order integer
);


ALTER TABLE public.event_categories OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16430)
-- Name: event_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_categories_id_seq OWNER TO postgres;

--
-- TOC entry 4880 (class 0 OID 0)
-- Dependencies: 221
-- Name: event_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_categories_id_seq OWNED BY public.event_categories.id;


--
-- TOC entry 232 (class 1259 OID 16503)
-- Name: event_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_enrollments (
    id integer NOT NULL,
    id_event integer,
    id_user integer,
    description text,
    registration_date_time timestamp without time zone,
    attended boolean,
    observations text,
    rating integer
);


ALTER TABLE public.event_enrollments OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16502)
-- Name: event_enrollments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_enrollments_id_seq OWNER TO postgres;

--
-- TOC entry 4881 (class 0 OID 0)
-- Dependencies: 231
-- Name: event_enrollments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_enrollments_id_seq OWNED BY public.event_enrollments.id;


--
-- TOC entry 224 (class 1259 OID 16438)
-- Name: event_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_locations (
    id integer NOT NULL,
    id_location integer,
    name character varying(100),
    full_address character varying(255),
    max_capacity integer,
    latitude numeric(9,6),
    longitude numeric(9,6),
    id_creator_user integer
);


ALTER TABLE public.event_locations OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16437)
-- Name: event_locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_locations_id_seq OWNER TO postgres;

--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 223
-- Name: event_locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_locations_id_seq OWNED BY public.event_locations.id;


--
-- TOC entry 230 (class 1259 OID 16486)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    id integer NOT NULL,
    id_event integer,
    id_tag integer
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16485)
-- Name: event_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_tags_id_seq OWNER TO postgres;

--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 229
-- Name: event_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_tags_id_seq OWNED BY public.event_tags.id;


--
-- TOC entry 226 (class 1259 OID 16455)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(150),
    description text,
    id_event_category integer,
    id_event_location integer,
    start_date timestamp without time zone,
    duration_in_minutes integer,
    price numeric(10,2),
    enabled_for_enrollment boolean,
    max_assistance integer,
    id_creator_user integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16454)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 4884 (class 0 OID 0)
-- Dependencies: 225
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 220 (class 1259 OID 16419)
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100),
    id_province integer,
    latitude numeric(9,6),
    longitude numeric(9,6)
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16418)
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO postgres;

--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 219
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- TOC entry 218 (class 1259 OID 16412)
-- Name: provinces; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provinces (
    id integer NOT NULL,
    name character varying(100),
    full_name character varying(150),
    latitude numeric(9,6),
    longitude numeric(9,6),
    display_order integer
);


ALTER TABLE public.provinces OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16411)
-- Name: provinces_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.provinces_id_seq OWNER TO postgres;

--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 217
-- Name: provinces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;


--
-- TOC entry 228 (class 1259 OID 16479)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16478)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 227
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 216 (class 1259 OID 16401)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    username character varying(100),
    password character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16400)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4677 (class 2604 OID 16434)
-- Name: event_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_categories ALTER COLUMN id SET DEFAULT nextval('public.event_categories_id_seq'::regclass);


--
-- TOC entry 4682 (class 2604 OID 16506)
-- Name: event_enrollments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments ALTER COLUMN id SET DEFAULT nextval('public.event_enrollments_id_seq'::regclass);


--
-- TOC entry 4678 (class 2604 OID 16441)
-- Name: event_locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations ALTER COLUMN id SET DEFAULT nextval('public.event_locations_id_seq'::regclass);


--
-- TOC entry 4681 (class 2604 OID 16489)
-- Name: event_tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags ALTER COLUMN id SET DEFAULT nextval('public.event_tags_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 16458)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4676 (class 2604 OID 16422)
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- TOC entry 4675 (class 2604 OID 16415)
-- Name: provinces id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);


--
-- TOC entry 4680 (class 2604 OID 16482)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4674 (class 2604 OID 16404)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4863 (class 0 OID 16431)
-- Dependencies: 222
-- Data for Name: event_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4873 (class 0 OID 16503)
-- Dependencies: 232
-- Data for Name: event_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4865 (class 0 OID 16438)
-- Dependencies: 224
-- Data for Name: event_locations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4871 (class 0 OID 16486)
-- Dependencies: 230
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4867 (class 0 OID 16455)
-- Dependencies: 226
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4861 (class 0 OID 16419)
-- Dependencies: 220
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4859 (class 0 OID 16412)
-- Dependencies: 218
-- Data for Name: provinces; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4869 (class 0 OID 16479)
-- Dependencies: 228
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4857 (class 0 OID 16401)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 221
-- Name: event_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_categories_id_seq', 1, false);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 231
-- Name: event_enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_enrollments_id_seq', 1, false);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 223
-- Name: event_locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_locations_id_seq', 1, false);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 229
-- Name: event_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_tags_id_seq', 1, false);


--
-- TOC entry 4893 (class 0 OID 0)
-- Dependencies: 225
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- TOC entry 4894 (class 0 OID 0)
-- Dependencies: 219
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, false);


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 217
-- Name: provinces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.provinces_id_seq', 1, false);


--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 227
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 4692 (class 2606 OID 16436)
-- Name: event_categories event_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 16510)
-- Name: event_enrollments event_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);


--
-- TOC entry 4694 (class 2606 OID 16443)
-- Name: event_locations event_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4700 (class 2606 OID 16491)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4696 (class 2606 OID 16462)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4690 (class 2606 OID 16424)
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- TOC entry 4688 (class 2606 OID 16417)
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- TOC entry 4698 (class 2606 OID 16484)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4684 (class 2606 OID 16408)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4686 (class 2606 OID 16410)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4711 (class 2606 OID 16511)
-- Name: event_enrollments event_enrollments_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id);


--
-- TOC entry 4712 (class 2606 OID 16516)
-- Name: event_enrollments event_enrollments_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id);


--
-- TOC entry 4704 (class 2606 OID 16449)
-- Name: event_locations event_locations_id_creator_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id);


--
-- TOC entry 4705 (class 2606 OID 16444)
-- Name: event_locations event_locations_id_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id);


--
-- TOC entry 4709 (class 2606 OID 16492)
-- Name: event_tags event_tags_id_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id);


--
-- TOC entry 4710 (class 2606 OID 16497)
-- Name: event_tags event_tags_id_tag_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_tag_fkey FOREIGN KEY (id_tag) REFERENCES public.tags(id);


--
-- TOC entry 4706 (class 2606 OID 16473)
-- Name: events events_id_creator_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id);


--
-- TOC entry 4707 (class 2606 OID 16463)
-- Name: events events_id_event_category_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_event_category_fkey FOREIGN KEY (id_event_category) REFERENCES public.event_categories(id);


--
-- TOC entry 4708 (class 2606 OID 16468)
-- Name: events events_id_event_location_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_event_location_fkey FOREIGN KEY (id_event_location) REFERENCES public.event_locations(id);


--
-- TOC entry 4703 (class 2606 OID 16425)
-- Name: locations locations_id_province_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_id_province_fkey FOREIGN KEY (id_province) REFERENCES public.provinces(id);


-- Completed on 2025-08-04 10:30:11

--
-- PostgreSQL database dump complete
--

