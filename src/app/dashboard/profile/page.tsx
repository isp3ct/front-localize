
"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaLock, FaEdit } from "react-icons/fa";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import styles from "./profile.module.css";

export default function ProfilePage() {
    useAuthGuard();
    const [form, setForm] = useState({
        nome: "",
        email: "",
        senhaAtual: "",
        senhaNova: "",
        senhaConfirmacao: ""
    });
    const [editField, setEditField] = useState<null | "nome" | "email" | "senha">(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HTTPS}/api/Usuarios/perfil`, {
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
        setLoading(true);
        setError("");
        setSuccess("");
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Usuário não autenticado.");
            setLoading(false);
            return;
        }

        let body: any = {};
        if (editField === "nome") {
            body = { Nome: form.nome };
        } else if (editField === "email") {
            body = { Email: form.email };
        } else if (editField === "senha") {
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
            body = {
                SenhaAtual: form.senhaAtual,
                SenhaNova: form.senhaNova,
                SenhaConfirmacao: form.senhaConfirmacao
            };
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HTTPS}/api/Usuarios/perfil`, {
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
            setEditField(null);
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
                <h2 className={styles.userName}>
                    {editField === "nome" ? (
                        <form onSubmit={handleSubmit} className={styles.inlineForm}>
                            <input
                                className={styles.input}
                                id="nome"
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                disabled={loading}
                                style={{ width: 180 }}
                            />
                            <button type="submit" className={styles.inlineButton} disabled={loading}>
                                Salvar
                            </button>
                            <button type="button" className={styles.inlineButton} onClick={() => setEditField(null)} disabled={loading}>
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <>
                            {form.nome}
                            <FaEdit style={{ marginLeft: 8, cursor: "pointer" }} title="Editar nome" onClick={() => setEditField("nome")} />
                        </>
                    )}
                </h2>
                <span className={styles.userEmail}>
                    {editField === "email" ? (
                        <form onSubmit={handleSubmit} className={styles.inlineForm}>
                            <input
                                className={styles.input}
                                id="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                disabled={loading}
                                style={{ width: 200 }}
                            />
                            <button type="submit" className={styles.inlineButton} disabled={loading}>
                                Salvar
                            </button>
                            <button type="button" className={styles.inlineButton} onClick={() => setEditField(null)} disabled={loading}>
                                Cancelar
                            </button>
                        </form>
                    ) : (
                        <>
                            <FaEnvelope /> {form.email}
                            <FaEdit style={{ marginLeft: 8, cursor: "pointer" }} title="Editar e-mail" onClick={() => setEditField("email")} />
                        </>
                    )}
                </span>
            </div>
            <div style={{ marginTop: 32 }}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Alterar Senha</legend>
                    {editField === "senha" ? (
                        <form onSubmit={handleSubmit} className={styles.modalSenhaForm}>
                            <div className={styles.row}>
                                <input
                                    className={styles.input}
                                    id="senhaAtual"
                                    name="senhaAtual"
                                    type="password"
                                    value={form.senhaAtual}
                                    onChange={handleChange}
                                    placeholder="Senha atual"
                                    disabled={loading}
                                />
                            </div>
                            <div className={styles.row}>
                                <input
                                    className={styles.input}
                                    id="senhaNova"
                                    name="senhaNova"
                                    type="password"
                                    value={form.senhaNova}
                                    onChange={handleChange}
                                    placeholder="Nova senha"
                                    disabled={loading}
                                />
                            </div>
                            <div className={styles.row}>
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
                            <div className={styles.modalSenhaActions}>
                                <button type="submit" className={styles.modalSenhaButton} disabled={loading}>
                                    <FaLock style={{ marginRight: 8 }} /> Salvar
                                </button>
                                <button type="button" className={styles.modalSenhaButton} onClick={() => setEditField(null)} disabled={loading}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button type="button" className={styles.button} onClick={() => setEditField("senha")}
                            style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FaLock /> Alterar Senha
                        </button>
                    )}
                </fieldset>
            </div>
            {error && <div className={styles.errorMsg}>{error}</div>}
            {success && <div className={styles.successMsg}>{success}</div>}

        </div>
    );
}
