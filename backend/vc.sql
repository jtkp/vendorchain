PGDMP     !    9                y            vc    12.0    12.0     Z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            [           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            \           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            ]           1262    16453    vc    DATABASE     `   CREATE DATABASE vc WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';
    DROP DATABASE vc;
                postgres    false            �            1259    16481 	   condition    TABLE     �   CREATE TABLE public.condition (
    "conditionID" uuid NOT NULL,
    description character varying(100),
    category character varying(20),
    operator character varying(10),
    value numeric,
    "contractID" uuid
);
    DROP TABLE public.condition;
       public         heap    postgres    false            �            1259    16459    contract    TABLE       CREATE TABLE public.contract (
    "contractID" uuid NOT NULL,
    title character varying(20),
    description character varying(100),
    creation_date date,
    last_updated_date date,
    state character varying(20),
    address character varying(100)
);
    DROP TABLE public.contract;
       public         heap    postgres    false            �            1259    16466    party    TABLE     y   CREATE TABLE public.party (
    "partyID" uuid NOT NULL,
    "userID" uuid,
    "contractID" uuid,
    join_date date
);
    DROP TABLE public.party;
       public         heap    postgres    false            �            1259    16454    userinfo    TABLE     �   CREATE TABLE public.userinfo (
    "userID" uuid NOT NULL,
    name character varying(20),
    email character varying(40),
    password character varying(20)
);
    DROP TABLE public.userinfo;
       public         heap    postgres    false            W          0    16481 	   condition 
   TABLE DATA           h   COPY public.condition ("conditionID", description, category, operator, value, "contractID") FROM stdin;
    public          postgres    false    205   �       U          0    16459    contract 
   TABLE DATA           v   COPY public.contract ("contractID", title, description, creation_date, last_updated_date, state, address) FROM stdin;
    public          postgres    false    203   p       V          0    16466    party 
   TABLE DATA           M   COPY public.party ("partyID", "userID", "contractID", join_date) FROM stdin;
    public          postgres    false    204   �       T          0    16454    userinfo 
   TABLE DATA           C   COPY public.userinfo ("userID", name, email, password) FROM stdin;
    public          postgres    false    202   P       �           2606    16488    condition condition_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY ("conditionID");
 B   ALTER TABLE ONLY public.condition DROP CONSTRAINT condition_pkey;
       public            postgres    false    205            �           2606    16465    contract contract_address_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_address_key UNIQUE (address);
 G   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_address_key;
       public            postgres    false    203            �           2606    16463    contract contract_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY ("contractID");
 @   ALTER TABLE ONLY public.contract DROP CONSTRAINT contract_pkey;
       public            postgres    false    203            �           2606    16470    party party_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY ("partyID");
 :   ALTER TABLE ONLY public.party DROP CONSTRAINT party_pkey;
       public            postgres    false    204            �           2606    16458    userinfo userinfo_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY ("userID");
 @   ALTER TABLE ONLY public.userinfo DROP CONSTRAINT userinfo_pkey;
       public            postgres    false    202            �           2606    16489 #   condition condition_contractID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.condition
    ADD CONSTRAINT "condition_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");
 O   ALTER TABLE ONLY public.condition DROP CONSTRAINT "condition_contractID_fkey";
       public          postgres    false    205    3022    203            �           2606    16476    party party_contractID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT "party_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");
 G   ALTER TABLE ONLY public.party DROP CONSTRAINT "party_contractID_fkey";
       public          postgres    false    203    204    3022            �           2606    16471    party party_userID_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.party
    ADD CONSTRAINT "party_userID_fkey" FOREIGN KEY ("userID") REFERENCES public.userinfo("userID");
 C   ALTER TABLE ONLY public.party DROP CONSTRAINT "party_userID_fkey";
       public          postgres    false    204    3018    202            W   n   x��ͱ�0��<�-��Q7l@%���#!�f��Oz�H,1������)�	����R�^�[�<*���������
*�u塽������An?#	f��'��s_�@)/      U   }   x�M�1�  �^�P�I��t���Y�EQ�ߎ�n����d� זh�C5�9q�Ţ:E���m�S�>�֏�ȡ��?�������:���4�+!�.OL-����s���H�nZ�/�%z      V   C   x��ʹ�0����=��z!�٢�(6ީU\�ȥ�Y� �7:��1tZ����O�����!�!"/)!�      T   H   x�K4HMMJ��ԵL6H�5IM��MJ2K�5KJ�LJ1�0H44�,N�K B/9?����ؤ�<��+F��� ��_     