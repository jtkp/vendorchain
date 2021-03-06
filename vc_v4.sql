PGDMP         /                y            vc    12.0    12.0     n           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            o           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            p           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            q           1262    16453    vc    DATABASE     `   CREATE DATABASE vc WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE vc;
                postgres    false                        3079    16570 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            r           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            ?            1259    16481 	   condition    TABLE     ?   CREATE TABLE public.condition (
    "conditionID" uuid NOT NULL,
    description character varying(100),
    category character varying(20),
    operator character varying(10),
    value numeric,
    "contractID" uuid DEFAULT public.uuid_generate_v4()
);
    DROP TABLE public.condition;
       public         heap    postgres    false    2            ?            1259    16459    contract    TABLE     `  CREATE TABLE public.contract (
    "contractID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(20),
    description character varying(100),
    creation_date date DEFAULT CURRENT_DATE NOT NULL,
    state character varying(20),
    address character varying(100),
    owner uuid,
    index integer DEFAULT '-1'::integer
);
    DROP TABLE public.contract;
       public         heap    postgres    false    2            ?            1259    16559    party    TABLE     ?   CREATE TABLE public.party (
    "partyID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "contractID" uuid NOT NULL,
    confirm boolean DEFAULT false NOT NULL
);
    DROP TABLE public.party;
       public         heap    postgres    false    2            ?            1259    16454    userinfo    TABLE     ?   CREATE TABLE public.userinfo (
    "userID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(20),
    email character varying(40),
    password character varying(20)
);
    DROP TABLE public.userinfo;
       public         heap    postgres    false    2            j          0    16481 	   condition 
   TABLE DATA           h   COPY public.condition ("conditionID", description, category, operator, value, "contractID") FROM stdin;
    public          postgres    false    205   ?       i          0    16459    contract 
   TABLE DATA           q   COPY public.contract ("contractID", title, description, creation_date, state, address, owner, index) FROM stdin;
    public          postgres    false    204   [       k          0    16559    party 
   TABLE DATA           A   COPY public.party ("partyID", "contractID", confirm) FROM stdin;
    public          postgres    false    206   ?       h          0    16454    userinfo 
   TABLE DATA           C   COPY public.userinfo ("userID", name, email, password) FROM stdin;
    public          postgres    false    203   6       ?           2606    16488    condition condition_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY ("conditionID");
 B   ALTER TABLE ONLY public.condition DROP CONSTRAINT condition_pkey;
       public            postgres    false    205            ?           2606    16465    contract contract_address_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_address_key UNIQUE (address);
 G   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_address_key;
       public            postgres    false    204            ?           2606    16463    contract contract_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY ("contractID");
 @   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_pkey;
       public            postgres    false    204            ?           2606    16563    party party_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY ("partyID", "contractID");
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    206    206            ?           2606    16558    userinfo userinfo_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_email_key;
       public            postgres    false    203            ?           2606    16458    userinfo userinfo_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY ("userID");
 @   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_pkey;
       public            postgres    false    203            ?           2606    16489 #   condition condition_contractID_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT "condition_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");
 O   ALTER TABLE ONLY public.condition DROP CONSTRAINT "condition_contractID_fkey";
       public          postgres    false    204    205    3042            ?           2606    16552    contract contract_owner_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_owner_fkey FOREIGN KEY (owner) REFERENCES public.userinfo("userID") NOT VALID;
 F   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_owner_fkey;
       public          postgres    false    3038    204    203            ?           2606    16564    party party_contractID_fkey    FK CONSTRAINT     ?   ALTER TABLE ONLY public.party
    ADD CONSTRAINT "party_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");
 G   ALTER TABLE ONLY public.party DROP CONSTRAINT "party_contractID_fkey";
       public          postgres    false    204    206    3042            j   n   x??ͱ?0??<?-??Q7l@%???#!?f??Oz?H,1???????)?	????R?^?[?<*?????????
*?u塽??????An?#	f??'??s_?@)/      i   ?   x??ͻ?0 ??<\???? ??l#!??? ??^ѭ???I4?o!s??WG????z??A>e??l?؋`?5?G?????7??x&sg7?H?Y;?<?k??4S???\rP??Ш?M)?9?.X      k   9   x?K4HMMJ??ԵL6H?5IM??MJ2K?5KJ?LJ1?0H44?L$?Ȉ3?+F??? ???      h   q   x?U?1? @????&??-?b??"?TM?r?6ݺ??A3-??????BRe?sF!ro????T?Ga??????e?f?? bh?\?B!!)??2?m?G????>y??)P(?     