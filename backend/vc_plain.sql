--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0
-- Dumped by pg_dump version 12.0

-- Started on 2021-07-28 12:19:58 AEST

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
-- TOC entry 2 (class 3079 OID 16570)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3185 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 16481)
-- Name: condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condition (
    "conditionID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    description character varying(100),
    category character varying(20),
    operator character varying(10),
    value numeric,
    "contractID" uuid
);


ALTER TABLE public.condition OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16459)
-- Name: contract; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract (
    "contractID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying(20),
    description character varying(100),
    creation_date date DEFAULT CURRENT_DATE NOT NULL,
    state character varying(20),
    address character varying(100),
    owner uuid,
    index integer DEFAULT '-1'::integer
);


ALTER TABLE public.contract OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16559)
-- Name: party; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.party (
    "partyID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "contractID" uuid NOT NULL,
    confirm boolean DEFAULT false NOT NULL
);


ALTER TABLE public.party OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16454)
-- Name: userinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userinfo (
    "userID" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(20),
    email character varying(40),
    password character varying(20)
);


ALTER TABLE public.userinfo OWNER TO postgres;

--
-- TOC entry 3178 (class 0 OID 16481)
-- Dependencies: 205
-- Data for Name: condition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condition ("conditionID", description, category, operator, value, "contractID") FROM stdin;
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14	The internet speed should be bigger than 10 Mps.	Speed	>	100	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12
\.


--
-- TOC entry 3177 (class 0 OID 16459)
-- Dependencies: 204
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract ("contractID", title, description, creation_date, state, address, owner, index) FROM stdin;
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	vc	vendor chain contract	2021-07-25	Pending	0x14b81Db3C568d32274FBb3e64F9C85F86fBE5393	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	-1
9dfad162-2d57-4777-aba6-0a902ec155f8	dang	detail detail	2021-07-26	Pending	0x14b81Db3C568d32274FBb3e64F9C85F86fBE5394	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	-1
\.


--
-- TOC entry 3179 (class 0 OID 16559)
-- Dependencies: 206
-- Data for Name: party; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.party ("partyID", "contractID", confirm) FROM stdin;
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	f
49f59501-bb77-4c34-8488-5342beb7bd9b	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	t
\.


--
-- TOC entry 3176 (class 0 OID 16454)
-- Dependencies: 203
-- Data for Name: userinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userinfo ("userID", name, email, password) FROM stdin;
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	sang	sang@sang.com	1234qwer
88a1e8e8-b27f-402f-b9cb-21dc12601b9e	katrina	ktkt@ktkt.com	1234qwer
\.


--
-- TOC entry 3044 (class 2606 OID 16488)
-- Name: condition condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY ("conditionID");


--
-- TOC entry 3040 (class 2606 OID 16465)
-- Name: contract contract_address_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_address_key UNIQUE (address);


--
-- TOC entry 3042 (class 2606 OID 16463)
-- Name: contract contract_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY ("contractID");


--
-- TOC entry 3046 (class 2606 OID 16563)
-- Name: party party_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY ("partyID", "contractID");


--
-- TOC entry 3036 (class 2606 OID 16558)
-- Name: userinfo userinfo_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_email_key UNIQUE (email);


--
-- TOC entry 3038 (class 2606 OID 16458)
-- Name: userinfo userinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY ("userID");


--
-- TOC entry 3048 (class 2606 OID 16489)
-- Name: condition condition_contractID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT "condition_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");


--
-- TOC entry 3047 (class 2606 OID 16552)
-- Name: contract contract_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_owner_fkey FOREIGN KEY (owner) REFERENCES public.userinfo("userID") NOT VALID;


--
-- TOC entry 3049 (class 2606 OID 16564)
-- Name: party party_contractID_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT "party_contractID_fkey" FOREIGN KEY ("contractID") REFERENCES public.contract("contractID");


-- Completed on 2021-07-28 12:19:59 AEST

--
-- PostgreSQL database dump complete
--

