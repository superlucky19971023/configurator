import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import Home from './pages/Home'
import Configurator from './pages/Configurator'
import { SelectedItemProvider } from './components/SelectedItemContext';

function App() {
  return (
    <SelectedItemProvider>
      <Routes>
        <Route path="/" element={<Configurator />} />
        <Route path="/configurator" element={<Configurator />} />
      </Routes>
    </SelectedItemProvider>
  );
}
export default App
