import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  age: string;
  height: string;
  weight: string;
  exercisePreference: string;
  currentDiet: string;
  dietaryRestrictions: string;
  lifestyleGoals: string;
}

interface HealthFormContextType {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  aiResponse: string;
  setAiResponse: React.Dispatch<React.SetStateAction<string>>;
}

const HealthFormContext = createContext<HealthFormContextType | undefined>(undefined);

export function HealthFormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    age: '',
    height: '',
    weight: '',
    exercisePreference: '',
    currentDiet: '',
    dietaryRestrictions: '',
    lifestyleGoals: '',
  });
  const [aiResponse, setAiResponse] = useState<string>('');

  return (
    <HealthFormContext.Provider value={{ formData, setFormData, aiResponse, setAiResponse }}>
      {children}
    </HealthFormContext.Provider>
  );
}

export function useHealthForm() {
  const context = useContext(HealthFormContext);
  if (context === undefined) {
    throw new Error('useHealthForm must be used within a HealthFormProvider');
  }
  return context;
}
