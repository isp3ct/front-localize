import React from "react";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebarPlaceholder}>
                {/* Sidebar será implementada em outra branch */}
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.headerPlaceholder}>
                    {/* Header simples */}
                    <h1>Bem-vindo ao Sistema de Gestão de Empresas</h1>
                    <p>Gerencie empresas de forma fácil e organizada.</p>
                </header>
                <section className={styles.contentArea}>
                    {children}
                </section>
            </main>
        </div>
    );
}
