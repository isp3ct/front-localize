"use client";
import React, { useState } from "react";
import { FaBuilding, FaClock } from "react-icons/fa";
import styles from "./dashboard.module.css";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import { useAuthGuard } from "@/hooks/useAuthGuard";

type EmpresaResumo = {
  id: string;
  nomeEmpresarial: string;
  uf: string;
  dataCadastro: string;
};


export default function DashboardPage() {
  useAuthGuard();
  const [empresas, setEmpresas] = useState<EmpresaResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  React.useEffect(() => {
    async function fetchEmpresas() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_HTTPS}/api/Empresas/minhas`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) throw new Error("Erro ao buscar empresas");
        const data = await res.json();
        setEmpresas(Array.isArray(data) ? data.filter(e => e.ativo !== false) : []);
      } catch {
        setError("Erro ao buscar empresas cadastradas.");
      }
      setLoading(false);
    }
    fetchEmpresas();
  }, []);

  const totalEmpresas = empresas.length;
  const empresasRecentes = empresas.slice(0, 3);
  const empresasPorUF = empresas.reduce((acc: Record<string, number>, emp) => {
    acc[emp.uf] = (acc[emp.uf] || 0) + 1;
    return acc;
  }, {});

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const ufLabels = Object.keys(empresasPorUF);
  const ufData = Object.values(empresasPorUF);
  const baseColors = [
    "#6366f1",
    "#a5b4fc",
    "#818cf8",
    "#f59e42",
    "#ef4444",
    "#22d3ee",
    "#84cc16",
    "#eab308",
    "#f472b6",
    "#38bdf8"
  ];
  const pieData = {
    labels: ufLabels,
    datasets: [
      {
        data: ufData,
        backgroundColor: baseColors.map((c, idx) =>
          activeIndex === null ? c : idx === activeIndex ? c : c + "99"
        ),
        borderWidth: 2,
        borderColor: "#18181b",
        hoverOffset: 24,
      }
    ]
  };

  return (
    <div className={styles.dashboardResumo}>
      <h2>Dashboard</h2>
      <p>Bem-vindo! Aqui você poderá gerenciar suas empresas cadastradas.</p>
      <div className={styles.cardsResumoTop}>
        <div className={styles.cardResumo}>
          <div className={styles.cardIconBox}><FaBuilding size={32} className={styles.cardIcon} /></div>
          <span className={styles.cardLabel}>Total de Empresas</span>
          <span className={styles.cardValor}>{loading ? "..." : totalEmpresas}</span>
        </div>
        <div className={styles.cardResumo}>
          <div className={styles.cardIconBox}><FaClock size={32} className={styles.cardIcon} /></div>
          <span className={styles.cardLabel}>Empresas Recentes</span>
          <ul className={styles.cardLista}>
            {loading ? <li>...</li> : empresasRecentes.map(emp => (
              <li key={emp.id}>{emp.nomeEmpresarial}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.cardsResumoBottom}>
        <div className={styles.cardResumoFull}>
          <span className={styles.cardLabel}>Empresas por UF</span>
          <div className={styles.pizzaBox}>
            {loading ? (
              <div style={{ color: "#a5b4fc", textAlign: "center" }}>Carregando...</div>
            ) : ufLabels.length === 0 ? (
              <div style={{ color: "#a5b4fc", textAlign: "center" }}>Sem dados</div>
            ) : (
              <>
                <div className={styles.pizzaChartArea}>
                  <Pie
                    data={pieData}
                    options={{
                      plugins: { legend: { display: false } },
                      animation: {
                        duration: 400,
                        easing: "easeOutQuart"
                      }
                    }}
                  />
                </div>
                <div className={styles.pieLegend}>
                  {ufLabels.map((uf, idx) => (
                    <div
                      key={uf}
                      className={styles.pieLegendItem}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(null)}
                      style={activeIndex === idx ? { fontWeight: 700, color: baseColors[idx], background: "#22223b", borderRadius: 6, padding: "2px 8px" } : {}}
                    >
                      <span className={styles.pieColor} style={{ background: baseColors[idx], opacity: activeIndex === null || activeIndex === idx ? 1 : 0.5 }}></span>
                      <span>{uf}: {ufData[idx]}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
}
