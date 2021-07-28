PGDMP                         y            vc2    12.0    12.0     P           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            R           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            S           1262    16664    vc2    DATABASE     a   CREATE DATABASE vc2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE vc2;
                postgres    false            �            1259    16674    contract    TABLE     �   CREATE TABLE public.contract (
    index integer NOT NULL,
    description character varying(200),
    "cntrctAddress" character varying(200),
    "ownerAddress" character varying(200),
    title character varying(40)
);
    DROP TABLE public.contract;
       public         heap    postgres    false            �            1259    16672    contract_index_seq    SEQUENCE     �   CREATE SEQUENCE public.contract_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.contract_index_seq;
       public          postgres    false    204            T           0    0    contract_index_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.contract_index_seq OWNED BY public.contract.index;
          public          postgres    false    203            �            1259    16665    userinfo    TABLE     �   CREATE TABLE public.userinfo (
    address character varying(200) NOT NULL,
    name character varying(40),
    email character varying(40),
    password character varying(40),
    "isAdmin" boolean
);
    DROP TABLE public.userinfo;
       public         heap    postgres    false            �           2604    16677    contract index    DEFAULT     p   ALTER TABLE ONLY public.contract ALTER COLUMN index SET DEFAULT nextval('public.contract_index_seq'::regclass);
 =   ALTER TABLE public.contract ALTER COLUMN index DROP DEFAULT;
       public          postgres    false    204    203    204            M          0    16674    contract 
   TABLE DATA           ^   COPY public.contract (index, description, "cntrctAddress", "ownerAddress", title) FROM stdin;
    public          postgres    false    204   �       K          0    16665    userinfo 
   TABLE DATA           M   COPY public.userinfo (address, name, email, password, "isAdmin") FROM stdin;
    public          postgres    false    202   �       U           0    0    contract_index_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.contract_index_seq', 1, true);
          public          postgres    false    203            �           2606    16684 #   contract contract_cntrctAddress_key 
   CONSTRAINT     k   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_cntrctAddress_key" UNIQUE ("cntrctAddress");
 O   ALTER TABLE ONLY public.contract DROP CONSTRAINT "contract_cntrctAddress_key";
       public            postgres    false    204            �           2606    16682    contract contract_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (index);
 @   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_pkey;
       public            postgres    false    204            �           2606    16671    userinfo userinfo_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_email_key;
       public            postgres    false    202            �           2606    16669    userinfo userinfo_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (address);
 @   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_pkey;
       public            postgres    false    202            �           2606    16685 #   contract contract_ownerAddress_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_ownerAddress_fkey" FOREIGN KEY ("ownerAddress") REFERENCES public.userinfo(address);
 O   ALTER TABLE ONLY public.contract DROP CONSTRAINT "contract_ownerAddress_fkey";
       public          postgres    false    3015    202    204            M   %   x�3�,,OM-*ᬪH"��� �LLL����� �7	�      K   $   x�K,NI,N�,N�K B/9?"T����� �     