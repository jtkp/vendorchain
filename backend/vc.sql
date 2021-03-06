PGDMP     0    "    
            y            vc2    12.0    12.0     a           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            b           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            c           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            d           1262    16664    vc2    DATABASE     a   CREATE DATABASE vc2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE vc2;
                postgres    false            ?            1259    16712 	   condition    TABLE     ?   CREATE TABLE public.condition (
    address character varying(200) NOT NULL,
    name character varying(200) NOT NULL,
    operator character varying(20),
    value numeric(20,0)
);
    DROP TABLE public.condition;
       public         heap    postgres    false            ?            1259    16674    contract    TABLE     ?   CREATE TABLE public.contract (
    index integer NOT NULL,
    description character varying(200),
    address character varying(200),
    owner character varying(200),
    title character varying(40)
);
    DROP TABLE public.contract;
       public         heap    postgres    false            ?            1259    16672    contract_index_seq    SEQUENCE     ?   CREATE SEQUENCE public.contract_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.contract_index_seq;
       public          postgres    false    204            e           0    0    contract_index_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.contract_index_seq OWNED BY public.contract.index;
          public          postgres    false    203            ?            1259    16697    party    TABLE     v   CREATE TABLE public.party (
    payee character varying(200) NOT NULL,
    address character varying(200) NOT NULL
);
    DROP TABLE public.party;
       public         heap    postgres    false            ?            1259    16665    userinfo    TABLE     ?   CREATE TABLE public.userinfo (
    address character varying(200) NOT NULL,
    name character varying(40),
    email character varying(40),
    password character varying(40),
    "isAdmin" boolean
);
    DROP TABLE public.userinfo;
       public         heap    postgres    false            ?           2604    16677    contract index    DEFAULT     p   ALTER TABLE ONLY public.contract ALTER COLUMN index SET DEFAULT nextval('public.contract_index_seq'::regclass);
 =   ALTER TABLE public.contract ALTER COLUMN index DROP DEFAULT;
       public          postgres    false    204    203    204            ^          0    16712 	   condition 
   TABLE DATA           C   COPY public.condition (address, name, operator, value) FROM stdin;
    public          postgres    false    206   i       \          0    16674    contract 
   TABLE DATA           M   COPY public.contract (index, description, address, owner, title) FROM stdin;
    public          postgres    false    204   ?       ]          0    16697    party 
   TABLE DATA           /   COPY public.party (payee, address) FROM stdin;
    public          postgres    false    205   ?       Z          0    16665    userinfo 
   TABLE DATA           M   COPY public.userinfo (address, name, email, password, "isAdmin") FROM stdin;
    public          postgres    false    202          f           0    0    contract_index_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.contract_index_seq', 1, true);
          public          postgres    false    203            ?           2606    16716    condition condition_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY (address, name);
 B   ALTER TABLE ONLY public.condition DROP CONSTRAINT condition_pkey;
       public            postgres    false    206    206            ?           2606    16691 #   contract contract_cntrctAddress_key 
   CONSTRAINT     c   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_cntrctAddress_key" UNIQUE (address);
 O   ALTER TABLE ONLY public.contract DROP CONSTRAINT "contract_cntrctAddress_key";
       public            postgres    false    204            ?           2606    16682    contract contract_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (index);
 @   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_pkey;
       public            postgres    false    204            ?           2606    16701    party party_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (payee, address);
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    205    205            ?           2606    16671    userinfo userinfo_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_email_key;
       public            postgres    false    202            ?           2606    16669    userinfo userinfo_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (address);
 @   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_pkey;
       public            postgres    false    202            ?           2606    16717     condition condition_address_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_address_fkey FOREIGN KEY (address) REFERENCES public.contract(address);
 J   ALTER TABLE ONLY public.condition DROP CONSTRAINT condition_address_fkey;
       public          postgres    false    206    204    3025            ?           2606    16692 #   contract contract_ownerAddress_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_ownerAddress_fkey" FOREIGN KEY (owner) REFERENCES public.userinfo(address);
 O   ALTER TABLE ONLY public.contract DROP CONSTRAINT "contract_ownerAddress_fkey";
       public          postgres    false    202    204    3023            ?           2606    16707    party party_address_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_address_fkey FOREIGN KEY (address) REFERENCES public.contract(address);
 B   ALTER TABLE ONLY public.party DROP CONSTRAINT party_address_fkey;
       public          postgres    false    204    3025    205            ?           2606    16702    party party_payee_fkey    FK CONSTRAINT     {   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_payee_fkey FOREIGN KEY (payee) REFERENCES public.userinfo(address);
 @   ALTER TABLE ONLY public.party DROP CONSTRAINT party_payee_fkey;
       public          postgres    false    205    202    3023            ^   *   x???H??H?LJ?K)?L)?PH?HM????440?????? ?D
      \   %   x?3?,,OM-*ᬪH"??? ?LLL?????? ?7	?      ]      x?K,NI,NᬪH"?=... E3?      Z   $   x?K,NI,N?,N?K B/9?"T????? ?     