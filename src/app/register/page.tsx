
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./register.module.css";

export default function RegisterPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await fetch("https://localhost:7175/api/Usuarios/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha: password
                })
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data?.message || "Erro ao registrar usuário.");
                setLoading(false);
                return;
            }
            setSuccess("Usuário registrado com sucesso!");
            setTimeout(() => {
                router.push("/login");
            }, 1200);
        } catch (err) {
            setError("Erro de conexão com o servidor.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.registerContainer}>
            <div className={styles.authCard}>
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nome"
                        className={styles.input}
                        required
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="email"
                        placeholder="E-mail"
                        className={styles.input}
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className={styles.input}
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Registrando..." : "Registrar"}
                    </button>
                </form>
                {error && (
                    <div style={{ color: "#ef4444", marginTop: "0.5rem", fontSize: "0.95rem" }}>{error}</div>
                )}
                {success && (
                    <div style={{ color: "#22c55e", marginTop: "0.5rem", fontSize: "0.95rem" }}>{success}</div>
                )}
                <p className={styles.linkText}>
                    Já tem conta? <a href="/login">Entrar</a>
                </p>
            </div>
        </div>
    );
}
