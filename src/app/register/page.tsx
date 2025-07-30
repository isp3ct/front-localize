import React from "react";
import styles from "./register.module.css";

export default function RegisterPage() {
    return (
        <div className={styles.registerContainer}>
            <div className={styles.authCard}>
                <h2>Registro</h2>
                <form>
                    <input type="text" placeholder="Nome" className={styles.input} required />
                    <input type="email" placeholder="E-mail" className={styles.input} required />
                    <input type="password" placeholder="Senha" className={styles.input} required />
                    <button type="submit" className={styles.button}>Registrar</button>
                </form>
                <p className={styles.linkText}>
                    Já tem conta? <a href="/login">Entrar</a>
                </p>
            </div>
        </div>
    );
}
