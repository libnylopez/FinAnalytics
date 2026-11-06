import React, { useState, useMemo } from 'react';
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

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-canvas text-ink print:bg-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTeamModal={() => setIsTeamModalOpen(true)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          title={activeTitle}
          companyData={inputs}
          currency={currency}
          setCurrency={setCurrency}
          theme={theme}
          setTheme={setTheme}
          onOpenTeamModal={() => setIsTeamModalOpen(true)}
        />

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 pt-2 pb-16 print:p-0 print:max-w-none">
          {/* Cada módulo entra con un fundido breve; la clave reinicia la animación al cambiar de sección */}
          <div key={activeTab} className="animate-rise-in print:animate-none">
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
