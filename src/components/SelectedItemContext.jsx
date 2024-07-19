// src/SelectedItemContext.js
import { createContext, useState } from 'react';

export const SelectedItemContext = createContext();

export const SelectedItemProvider = ({ children }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalFormIsSubmit, checkIfModalFormIsSubmit] = useState(false);

  return (
    <SelectedItemContext.Provider value={{ 
        selectedItem, setSelectedItem, 
        modalFormIsSubmit, checkIfModalFormIsSubmit 
      }}>
      {children}
    </SelectedItemContext.Provider>
  );
};
