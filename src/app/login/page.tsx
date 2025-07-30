
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://localhost:7175/api/Usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha: password
                })
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data?.message || "Usuário ou senha inválidos.");
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data?.token) {
                localStorage.setItem("token", data.token);
                router.push("/dashboard");
            } else {
                setError("Login mal sucedido.");
            }
        } catch (err) {
            setError("Erro de conexão com o servidor.");
        }
        setLoading(false);
    }

    return (
        <div className={styles.loginContainer}>
            <div className={styles.authCard}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
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
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
                {error && (
                    <div style={{ color: "#ef4444", marginTop: "0.5rem", fontSize: "0.95rem" }}>{error}</div>
                )}
                <p className={styles.linkText}>
                    Não tem conta? <a href="/register">Registre-se</a>
                </p>
            </div>
        </div>
    );
}
