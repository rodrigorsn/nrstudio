/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DemoEnvironmentBanner } from './components/common/DemoEnvironmentBanner';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

import { DashboardPage } from './pages/DashboardPage';
import { CompanyPage } from './pages/CompanyPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { ResultsPage } from './pages/ResultsPage';
import { RiskInventoryPage } from './pages/RiskInventoryPage';
import { ActionPlansPage } from './pages/ActionPlansPage';
import { ReportsPage } from './pages/ReportsPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { ParticipantQuestionnairePage } from './pages/ParticipantQuestionnairePage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
  };

  // Check if current route is the participant questionnaire route e.g. /responder/:campaignId
  if (currentPath.startsWith('/responder')) {
    const parts = currentPath.split('/');
    const campaignId = parts[2] || 'camp-2026-01';
    return <ParticipantQuestionnairePage campaignId={campaignId} />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <DashboardPage key={resetKey} onNavigate={navigate} />;
      case '/company':
        return <CompanyPage key={resetKey} />;
      case '/campaigns':
        return <CampaignsPage key={resetKey} />;
      case '/results':
        return <ResultsPage key={resetKey} />;
      case '/risk-inventory':
        return <RiskInventoryPage key={resetKey} onNavigate={navigate} />;
      case '/action-plans':
        return <ActionPlansPage key={resetKey} />;
      case '/reports':
        return <ReportsPage key={resetKey} />;
      case '/methodology':
        return <MethodologyPage key={resetKey} />;
      default:
        return <DashboardPage key={resetKey} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#1C1C1A] flex flex-col font-sans antialiased">
      <DemoEnvironmentBanner />
      <Header onDataReset={() => setResetKey((k) => k + 1)} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentPath={currentPath} onNavigate={navigate} />

        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
