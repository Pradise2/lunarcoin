import React, { createContext, useContext, useState, useEffect } from 'react';

const TotalBalContext = createContext();

export const useTotalBal = () => useContext(TotalBalContext);

export const TotalBalProvider = ({ children }) => {
 

 

  return (
    <TotalBalContext.Provider value={{ }}>
      {children}
    </TotalBalContext.Provider>
  );
};
