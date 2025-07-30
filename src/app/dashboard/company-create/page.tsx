"use client";
import React, { useState } from "react";
import styles from "./companyCreate.module.css";

export default function CompanyCreatePage() {
    const [form, setForm] = useState({
        nomeEmpresarial: "",
        nomeFantasia: "",
        cnpj: "",
        situacao: "",
        abertura: "",
        tipo: "",
        naturezaJuridica: "",
        atividadePrincipal: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        municipio: "",
        uf: "",
        cep: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // Implementar chamada do backend para cadastrar a empresa
        alert("Empresa cadastrada com sucesso!");
    }

    return (
        <div className={styles.container}>
            <h2>Cadastrar Empresa</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.row}>
                    <input className={styles.input} name="nomeEmpresarial" value={form.nomeEmpresarial} onChange={handleChange} placeholder="Nome Empresarial" required />
                    <input className={styles.input} name="nomeFantasia" value={form.nomeFantasia} onChange={handleChange} placeholder="Nome Fantasia" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="cnpj" value={form.cnpj} onChange={handleChange} placeholder="CNPJ" required />
                    <input className={styles.input} name="situacao" value={form.situacao} onChange={handleChange} placeholder="Situação" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="abertura" value={form.abertura} onChange={handleChange} placeholder="Data de Abertura" />
                    <input className={styles.input} name="tipo" value={form.tipo} onChange={handleChange} placeholder="Tipo" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="naturezaJuridica" value={form.naturezaJuridica} onChange={handleChange} placeholder="Natureza Jurídica" />
                    <input className={styles.input} name="atividadePrincipal" value={form.atividadePrincipal} onChange={handleChange} placeholder="Atividade Principal" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="logradouro" value={form.logradouro} onChange={handleChange} placeholder="Logradouro" />
                    <input className={styles.input} name="numero" value={form.numero} onChange={handleChange} placeholder="Número" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="complemento" value={form.complemento} onChange={handleChange} placeholder="Complemento" />
                    <input className={styles.input} name="bairro" value={form.bairro} onChange={handleChange} placeholder="Bairro" />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="municipio" value={form.municipio} onChange={handleChange} placeholder="Município" />
                    <input className={styles.input} name="uf" value={form.uf} onChange={handleChange} placeholder="UF" maxLength={2} />
                </div>
                <div className={styles.row}>
                    <input className={styles.input} name="cep" value={form.cep} onChange={handleChange} placeholder="CEP" />
                </div>
                <button type="submit" className={styles.button}>Cadastrar</button>
            </form>
        </div>
    );
}
