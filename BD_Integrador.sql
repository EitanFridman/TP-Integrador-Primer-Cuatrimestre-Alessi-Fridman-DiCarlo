PGDMP          
            }            BD_Integrador    16.2    16.0 Q               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16507    BD_Integrador    DATABASE     �   CREATE DATABASE "BD_Integrador" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Argentina.1252';
    DROP DATABASE "BD_Integrador";
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false                       0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    16539    event_categories    TABLE     �   CREATE TABLE public.event_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    display_order integer
);
 $   DROP TABLE public.event_categories;
       public         heap    postgres    false    4            �            1259    16538    event_categories_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.event_categories_id_seq;
       public          postgres    false    4    222                       0    0    event_categories_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public.event_categories_id_seq OWNED BY public.event_categories.id;
          public          postgres    false    221            �            1259    16614    event_enrollments    TABLE     r  CREATE TABLE public.event_enrollments (
    id integer NOT NULL,
    id_event integer,
    id_user integer,
    description text,
    registration_date_time timestamp without time zone DEFAULT now(),
    attended boolean DEFAULT false,
    observations text,
    rating integer,
    CONSTRAINT event_enrollments_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
 %   DROP TABLE public.event_enrollments;
       public         heap    postgres    false    4            �            1259    16613    event_enrollments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_enrollments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.event_enrollments_id_seq;
       public          postgres    false    232    4                       0    0    event_enrollments_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.event_enrollments_id_seq OWNED BY public.event_enrollments.id;
          public          postgres    false    231            �            1259    16555    event_locations    TABLE     #  CREATE TABLE public.event_locations (
    id integer NOT NULL,
    id_location integer,
    name character varying(100) NOT NULL,
    full_address character varying(200),
    max_capacity integer,
    latitude double precision,
    longitude double precision,
    id_creator_user integer
);
 #   DROP TABLE public.event_locations;
       public         heap    postgres    false    4            �            1259    16554    event_locations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.event_locations_id_seq;
       public          postgres    false    226    4                       0    0    event_locations_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.event_locations_id_seq OWNED BY public.event_locations.id;
          public          postgres    false    225            �            1259    16597 
   event_tags    TABLE     f   CREATE TABLE public.event_tags (
    id integer NOT NULL,
    id_event integer,
    id_tag integer
);
    DROP TABLE public.event_tags;
       public         heap    postgres    false    4            �            1259    16596    event_tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.event_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.event_tags_id_seq;
       public          postgres    false    4    230                       0    0    event_tags_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.event_tags_id_seq OWNED BY public.event_tags.id;
          public          postgres    false    229            �            1259    16572    events    TABLE     �  CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    id_event_category integer,
    id_event_location integer,
    start_date timestamp without time zone,
    duration_in_minutes integer,
    price numeric(10,2),
    enabled_for_enrollment boolean DEFAULT true,
    max_assistance integer,
    id_creator_user integer
);
    DROP TABLE public.events;
       public         heap    postgres    false    4            �            1259    16571    events_id_seq    SEQUENCE     �   CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.events_id_seq;
       public          postgres    false    228    4                       0    0    events_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;
          public          postgres    false    227            �            1259    16516 	   locations    TABLE     �   CREATE TABLE public.locations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    id_province integer,
    latitude double precision,
    longitude double precision
);
    DROP TABLE public.locations;
       public         heap    postgres    false    4            �            1259    16515    locations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.locations_id_seq;
       public          postgres    false    4    218                       0    0    locations_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;
          public          postgres    false    217            �            1259    16509 	   provinces    TABLE     �   CREATE TABLE public.provinces (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    full_name character varying(150),
    latitude double precision,
    longitude double precision,
    display_order integer
);
    DROP TABLE public.provinces;
       public         heap    postgres    false    4            �            1259    16508    provinces_id_seq    SEQUENCE     �   CREATE SEQUENCE public.provinces_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.provinces_id_seq;
       public          postgres    false    4    216                       0    0    provinces_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.provinces_id_seq OWNED BY public.provinces.id;
          public          postgres    false    215            �            1259    16546    tags    TABLE     _   CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);
    DROP TABLE public.tags;
       public         heap    postgres    false    4            �            1259    16545    tags_id_seq    SEQUENCE     �   CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.tags_id_seq;
       public          postgres    false    224    4                       0    0    tags_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;
          public          postgres    false    223            �            1259    16528    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(100),
    last_name character varying(100),
    username character varying(100) NOT NULL,
    password character varying(200) NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    4            �            1259    16527    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    4    220                       0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    219            E           2604    16542    event_categories id    DEFAULT     z   ALTER TABLE ONLY public.event_categories ALTER COLUMN id SET DEFAULT nextval('public.event_categories_id_seq'::regclass);
 B   ALTER TABLE public.event_categories ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221    222            K           2604    16617    event_enrollments id    DEFAULT     |   ALTER TABLE ONLY public.event_enrollments ALTER COLUMN id SET DEFAULT nextval('public.event_enrollments_id_seq'::regclass);
 C   ALTER TABLE public.event_enrollments ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    231    232    232            G           2604    16558    event_locations id    DEFAULT     x   ALTER TABLE ONLY public.event_locations ALTER COLUMN id SET DEFAULT nextval('public.event_locations_id_seq'::regclass);
 A   ALTER TABLE public.event_locations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    226    226            J           2604    16600    event_tags id    DEFAULT     n   ALTER TABLE ONLY public.event_tags ALTER COLUMN id SET DEFAULT nextval('public.event_tags_id_seq'::regclass);
 <   ALTER TABLE public.event_tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    229    230    230            H           2604    16575 	   events id    DEFAULT     f   ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);
 8   ALTER TABLE public.events ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            C           2604    16519    locations id    DEFAULT     l   ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);
 ;   ALTER TABLE public.locations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            B           2604    16512    provinces id    DEFAULT     l   ALTER TABLE ONLY public.provinces ALTER COLUMN id SET DEFAULT nextval('public.provinces_id_seq'::regclass);
 ;   ALTER TABLE public.provinces ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    216    216            F           2604    16549    tags id    DEFAULT     b   ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);
 6   ALTER TABLE public.tags ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223    224            D           2604    16531    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    220    220                      0    16539    event_categories 
   TABLE DATA                 public          postgres    false    222   ]                 0    16614    event_enrollments 
   TABLE DATA                 public          postgres    false    232   {]       	          0    16555    event_locations 
   TABLE DATA                 public          postgres    false    226   ,^                 0    16597 
   event_tags 
   TABLE DATA                 public          postgres    false    230   �^                 0    16572    events 
   TABLE DATA                 public          postgres    false    228   ?_                 0    16516 	   locations 
   TABLE DATA                 public          postgres    false    218   &`       �          0    16509 	   provinces 
   TABLE DATA                 public          postgres    false    216   �`                 0    16546    tags 
   TABLE DATA                 public          postgres    false    224   Ha                 0    16528    users 
   TABLE DATA                 public          postgres    false    220   �a                   0    0    event_categories_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.event_categories_id_seq', 2, true);
          public          postgres    false    221            !           0    0    event_enrollments_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.event_enrollments_id_seq', 2, true);
          public          postgres    false    231            "           0    0    event_locations_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.event_locations_id_seq', 2, true);
          public          postgres    false    225            #           0    0    event_tags_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.event_tags_id_seq', 3, true);
          public          postgres    false    229            $           0    0    events_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.events_id_seq', 2, true);
          public          postgres    false    227            %           0    0    locations_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.locations_id_seq', 2, true);
          public          postgres    false    217            &           0    0    provinces_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.provinces_id_seq', 2, true);
          public          postgres    false    215            '           0    0    tags_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.tags_id_seq', 3, true);
          public          postgres    false    223            (           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 2, true);
          public          postgres    false    219            X           2606    16544 &   event_categories event_categories_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.event_categories
    ADD CONSTRAINT event_categories_pkey PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.event_categories DROP CONSTRAINT event_categories_pkey;
       public            postgres    false    222            d           2606    16624 (   event_enrollments event_enrollments_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.event_enrollments DROP CONSTRAINT event_enrollments_pkey;
       public            postgres    false    232            ^           2606    16560 $   event_locations event_locations_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.event_locations DROP CONSTRAINT event_locations_pkey;
       public            postgres    false    226            b           2606    16602    event_tags event_tags_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.event_tags DROP CONSTRAINT event_tags_pkey;
       public            postgres    false    230            `           2606    16580    events events_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.events DROP CONSTRAINT events_pkey;
       public            postgres    false    228            R           2606    16521    locations locations_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_pkey;
       public            postgres    false    218            P           2606    16514    provinces provinces_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.provinces DROP CONSTRAINT provinces_pkey;
       public            postgres    false    216            Z           2606    16553    tags tags_name_key 
   CONSTRAINT     M   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);
 <   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_name_key;
       public            postgres    false    224            \           2606    16551    tags tags_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.tags DROP CONSTRAINT tags_pkey;
       public            postgres    false    224            T           2606    16535    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    220            V           2606    16537    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    220            m           2606    16625 1   event_enrollments event_enrollments_id_event_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) ON DELETE CASCADE;
 [   ALTER TABLE ONLY public.event_enrollments DROP CONSTRAINT event_enrollments_id_event_fkey;
       public          postgres    false    4704    232    228            n           2606    16630 0   event_enrollments event_enrollments_id_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_enrollments
    ADD CONSTRAINT event_enrollments_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id) ON DELETE CASCADE;
 Z   ALTER TABLE ONLY public.event_enrollments DROP CONSTRAINT event_enrollments_id_user_fkey;
       public          postgres    false    220    4692    232            f           2606    16566 4   event_locations event_locations_id_creator_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id) ON DELETE SET NULL;
 ^   ALTER TABLE ONLY public.event_locations DROP CONSTRAINT event_locations_id_creator_user_fkey;
       public          postgres    false    4692    226    220            g           2606    16561 0   event_locations event_locations_id_location_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_locations
    ADD CONSTRAINT event_locations_id_location_fkey FOREIGN KEY (id_location) REFERENCES public.locations(id) ON DELETE SET NULL;
 Z   ALTER TABLE ONLY public.event_locations DROP CONSTRAINT event_locations_id_location_fkey;
       public          postgres    false    218    226    4690            k           2606    16603 #   event_tags event_tags_id_event_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_event_fkey FOREIGN KEY (id_event) REFERENCES public.events(id) ON DELETE CASCADE;
 M   ALTER TABLE ONLY public.event_tags DROP CONSTRAINT event_tags_id_event_fkey;
       public          postgres    false    230    228    4704            l           2606    16608 !   event_tags event_tags_id_tag_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_id_tag_fkey FOREIGN KEY (id_tag) REFERENCES public.tags(id) ON DELETE CASCADE;
 K   ALTER TABLE ONLY public.event_tags DROP CONSTRAINT event_tags_id_tag_fkey;
       public          postgres    false    224    4700    230            h           2606    16591 "   events events_id_creator_user_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_creator_user_fkey FOREIGN KEY (id_creator_user) REFERENCES public.users(id) ON DELETE SET NULL;
 L   ALTER TABLE ONLY public.events DROP CONSTRAINT events_id_creator_user_fkey;
       public          postgres    false    228    220    4692            i           2606    16581 $   events events_id_event_category_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_event_category_fkey FOREIGN KEY (id_event_category) REFERENCES public.event_categories(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.events DROP CONSTRAINT events_id_event_category_fkey;
       public          postgres    false    222    228    4696            j           2606    16586 $   events events_id_event_location_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_id_event_location_fkey FOREIGN KEY (id_event_location) REFERENCES public.event_locations(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.events DROP CONSTRAINT events_id_event_location_fkey;
       public          postgres    false    226    228    4702            e           2606    16522 $   locations locations_id_province_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_id_province_fkey FOREIGN KEY (id_province) REFERENCES public.provinces(id) ON DELETE SET NULL;
 N   ALTER TABLE ONLY public.locations DROP CONSTRAINT locations_id_province_fkey;
       public          postgres    false    218    4688    216               \   x���v
Q���W((M��L�K-K�+�ON,IM�/�L-Vs�	uV�0�QPIM����O?�6Q]G�PӚ˓��&8����rq {'�         �   x���v
Q���W((M��L�K-K�+�O�+����2��}B]�4u��HGAݱ8��$���J���<������bu���������������������������)P6-1�8UG�/��BjZsy�b��r����RRs����[RT
��h' Z0D�      	   �   x����
�0D�~��l�#Uz� �������HMI���Cݝa���\'h��o��j!r���k�����[���;� N\�k�^;o��Ahi_&F���bu�(�8�4M8d��� ���?E��dL�P����}7`-��p,|�U2��Hʜ��E_"C@�         I   x���v
Q���W((M��L�K-K�+�/IL/Vs�	uV�0�Q !Mk.O������XG����� �*         �   x����J1��>�[�m�D�z��������t��5)Iv������9[�	?a�?_�ٮ�����a�;;�}Nx�xZmq�*�ˣ��A
�����\ʶ�9��`����0��q�5�uI�I�3jf����D�[�@s�7ǁ+42�뻢���f��e���X��y�,���c`�эa*M�.e��o_�O0}�/�����Li���צj����gHU&         p   x���v
Q���W((M��L���ON,���+Vs�	uV�0�QPH�I-��W�Q �t�M�L-��������5�'1���IT�I,I�c1����d������	�,.. �|'�      �   �   x���v
Q���W((M��L�+(�/��KN-Vs�	uV�0�QPwvtrTљ�)�)
��%�7���&*��*8����+8f������Y�z��f:
���\���e��<� ��L\�Y��,3׳45����qq uD?U         V   x���v
Q���W((M��L�+IL/Vs�	uV�0�QPJML.Q״��$���������Db��������tpq D�*�         r   x���v
Q���W((M��L�+-N-*Vs�	uV�0�QP�*M�S��W�V�XY@�##�8#5� ���P]Ӛ˓�qF@=��E��&�t�ޜ107�(31�D#��\\ \�2�     