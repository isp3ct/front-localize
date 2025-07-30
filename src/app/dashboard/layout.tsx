"use client";
import React from "react";
import Link from "next/link";
import { FaBuilding, FaSearch, FaUserCircle, FaHome, FaSignOutAlt } from "react-icons/fa";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioId");
        window.location.href = "/login";
    }
    return (
        <div className={styles.dashboardContainer}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <FaHome size={32} className={styles.sidebarLogo} />
                    <span className={styles.sidebarTitle}>Localize</span>
                </div>
                <nav className={styles.sidebarNav}>
                    <Link href="/dashboard" className={styles.sidebarItem}>
                        <FaHome size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/dashboard/company-create" className={styles.sidebarItem}>
                        <FaBuilding size={20} />
                        <span>Cadastrar Empresa</span>
                    </Link>
                    <Link href="/dashboard/company-list" className={styles.sidebarItem}>
                        <FaSearch size={20} />
                        <span>Buscar Empresa</span>
                    </Link>
                    <Link href="/dashboard/profile" className={styles.sidebarItem}>
                        <FaUserCircle size={20} />
                        <span>Perfil</span>
                    </Link>
                    <button type="button" className={`${styles.sidebarItem} ${styles.logoutButton}`} onClick={handleLogout}>
                        <FaSignOutAlt size={20} className={styles.logoutIcon} />
                        <span>Sair</span>
                    </button>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                <header className={styles.headerPlaceholder}>
                    <h1>Bem-vindo ao Sistema de Gestão de Empresas</h1>
                    <p>Gerencie empresas de forma fácil e organizada.</p>
                </header>
                <section className={styles.contentArea}>{children}</section>
            </main>
        </div>
    );
}
