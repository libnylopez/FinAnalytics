import React, { useState, useMemo, useCallback } from 'react';
import Sidebar, { MENU_ITEMS } from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import DataInputView from './components/DataInputView';
import FinancialStatementsView from './components/FinancialStatementsView';
import RatiosDashboardView from './components/RatiosDashboardView';
import InvestmentEvaluationView from './components/InvestmentEvaluationView';
import ReportsView from './components/ReportsView';
import TeamModal from './components/TeamModal';
import useTheme from './hooks/useTheme';
import PageIntro from './components/ui/PageIntro';

import {
  defaultFinancialInputs,
  sectorPresets,
  projectInfo
} from './data/mockFinancialData';

import {
  calculateIncomeStatement,
  calculateCashFlow,
  calculateRatios,
  calculateNPV,
  calculateIRR,
  calculatePayback,
  calculateDiscountedPayback,
  calculateScenarios,
  validateFinancialData
} from './utils/financialEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currency, setCurrency] = useState('GTQ');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const { preference: theme, setPreference: setTheme } = useTheme();

  // Preferencia visual: barra lateral contraída (no afecta datos financieros)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('rajil_sidebar_collapsed') === '1';
    } catch {
      return false;
    }
  });
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('rajil_sidebar_collapsed', next ? '1' : '0');
      } catch {
        // sin almacenamiento: la preferencia dura solo esta sesión
      }
      return next;
    });
  }, []);

  // Estado central de entradas de la empresa
  const [inputs, setInputs] = useState(() => {
    try {
      const saved = localStorage.getItem('finanalytics_inputs');
      return saved ? JSON.parse(saved) : defaultFinancialInputs;
    } catch {
      return defaultFinancialInputs;
    }
  });

  const currencySymbol = currency === 'GTQ' ? 'Q' : '$';

  // Guardar en localStorage cuando se editan entradas
  const updateInputs = (updater) => {
    setInputs(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        localStorage.setItem('finanalytics_inputs', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleSectorPreset = (sectorName) => {
    if (sectorPresets[sectorName]) {
      updateInputs(sectorPresets[sectorName]);
    }
  };

  const handleResetDefaults = () => {
    updateInputs(defaultFinancialInputs);
  };

  // --- MOTOR MATEMÁTICO FINANCIERO EN TIEMPO REAL ---
  const incomeStatement = useMemo(() => {
    return calculateIncomeStatement(inputs);
  }, [inputs]);

  const cashFlow = useMemo(() => {
    return calculateCashFlow(inputs, incomeStatement);
  }, [inputs, incomeStatement]);

  const ratios = useMemo(() => {
    return calculateRatios(inputs, incomeStatement);
  }, [inputs, incomeStatement]);

  const investmentEvaluation = useMemo(() => {
    const wacc = Number(inputs.wacc) || 12;
    const initialCost = cashFlow.initialInvestment;
    const flows = cashFlow.operationalCashFlows;

    const npv = calculateNPV(wacc, initialCost, flows);
    const irr = calculateIRR(initialCost, flows);
    const paybackYears = calculatePayback(initialCost, flows);
    const discountedPaybackYears = calculateDiscountedPayback(wacc, initialCost, flows);
    const scenarios = calculateScenarios(inputs);

    // Indicadores de presentación: el motor devuelve 5 años tanto si la inversión
    // se recupera al final del año 5 como si no se recupera. Estos indicadores
    // permiten distinguir ambos casos en la interfaz sin modificar el motor.
    const paybackRecovered = cashFlow.cumulativeCashFlow[cashFlow.cumulativeCashFlow.length - 1] >= 0;
    const discountedPaybackRecovered = npv >= 0;

    return {
      wacc,
      initialCost,
      npv,
      irr,
      paybackYears,
      discountedPaybackYears,
      paybackRecovered,
      discountedPaybackRecovered,
      scenarios
    };
  }, [inputs, cashFlow]);

  const validations = useMemo(() => {
    return validateFinancialData(inputs);
  }, [inputs]);

  const activeTitle = MENU_ITEMS.find((item) => item.id === activeTab)?.label;

  // Apertura de cada módulo (el Resumen tiene su propio titular, construido con los resultados)
  const INTROS = {
    inputs: 'Información de la empresa, inversión, ventas y parámetros que alimentan todo el análisis.',
    statements: 'Estado de resultados y flujo de caja libre proyectados a cinco años.',
    ratios: 'Once indicadores de liquidez, rentabilidad y endeudamiento con las cifras del año 1.',
    evaluation: 'Criterios de decisión del proyecto y su sensibilidad ante cambios en las ventas.',
    reports: 'Dictamen formal listo para imprimir o guardar como PDF, y exportación de datos.'
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-canvas text-ink print:bg-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
        collapsed={sidebarCollapsed}
      />

      <div className="relative flex-1 flex flex-col min-w-0">
        <Header
          title={activeTitle}
          companyData={inputs}
          currency={currency}
          setCurrency={setCurrency}
          theme={theme}
          setTheme={setTheme}
          onOpenTeamModal={() => setIsTeamModalOpen(true)}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 px-2 sm:px-3 lg:pl-0 lg:pr-3 pb-3 print:p-0">
          {/* Hoja de trabajo: una sola superficie elevada por módulo; las secciones se separan con espacio y filetes */}
          <div className="sheet min-h-[calc(100vh-72px)] bg-surface border border-line rounded-[20px] shadow-sheet print:min-h-0 print:border-0 print:shadow-none print:rounded-none">
          <div className="max-w-[1120px] mx-auto px-5 sm:px-10 pt-8 sm:pt-12 pb-14 print:p-0 print:max-w-none">
          {/* Cada módulo entra con un fundido breve; la clave reinicia la animación al cambiar de sección */}
          <div key={activeTab} className="animate-rise-in print:animate-none">
          {activeTab !== 'dashboard' && (
            <PageIntro title={activeTitle} description={INTROS[activeTab]} className="mb-10 print:hidden" />
          )}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              inputs={inputs}
              ratios={ratios}
              cashFlow={cashFlow}
              validations={validations}
              investmentEvaluation={investmentEvaluation}
              currencySymbol={currencySymbol}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'inputs' && (
            <DataInputView
              inputs={inputs}
              setInputs={updateInputs}
              currencySymbol={currencySymbol}
              onSectorPreset={handleSectorPreset}
              onResetDefaults={handleResetDefaults}
              validations={validations}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'statements' && (
            <FinancialStatementsView
              incomeStatement={incomeStatement}
              cashFlow={cashFlow}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'ratios' && (
            <RatiosDashboardView
              ratios={ratios}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'evaluation' && (
            <InvestmentEvaluationView
              investmentEvaluation={investmentEvaluation}
              currencySymbol={currencySymbol}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              inputs={inputs}
              incomeStatement={incomeStatement}
              cashFlow={cashFlow}
              ratios={ratios}
              investmentEvaluation={investmentEvaluation}
              currencySymbol={currencySymbol}
            />
          )}
          </div>
          </div>
          </div>
        </main>
      </div>

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        projectInfo={projectInfo}
      />
    </div>
  );
}
