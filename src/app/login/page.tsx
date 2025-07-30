import React from "react";
import styles from "./login.module.css";

export default function LoginPage() {
    return (
        <div className={styles.loginContainer}>
            <div className={styles.authCard}>
                <h2>Login</h2>
                <form>
                    <input type="email" placeholder="E-mail" className={styles.input} required />
                    <input type="password" placeholder="Senha" className={styles.input} required />
                    <button type="submit" className={styles.button}>Entrar</button>
                </form>
                <p className={styles.linkText}>
                    Não tem conta? <a href="/register">Registre-se</a>
                </p>
            </div>
        </div>
    );
}
