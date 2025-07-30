"use client";
import React, { useState } from "react";
import styles from "./register.module.css";

export default function RegisterPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch("https://localhost:7175/api/Usuarios/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha })
            });
            if (!res.ok) {
                const msg = await res.text();
                setError(msg || "Erro ao registrar.");
                setLoading(false);
                return;
            }
            const data = await res.json();
            const token = data.Token || data.token;
            if (token) {
                localStorage.setItem("token", token);
                localStorage.setItem("usuarioId", data.Id || data.id);
                window.location.href = "/dashboard";
            } else {
                setError("Retorno inválido do servidor.");
            }
        } catch {
            setError("Erro ao conectar ao servidor.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.authCard}>
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nome" className={styles.input} required value={nome} onChange={e => setNome(e.target.value)} />
                    <input type="email" placeholder="E-mail" className={styles.input} required value={email} onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Senha" className={styles.input} required value={senha} onChange={e => setSenha(e.target.value)} />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>
                {error && <div className={styles.errorMsg}>{error}</div>}
                <p className={styles.linkText}>
                    Já tem conta? <a href="/login">Entrar</a>
                </p>
            </div>
        </div>
    );
}
