import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Overview from './components/overview/Overview';
import FamilyTree from './components/family-tree/FamilyTree';
import MedicalRecords from './components/MedicalRecords';
import Medications from './components/Medications';
import Settings from './components/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="family-history" element={<FamilyTree />} />
          <Route path="medications" element={<Medications />} />
          <Route path="medical-records" element={<MedicalRecords />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;