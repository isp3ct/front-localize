
"use client";
import React, { useState, useEffect } from "react";
import { FaUserCircle, FaEnvelope, FaLock, FaEdit } from "react-icons/fa";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import styles from "./profile.module.css";

export default function ProfilePage() {
    useAuthGuard();
    const [form, setForm] = useState({
        senhaAtual: "",
        senhaNova: "",
        senhaConfirmacao: ""
    });
    const [editField, setEditField] = useState<null | "senha">(null);
    const [user, setUser] = useState<{ nome: string; email: string } | null>(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (!editField) return;
        function handleClickOutside(e: MouseEvent) {
            const editForms = document.querySelectorAll('.edit-form, .senha-form');
            let clickedInside = false;
            editForms.forEach(form => {
                if (form.contains(e.target as Node)) {
                    clickedInside = true;
                }
            });
            if (!clickedInside) {
                setEditField(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [editField]);

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
                    setUser({ nome: data.nome, email: data.email });
                }
            } catch { }
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
        const body = {
            SenhaAtual: form.senhaAtual,
            SenhaNova: form.senhaNova,
            SenhaConfirmacao: form.senhaConfirmacao
        };

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
            setSuccess("Senha alterada com sucesso!");
            setEditField(null);
            setForm(f => ({ ...f, senhaAtual: "", senhaNova: "", senhaConfirmacao: "" }));
        } catch {
            setError("Erro ao tentar atualizar senha.");
        }
        setLoading(false);
    }

    function handleCancelEdit() {
        setForm(f => ({ ...f, senhaAtual: "", senhaNova: "", senhaConfirmacao: "" }));
        setEditField(null);
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <div className={styles.avatarArea}>
                    <FaUserCircle className={styles.avatar} size={80} />
                    {user && (
                        <>
                            <div className={styles.userName}>{user.nome}</div>
                            <div className={styles.userEmail}><FaEnvelope /> {user.email}</div>
                        </>
                    )}
                </div>
                <fieldset className={styles.fieldset + ' ' + styles.senhaFieldset}>
                    <legend className={styles.legend}>Alterar Senha</legend>
                    {editField === "senha" ? (
                        <form onSubmit={handleSubmit} className={styles.modalSenhaForm + ' senha-form'}>
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
                                    <FaLock className={styles.iconLeft} /> Salvar
                                </button>
                                <button type="button" className={styles.modalSenhaButton} onClick={handleCancelEdit} disabled={loading}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <button type="button" className={styles.button + ' ' + styles.senhaButton} onClick={() => setEditField("senha")}>
                            <FaLock className={styles.iconLeft} /> Alterar Senha
                        </button>
                    )}
                </fieldset>
                {error && <div className={styles.errorMsg}>{error}</div>}
                {success && <div className={styles.successMsg}>{success}</div>}
            </div>
        </div>
    );
}
