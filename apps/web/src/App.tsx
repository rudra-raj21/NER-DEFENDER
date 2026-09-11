import React, { useState } from 'react';
import { MapContainer } from './components/map/MapContainer';
import { DynamicSidebar } from './components/dashboard/DynamicSidebar';
import { AlertModal } from './components/alerts/AlertModal';
import { ReportIncidentModal } from './components/crowdsourcing/ReportIncidentModal';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'map'>('landing');

  if (view === 'landing') {
    return <LandingPage onLaunchMap={() => setView('map')} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-ner-bg">
      {/* Full-screen Leaflet Map Canvas */}
      <MapContainer />

      {/* Floating Glassmorphism HUD Sidebar */}
      <DynamicSidebar onBackToLanding={() => setView('landing')} />

      {/* Modals */}
      <AlertModal />
      <ReportIncidentModal />
    </div>
  );
};

export default App;
