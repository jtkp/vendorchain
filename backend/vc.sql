PGDMP     /                     y            vendorchain    12.0    12.0     Q           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            R           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            S           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            T           1262    16393    vendorchain    DATABASE     i   CREATE DATABASE vendorchain WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE vendorchain;
                postgres    false            �            1259    16416 	   condition    TABLE     �   CREATE TABLE public.condition (
    "conditionID" integer NOT NULL,
    description "char",
    category "char",
    operator "char",
    value "char",
    "contractID" integer
);
    DROP TABLE public.condition;
       public         heap    postgres    false            �            1259    16404    contract    TABLE     �   CREATE TABLE public.contract (
    "contractID" integer NOT NULL,
    title "char",
    description "char",
    creation_date date,
    last_updated_date date,
    state "char",
    address "char",
    "userID" integer
);
    DROP TABLE public.contract;
       public         heap    postgres    false            �            1259    16399    user    TABLE     �   CREATE TABLE public."user" (
    "userID" integer NOT NULL,
    "firstName" "char",
    "lastName" "char",
    password "char",
    "isAdmin" boolean
);
    DROP TABLE public."user";
       public         heap    postgres    false            N          0    16416 	   condition 
   TABLE DATA           h   COPY public.condition ("conditionID", description, category, operator, value, "contractID") FROM stdin;
    public          postgres    false    204   4       M          0    16404    contract 
   TABLE DATA           �   COPY public.contract ("contractID", title, description, creation_date, last_updated_date, state, address, "userID") FROM stdin;
    public          postgres    false    203   Q       L          0    16399    user 
   TABLE DATA           X   COPY public."user" ("userID", "firstName", "lastName", password, "isAdmin") FROM stdin;
    public          postgres    false    202   n       �           2606    16420    condition condition_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY ("conditionID");
 B   ALTER TABLE ONLY public.condition DROP CONSTRAINT condition_pkey;
       public            postgres    false    204            �           2606    16410    contract contract_address_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_address_key UNIQUE (address);
 G   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_address_key;
       public            postgres    false    203            �           2606    16408    contract contract_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY ("contractID");
 @   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_pkey;
       public            postgres    false    203            �           2606    16403    user user_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY ("userID");
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public            postgres    false    202            �           2606    16421 #   condition condition_contractID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT "condition_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");
 O   ALTER TABLE ONLY public.condition DROP CONSTRAINT "condition_contractID_fkey";
       public          postgres    false    203    204    3017            �           2606    16411    contract contract_userID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_userID_fkey" FOREIGN KEY ("userID") REFERENCES public."user"("userID");
 I   ALTER TABLE ONLY public.contract DROP CONSTRAINT "contract_userID_fkey";
       public          postgres    false    3013    203    202            N      x������ � �      M      x������ � �      L      x������ � �     