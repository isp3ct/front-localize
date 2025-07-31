"use client";
import React from "react";
import styles from "./login.module.css";

export default function LoginPage() {
    const [email, setEmail] = React.useState("");
    const [senha, setSenha] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HTTPS}/api/Usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });
            if (!res.ok) {
                setError("Usuário ou senha inválidos.");
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (data.token && data.id) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioId", data.id);
                window.location.href = "/dashboard/company-create";
            } else {
                setError("Retorno inválido do servidor");
            }
        } catch {
            setError("Erro ao conectar ao servidor.");
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
                    />
                    <input
                        type="password"
                        placeholder="Senha"
                        className={styles.input}
                        required
                        value={senha}
                        onChange={e => setSenha(e.target.value)}
                    />
                    <button type="submit" className={styles.button} disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                </form>
                {error && <div className={styles.errorMsg}>{error}</div>}
                <p className={styles.linkText}>
                    Não tem conta? <a href="/register">Registre-se</a>
                </p>
            </div>
        </div>
    );
}
