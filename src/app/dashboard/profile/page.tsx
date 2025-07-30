
"use client";
import React, { useState, useEffect } from "react";
import styles from "./profile.module.css";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";

export default function ProfilePage() {
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senhaAtual: "",
        senhaNova: "",
        senhaConfirmacao: ""
    });
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch("https://localhost:7175/api/Usuarios/perfil", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setForm(f => ({ ...f, nome: data.nome, email: data.email }));
                } else {
                    setError("Não foi possível carregar os dados do perfil.");
                }
            } catch {
                setError("Erro de conexão ao buscar perfil.");
            }
        }
        fetchProfile();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!edit) return;
        setLoading(true);
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        const body: any = {
            Nome: form.nome,
            Email: form.email
        };

        if (form.senhaNova || form.senhaConfirmacao || form.senhaAtual) {
            if (!form.senhaAtual) {
                setError("Digite sua senha atual.");
                setLoading(false);
                return;
            }
            if (form.senhaNova.length < 6) {
                setError("A nova senha deve ter pelo menos 6 caracteres.");
                setLoading(false);
                return;
            }
            if (form.senhaNova !== form.senhaConfirmacao) {
                setError("A confirmação da senha não corresponde à nova senha.");
                setLoading(false);
                return;
            }
            body.SenhaAtual = form.senhaAtual;
            body.SenhaNova = form.senhaNova;
            body.SenhaConfirmacao = form.senhaConfirmacao;
        }

        try {
            const res = await fetch("https://localhost:7175/api/Usuarios/perfil", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data?.message || "Erro ao atualizar perfil.");
                setLoading(false);
                return;
            }
            setSuccess("Perfil atualizado com sucesso!");
            setEdit(false);
            setForm(f => ({ ...f, senhaAtual: "", senhaNova: "", senhaConfirmacao: "" }));
        } catch {
            setError("Erro ao tentar atualizar perfil.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.profileCard}>
            <div className={styles.avatarArea}>
                <FaUserCircle className={styles.avatar} size={80} />
                <h2 className={styles.userName}>{form.nome}</h2>
                <span className={styles.userEmail}><FaEnvelope /> {form.email}</span>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Dados Pessoais</h3>
                    <div className={styles.row}>
                        <label className={styles.label} htmlFor="nome">Nome:</label>
                        <input
                            className={styles.input}
                            id="nome"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            disabled={!edit || loading}
                        />
                    </div>
                </div>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Dados de Acesso</h3>
                    <div className={styles.row}>
                        <label className={styles.label} htmlFor="email">E-mail:</label>
                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            disabled={!edit || loading}
                        />
                    </div>
                    {edit && (
                        <>
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="senhaAtual">Senha atual:</label>
                                <input
                                    className={styles.input}
                                    id="senhaAtual"
                                    name="senhaAtual"
                                    type="password"
                                    value={form.senhaAtual}
                                    onChange={handleChange}
                                    placeholder="Digite sua senha atual"
                                    disabled={loading}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="senhaNova">Nova senha:</label>
                                <input
                                    className={styles.input}
                                    id="senhaNova"
                                    name="senhaNova"
                                    type="password"
                                    value={form.senhaNova}
                                    onChange={handleChange}
                                    placeholder="Digite a nova senha"
                                    disabled={loading}
                                />
                            </div>
                            <div className={styles.row}>
                                <label className={styles.label} htmlFor="senhaConfirmacao">Confirme a nova senha:</label>
                                <input
                                    className={styles.input}
                                    id="senhaConfirmacao"
                                    name="senhaConfirmacao"
                                    type="password"
                                    value={form.senhaConfirmacao}
                                    onChange={handleChange}
                                    placeholder="Confirme a nova senha"
                                    disabled={loading}
                                />
                            </div>
                        </>
                    )}
                </div>
                {error && <div className={styles.errorMsg}>{error}</div>}
                {success && <div className={styles.successMsg}>{success}</div>}
                <div className={styles.actions}>
                    {!edit ? (
                        <button type="button" className={styles.button} onClick={() => setEdit(true)} disabled={loading}>
                            Editar Perfil
                        </button>
                    ) : (
                        <button type="submit" className={styles.button} disabled={loading}>
                            <FaLock style={{ marginRight: 8 }} /> Salvar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
