"use client";
import React, { useState } from "react";
import styles from "./profile.module.css";
import { FaUserCircle, FaEnvelope, FaLock } from "react-icons/fa";

export default function ProfilePage() {
    const [form, setForm] = useState({
        nome: "João Usuário",
        email: "joao@email.com",
        senhaAtual: "",
        senhaNova: "",
        senhaConfirmacao: ""
    });
    const [edit, setEdit] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    }

    const [success, setSuccess] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (edit) {
            if (form.senhaNova || form.senhaConfirmacao || form.senhaAtual) {
                if (!form.senhaAtual) {
                    setError("Digite sua senha atual.");
                    setSuccess("");
                    return;
                }
                if (form.senhaNova.length < 6) {
                    setError("A nova senha deve ter pelo menos 6 caracteres.");
                    setSuccess("");
                    return;
                }
                if (form.senhaNova !== form.senhaConfirmacao) {
                    setError("A confirmação da senha não corresponde à nova senha.");
                    setSuccess("");
                    return;
                }
            }
            setEdit(false);
            setSuccess("Perfil atualizado com sucesso!");
            setForm({ ...form, senhaAtual: "", senhaNova: "", senhaConfirmacao: "" });
        }
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
                            disabled={!edit}
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
                            disabled={!edit}
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
                                />
                            </div>
                        </>
                    )}
                </div>
                {error && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}
                {success && <div style={{ color: "#22c55e", textAlign: "center", marginBottom: "1rem" }}>{success}</div>}
                <div className={styles.actions}>
                    {!edit ? (
                        <button type="button" className={styles.button} onClick={() => setEdit(true)}>
                            Editar Perfil
                        </button>
                    ) : (
                        <button type="submit" className={styles.button}>
                            <FaLock style={{ marginRight: 8 }} /> Salvar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
