--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0
-- Dumped by pg_dump version 12.0

-- Started on 2021-07-29 10:35:01 AEST

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 206 (class 1259 OID 16712)
-- Name: condition; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.condition (
    address character varying(200) NOT NULL,
    name character varying(200) NOT NULL,
    operator character varying(20),
    value numeric(20,0)
);


ALTER TABLE public.condition OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16674)
-- Name: contract; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contract (
    index integer NOT NULL,
    description character varying(200),
    address character varying(200),
    owner character varying(200),
    title character varying(40)
);


ALTER TABLE public.contract OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16672)
-- Name: contract_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contract_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contract_index_seq OWNER TO postgres;

--
-- TOC entry 3172 (class 0 OID 0)
-- Dependencies: 203
-- Name: contract_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contract_index_seq OWNED BY public.contract.index;


--
-- TOC entry 205 (class 1259 OID 16697)
-- Name: party; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.party (
    payee character varying(200) NOT NULL,
    address character varying(200) NOT NULL
);


ALTER TABLE public.party OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16665)
-- Name: userinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.userinfo (
    address character varying(200) NOT NULL,
    name character varying(40),
    email character varying(40),
    password character varying(40),
    "isAdmin" boolean
);


ALTER TABLE public.userinfo OWNER TO postgres;

--
-- TOC entry 3019 (class 2604 OID 16677)
-- Name: contract index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract ALTER COLUMN index SET DEFAULT nextval('public.contract_index_seq'::regclass);


--
-- TOC entry 3166 (class 0 OID 16712)
-- Dependencies: 206
-- Data for Name: condition; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.condition (address, name, operator, value) FROM stdin;
zxczxc	bandwidth check	>	100
\.


--
-- TOC entry 3164 (class 0 OID 16674)
-- Dependencies: 204
-- Data for Name: contract; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contract (index, description, address, owner, title) FROM stdin;
1	qweert	zxczxc	asdasd	aaa
\.


--
-- TOC entry 3165 (class 0 OID 16697)
-- Dependencies: 205
-- Data for Name: party; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.party (payee, address) FROM stdin;
asdasd	zxczxc
\.


--
-- TOC entry 3162 (class 0 OID 16665)
-- Dependencies: 202
-- Data for Name: userinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.userinfo (address, name, email, password, "isAdmin") FROM stdin;
asdasd	sang	sang@sang.com	sang	t
\.


--
-- TOC entry 3173 (class 0 OID 0)
-- Dependencies: 203
-- Name: contract_index_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contract_index_seq', 1, true);


--
-- TOC entry 3031 (class 2606 OID 16716)
-- Name: condition condition_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_pkey PRIMARY KEY (address, name);


--
-- TOC entry 3025 (class 2606 OID 16691)
-- Name: contract contract_cntrctAddress_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_cntrctAddress_key" UNIQUE (address);


--
-- TOC entry 3027 (class 2606 OID 16682)
-- Name: contract contract_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT contract_pkey PRIMARY KEY (index);


--
-- TOC entry 3029 (class 2606 OID 16701)
-- Name: party party_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_pkey PRIMARY KEY (payee, address);


--
-- TOC entry 3021 (class 2606 OID 16671)
-- Name: userinfo userinfo_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_email_key UNIQUE (email);


--
-- TOC entry 3023 (class 2606 OID 16669)
-- Name: userinfo userinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (address);


--
-- TOC entry 3035 (class 2606 OID 16717)
-- Name: condition condition_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.condition
    ADD CONSTRAINT condition_address_fkey FOREIGN KEY (address) REFERENCES public.contract(address);


--
-- TOC entry 3032 (class 2606 OID 16692)
-- Name: contract contract_ownerAddress_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contract
    ADD CONSTRAINT "contract_ownerAddress_fkey" FOREIGN KEY (owner) REFERENCES public.userinfo(address);


--
-- TOC entry 3034 (class 2606 OID 16707)
-- Name: party party_address_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_address_fkey FOREIGN KEY (address) REFERENCES public.contract(address);


--
-- TOC entry 3033 (class 2606 OID 16702)
-- Name: party party_payee_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.party
    ADD CONSTRAINT party_payee_fkey FOREIGN KEY (payee) REFERENCES public.userinfo(address);


-- Completed on 2021-07-29 10:35:01 AEST

--
-- PostgreSQL database dump complete
--

