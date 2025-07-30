"use client";

import React, { useState } from "react";

type Atividade = {
    code: string;
    text: string;
};

type FormType = {
    nomeEmpresarial: string;
    nomeFantasia: string;
    cnpj: string;
    situacao: string;
    abertura: string;
    tipo: string;
    naturezaJuridica: string;
    atividadePrincipal: string;
    atividadesPrincipais: Atividade[];
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
};
import styles from "./companyCreate.module.css";

export default function CompanyCreatePage() {
    function maskCnpj(value: string) {
        let v = value.replace(/\D/g, "").slice(0, 14);
        v = v.replace(/(\d{2})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1/$2");
        v = v.replace(/(\d{4})(\d)/, "$1-$2");
        return v;
    }
    const [cnpjConsulta, setCnpjConsulta] = useState("");
    const [form, setForm] = useState<FormType>({
        nomeEmpresarial: "",
        nomeFantasia: "",
        cnpj: "",
        situacao: "",
        abertura: "",
        tipo: "",
        naturezaJuridica: "",
        atividadePrincipal: "",
        atividadesPrincipais: [],
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: ""
    });
    const [consultaFeita, setConsultaFeita] = useState(false);
    const [loadingConsulta, setLoadingConsulta] = useState(false);
    const [errorConsulta, setErrorConsulta] = useState("");
    const [showToast, setShowToast] = useState(false);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        if (name === "cnpjConsulta") {
            setCnpjConsulta(maskCnpj(value));
        } else if (name === "cnpj") {
            setForm({ ...form, cnpj: maskCnpj(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    }

    async function consultarCNPJ() {
        setLoadingConsulta(true);
        setErrorConsulta("");
        setConsultaFeita(false);
        try {
            const token = localStorage.getItem("token");
            const cnpjBruto = cnpjConsulta.replace(/\D/g, "");
            const res = await fetch(`https://localhost:7175/api/Empresas/consultar-cnpj/${cnpjBruto}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                }
            );
            if (!res.ok) {
                setErrorConsulta("CNPJ não encontrado ou inválido.");
                setLoadingConsulta(false);
                return;
            }
            const data = await res.json();
            setForm({
                nomeEmpresarial: data.nome || "",
                nomeFantasia: data.fantasia || "",
                cnpj: data.cnpj || cnpjConsulta,
                situacao: data.situacao || "",
                abertura: data.abertura || "",
                tipo: data.tipo || "",
                naturezaJuridica: data.natureza_juridica || "",
                atividadePrincipal: Array.isArray(data.atividade_principal) && data.atividade_principal[0]?.text ? data.atividade_principal[0].text : "",
                atividadesPrincipais: Array.isArray(data.atividade_principal) ? data.atividade_principal : [{ code: "", text: "Não informado" }],
                logradouro: data.logradouro || "",
                numero: data.numero || "",
                complemento: data.complemento || "",
                bairro: data.bairro || "",
                municipio: data.municipio || "",
                uf: data.uf || "",
                cep: data.cep || ""
            });
            setConsultaFeita(true);
        } catch {
            setErrorConsulta("Erro ao consultar CNPJ.");
        }
        setLoadingConsulta(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoadingConsulta(true);
        setErrorConsulta("");
        try {
            const token = localStorage.getItem("token");
            let usuarioId = localStorage.getItem("usuarioId")?.trim();
            const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!usuarioId || !guidRegex.test(usuarioId)) {
                setErrorConsulta("Usuário não identificado. Faça login novamente.");
                setLoadingConsulta(false);
                return;
            }
            const normalize = (value: string) => {
                if (!value || value.trim() === "") return "Não informado";
                return value;
            };
            let atividadesPrincipais = form.atividadesPrincipais;
            if (!Array.isArray(atividadesPrincipais) || atividadesPrincipais.length === 0) {
                atividadesPrincipais = [{ code: "", text: "Não informado" }];
            } else {
                atividadesPrincipais = atividadesPrincipais.map(a => ({
                    code: a.code || "",
                    text: a.text || "Não informado"
                }));
            }
            const dto = {
                NomeEmpresarial: normalize(form.nomeEmpresarial),
                NomeFantasia: normalize(form.nomeFantasia),
                Cnpj: normalize(form.cnpj.replace(/\D/g, "")),
                Situacao: normalize(form.situacao),
                Abertura: normalize(form.abertura),
                Tipo: normalize(form.tipo),
                NaturezaJuridica: normalize(form.naturezaJuridica),
                AtividadesPrincipais: atividadesPrincipais,
                Logradouro: normalize(form.logradouro),
                Numero: normalize(form.numero),
                Complemento: normalize(form.complemento),
                Bairro: normalize(form.bairro),
                Municipio: normalize(form.municipio),
                Uf: normalize(form.uf),
                Cep: normalize(form.cep),
                UsuarioId: usuarioId
            };
            const res = await fetch("https://localhost:7175/api/Empresas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { "Authorization": `Bearer ${token}` } : {})
                },
                body: JSON.stringify(dto)
            });
            if (!res.ok) {
                const errorText = await res.text();
                if (errorText.includes("Já existe uma empresa cadastrada com este CNPJ.")) {
                    setErrorConsulta("Já existe uma empresa cadastrada com este CNPJ.");
                } else {
                    setErrorConsulta(errorText || "Erro ao cadastrar empresa.");
                }
                setLoadingConsulta(false);
                return;
            }
            setErrorConsulta("Empresa cadastrada com sucesso!");
            setConsultaFeita(false);
            setForm({
                nomeEmpresarial: "",
                nomeFantasia: "",
                cnpj: "",
                situacao: "",
                abertura: "",
                tipo: "",
                naturezaJuridica: "",
                atividadePrincipal: "",
                atividadesPrincipais: [],
                logradouro: "",
                numero: "",
                complemento: "",
                bairro: "",
                municipio: "",
                uf: "",
                cep: ""
            });
            setCnpjConsulta("");
        } catch {
            setErrorConsulta("Erro ao cadastrar empresa.");
        }
        setLoadingConsulta(false);
    }

    return (
        <div className={styles.container}>
            <h2>Cadastrar Empresa</h2>
            <div className={styles.consultaBox}>
                <input
                    className={styles.input}
                    name="cnpjConsulta"
                    value={cnpjConsulta}
                    onChange={handleChange}
                    placeholder="Digite o CNPJ para consulta"
                    maxLength={18}
                />
                <button
                    type="button"
                    className={styles.button}
                    onClick={consultarCNPJ}
                    disabled={loadingConsulta || !cnpjConsulta}
                >
                    {loadingConsulta ? "Consultando..." : "Consultar"}
                </button>
            </div>
            {errorConsulta && (
                <div className={errorConsulta === "Empresa cadastrada com sucesso!" ? styles.successMsg : styles.errorMsg}>
                    {errorConsulta}
                </div>
            )}
            {consultaFeita && (
                <form className={styles.form} onSubmit={handleSubmit} style={{ marginTop: 32 }}>
                    <div className={styles.dadosBox}>
                        <h3>Dados retornados da API</h3>
                        <div className={styles.row}><span className={styles.label}>Nome Empresarial:</span> <span>{form.nomeEmpresarial}</span></div>
                        <div className={styles.row}><span className={styles.label}>Nome Fantasia:</span> <span>{form.nomeFantasia}</span></div>
                        <div className={styles.row}><span className={styles.label}>CNPJ:</span> <span>{maskCnpj(form.cnpj)}</span></div>
                        <div className={styles.row}><span className={styles.label}>Situação:</span> <span>{form.situacao}</span></div>
                        <div className={styles.row}><span className={styles.label}>Abertura:</span> <span>{form.abertura}</span></div>
                        <div className={styles.row}><span className={styles.label}>Tipo:</span> <span>{form.tipo}</span></div>
                        <div className={styles.row}><span className={styles.label}>Natureza Jurídica:</span> <span>{form.naturezaJuridica}</span></div>
                        <div className={styles.row}><span className={styles.label}>Atividade Principal:</span> <span>{form.atividadePrincipal}</span></div>
                        <div className={styles.row}><span className={styles.label}>Logradouro:</span> <span>{form.logradouro}</span></div>
                        <div className={styles.row}><span className={styles.label}>Número:</span> <span>{form.numero}</span></div>
                        <div className={styles.row}><span className={styles.label}>Complemento:</span> <span>{form.complemento}</span></div>
                        <div className={styles.row}><span className={styles.label}>Bairro:</span> <span>{form.bairro}</span></div>
                        <div className={styles.row}><span className={styles.label}>Município:</span> <span>{form.municipio}</span></div>
                        <div className={styles.row}><span className={styles.label}>UF:</span> <span>{form.uf}</span></div>
                        <div className={styles.row}><span className={styles.label}>CEP:</span> <span>{form.cep}</span></div>
                    </div>
                    <button type="submit" className={styles.button} style={{ marginTop: 32 }}>
                        Cadastrar
                    </button>
                </form>
            )}
        </div>
    );
}
