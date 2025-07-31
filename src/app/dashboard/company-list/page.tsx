"use client";
import React, { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import styles from "./companyList.module.css";

export default function CompanyListPage() {
    useAuthGuard();
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
        ativo?: boolean;
    };
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState<Empresa | null>(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [confirmModal, setConfirmModal] = useState<{ open: boolean, empresa: Empresa | null }>({ open: false, empresa: null });
    const pageSize = 5;

    useEffect(() => {
        async function fetchEmpresas() {
            const token = localStorage.getItem("token");
            if (!token) return setError("Usuário não autenticado.");
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HTTPS}/api/Empresas/minhas`, {
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

    function removeMascaraCnpj(cnpj: string) {
        return cnpj.replace(/\D/g, "");
    }

    const empresasFiltradas = empresas.filter(e => {
        const searchLower = search.toLowerCase();
        const cnpjEmpresa = e.cnpj || "";
        if (e.nomeEmpresarial.toLowerCase().includes(searchLower)) return true;
        if (cnpjEmpresa.includes(search)) return true;
        if (removeMascaraCnpj(cnpjEmpresa).includes(removeMascaraCnpj(search))) return true;
        return false;
    });

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
                placeholder="Buscar por CNPJ..."
                value={search}
                maxLength={18}
                inputMode="numeric"
                onChange={e => {
                    let v = e.target.value.replace(/\D/g, "").slice(0, 14);
                    v = v.replace(/(\d{2})(\d)/, "$1.$2");
                    v = v.replace(/(\d{3})(\d)/, "$1.$2");
                    v = v.replace(/(\d{3})(\d)/, "$1/$2");
                    v = v.replace(/(\d{4})(\d)/, "$1-$2");
                    setSearch(v);
                    setPage(1);
                }}
            />
            {error && <div className={styles.empty}>{error}</div>}
            <div className={styles.list}>
                {empresasPaginadas.filter(e => e.ativo === true).length === 0 && !error ? (
                    <p className={styles.empty}>Nenhuma empresa encontrada.</p>
                ) : (
                    empresasPaginadas
                        .filter(e => e.ativo === true)
                        .map(e => (
                            <div key={e.id} className={styles.card} style={{ position: "relative", cursor: "pointer" }}>
                                <button
                                    className={styles.trashButton}
                                    title="Inativar empresa"
                                    onClick={ev => {
                                        ev.stopPropagation();
                                        setConfirmModal({ open: true, empresa: e });
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ef4444" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6zm2 3h14v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9zm5 2v7h2v-7h-2z" /></svg>
                                </button>
                                <div onClick={() => setEmpresaSelecionada(e)}>
                                    <strong>{e.nomeEmpresarial}</strong><br />
                                    <span>CNPJ: {e.cnpj}</span><br />
                                    <span>{e.municipio} - {e.uf}</span>
                                </div>
                            </div>
                        ))
                )}
            </div>

            {/* Modal de confirmação de exclusão */}
            {confirmModal.open && confirmModal.empresa && (
                <div className={styles.confirmModalOverlay}>
                    <div className={styles.confirmModalContent}>
                        <div className={styles.confirmModalTitle}>Confirmar Inativação</div>
                        <div className={styles.confirmModalText}>
                            Tem certeza que deseja inativar a empresa <strong>{confirmModal.empresa.nomeEmpresarial}</strong>?<br />
                            Essa ação não pode ser desfeita.
                        </div>
                        <div className={styles.confirmModalActions}>
                            <button
                                className={`${styles.confirmModalButton} ${styles.confirm}`}
                                onClick={async () => {
                                    const token = localStorage.getItem("token");
                                    try {
                                        const res = await fetch(`https://localhost:7175/api/Empresas/InactiveEmpresas?id=${confirmModal.empresa?.id}`, {
                                            method: "PUT",
                                            headers: {
                                                "Authorization": `Bearer ${token}`,
                                                "Content-Type": "application/json"
                                            }
                                        });
                                        if (res.ok) {
                                            setEmpresas(empresas.filter(emp => emp.id !== confirmModal.empresa?.id));
                                            setConfirmModal({ open: false, empresa: null });
                                        } else {
                                            alert("Erro ao inativar empresa.");
                                        }
                                    } catch {
                                        alert("Erro de conexão.");
                                    }
                                }}
                            >
                                Confirmar
                            </button >
                            <button
                                className={`${styles.confirmModalButton} ${styles.cancel}`}
                                onClick={() => setConfirmModal({ open: false, empresa: null })}
                            >
                                Cancelar
                            </button>
                        </div >
                    </div >
                </div >
            )}
            {
                totalPages > 1 && (
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
                )
            }

            {/* Modal de detalhes da empresa */}
            {
                empresaSelecionada && (
                    <div className={styles.modalOverlay} onClick={() => setEmpresaSelecionada(null)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <h3 className={styles.modalTitle}>Detalhes da Empresa</h3>
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
                )
            }
        </div >
    );
}
