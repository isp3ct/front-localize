"use client";
import React, { useState } from "react";
import styles from "./companyList.module.css";


//Criado mock para simulação. Ainda implementar chamada ao backend
const mockEmpresas = Array.from({ length: 32 }, (_, i) => ({
    id: String(i + 1),
    nomeEmpresarial: `Empresa Exemplo ${i + 1}`,
    cnpj: `${String(i).padStart(2, "0")}.${String(i).padStart(3, "0")}.000/0001-${String(i).padStart(2, "0")}`,
    municipio: i % 2 === 0 ? "São Paulo" : "Rio de Janeiro",
    uf: i % 2 === 0 ? "SP" : "RJ"
}));

export default function CompanyListPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 8;

    const empresasFiltradas = mockEmpresas.filter(e =>
        e.nomeEmpresarial.toLowerCase().includes(search.toLowerCase()) ||
        e.cnpj.includes(search)
    );

    const totalPages = Math.ceil(empresasFiltradas.length / pageSize);
    const empresasPaginadas = empresasFiltradas.slice((page - 1) * pageSize, page * pageSize);

    function handlePageChange(newPage: number) {
        setPage(newPage);
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Buscar Empresa</h2>
            <input
                className={styles.input}
                type="text"
                placeholder="Buscar por nome ou CNPJ..."
                value={search}
                onChange={e => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
            />
            <div className={styles.list}>
                {empresasPaginadas.length === 0 ? (
                    <p className={styles.empty}>Nenhuma empresa encontrada.</p>
                ) : (
                    empresasPaginadas.map(e => (
                        <div key={e.id} className={styles.card}>
                            <strong>{e.nomeEmpresarial}</strong>
                            <span>CNPJ: {e.cnpj}</span>
                            <span>{e.municipio} - {e.uf}</span>
                        </div>
                    ))
                )}
            </div>
            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >
                        Anterior
                    </button>
                    <span className={styles.pageInfo}>
                        Página {page} de {totalPages}
                    </span>
                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >
                        Próxima
                    </button>
                </div>
            )}
        </div>
    );
}
