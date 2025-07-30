"use client";
import React, { useState, useEffect } from "react";
import styles from "./companyList.module.css";

export default function CompanyListPage() {
    type Empresa = {
        id: string;
        nomeEmpresarial: string;
        nomeFantasia?: string;
        cnpj: string;
        situacao?: string;
        dataAbertura?: string;
        tipo?: string;
        naturezaJuridica?: string;
        atividadesPrincipais?: string[];
        logradouro?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        municipio: string;
        uf: string;
        cep?: string;
        usuarioId?: string;
        empresaId?: string;
        filial?: string;
    };
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const pageSize = 5;

    useEffect(() => {
        async function fetchEmpresas() {
            const token = localStorage.getItem("token");
            if (!token) return setError("Usuário não autenticado.");
            try {
                const res = await fetch("https://localhost:7175/api/Empresas/minhas", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (!res.ok) {
                    const msg = await res.text();
                    setError(msg || "Erro ao buscar empresas.");
                    setEmpresas([]);
                    return;
                }
                const data = await res.json();
                setEmpresas(data);
            } catch {
                setError("Erro de conexão ao buscar empresas.");
                setEmpresas([]);
            }
        }
        fetchEmpresas();
    }, []);

    const empresasFiltradas = empresas.filter(e =>
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
            {error && <div className={styles.empty}>{error}</div>}
            <div className={styles.list}>
                {empresasPaginadas.length === 0 && !error ? (
                    <p className={styles.empty}>Nenhuma empresa encontrada.</p>
                ) : (
                    empresasPaginadas.map(e => (
                        <div key={e.id} className={styles.card} onClick={() => setEmpresaSelecionada(e)} style={{ cursor: "pointer" }}>
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

            {/* Modal de detalhes da empresa */}
            {empresaSelecionada && (
                <div className={styles.modalOverlay} onClick={() => setEmpresaSelecionada(null)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Detalhes da Empresa</h3>
                        <p><strong>ID:</strong> {empresaSelecionada.id}</p>
                        <p><strong>Nome Empresarial:</strong> {empresaSelecionada.nomeEmpresarial}</p>
                        {empresaSelecionada.nomeFantasia && <p><strong>Nome Fantasia:</strong> {empresaSelecionada.nomeFantasia}</p>}
                        <p><strong>CNPJ:</strong> {empresaSelecionada.cnpj}</p>
                        {empresaSelecionada.situacao && <p><strong>Situação:</strong> {empresaSelecionada.situacao}</p>}
                        {empresaSelecionada.dataAbertura && <p><strong>Data de Abertura:</strong> {empresaSelecionada.dataAbertura}</p>}
                        {empresaSelecionada.tipo && <p><strong>Tipo:</strong> {empresaSelecionada.tipo}</p>}
                        {empresaSelecionada.naturezaJuridica && <p><strong>Natureza Jurídica:</strong> {empresaSelecionada.naturezaJuridica}</p>}
                        {empresaSelecionada.atividadesPrincipais && empresaSelecionada.atividadesPrincipais.length > 0 && (
                            <div>
                                <strong>Atividades Principais:</strong>
                                <ul style={{ marginTop: 4, marginBottom: 4 }}>
                                    {empresaSelecionada.atividadesPrincipais.map((atv, idx) => (
                                        <li key={idx}>{atv}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {empresaSelecionada.logradouro && <p><strong>Logradouro:</strong> {empresaSelecionada.logradouro}</p>}
                        {empresaSelecionada.numero && <p><strong>Número:</strong> {empresaSelecionada.numero}</p>}
                        {empresaSelecionada.complemento && <p><strong>Complemento:</strong> {empresaSelecionada.complemento}</p>}
                        {empresaSelecionada.bairro && <p><strong>Bairro:</strong> {empresaSelecionada.bairro}</p>}
                        <p><strong>Município:</strong> {empresaSelecionada.municipio}</p>
                        <p><strong>UF:</strong> {empresaSelecionada.uf}</p>
                        {empresaSelecionada.cep && <p><strong>CEP:</strong> {empresaSelecionada.cep}</p>}
                        {empresaSelecionada.filial && <p><strong>Filial:</strong> {empresaSelecionada.filial}</p>}
                        {empresaSelecionada.empresaId && <p><strong>Empresa ID:</strong> {empresaSelecionada.empresaId}</p>}
                        <button className={styles.modalCloseButton} onClick={() => setEmpresaSelecionada(null)}>
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
