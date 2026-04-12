import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  icon: any;
  // 👇 NOVOS CAMPOS PARA ASSINATURAS E PARCELAMENTOS
  isRecurring?: boolean;
  installments?: number;
}

interface FinanceContextData {
  income: number;
  expenses: number;
  balance: number;
  transactions: Transaction[];
  addTransaction: (aiData: any) => void;
}

const FinanceContext = createContext<FinanceContextData>({} as FinanceContextData);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const balance = income - expenses;

  const getIconByCategory = (cat: string) => {
    const c = cat?.toLowerCase() || '';
    if (c.includes('alimento') || c.includes('comida') || c.includes('restaurante')) return 'restaurant-outline';
    if (c.includes('transporte') || c.includes('uber') || c.includes('carro')) return 'car-outline';
    if (c.includes('lazer') || c.includes('streaming') || c.includes('netflix')) return 'tv-outline';
    if (c.includes('salário') || c.includes('trabalho')) return 'cash-outline';
    if (c.includes('saúde') || c.includes('farmácia')) return 'medkit-outline';
    if (c.includes('mercado') || c.includes('compras')) return 'cart-outline';
    return 'receipt-outline';
  };

  const addTransaction = (aiData: any) => {
    // 1. TRAVA DE SEGURANÇA: Se for só conversa ou não tiver valor numérico válido, ignora!
    const tipoRaw = aiData.tipo?.toLowerCase().trim();
    if (tipoRaw === 'conversa' || !aiData.valorNumerico) return;

    const valor = Number(aiData.valorNumerico);
    if (isNaN(valor) || valor <= 0) return;

    // 2. Define o tipo
    const tipo = (tipoRaw === 'receita' || tipoRaw === 'income') ? 'income' : 'expense';
    
    // 3. Atualiza os saldos
    if (tipo === 'income') {
      setIncome(prev => prev + valor);
    } else {
      setExpenses(prev => prev + valor);
    }

    // 👇 4. EXTRAINDO OS DADOS DE ASSINATURA E PARCELAMENTO DA IA
    const ehAssinatura = aiData.cardData?.isRecurring || false;
    const numeroParcelas = aiData.cardData?.parcelas || 1;

    // 5. Cria a transação formatando os centavos bonitinho (ex: R$ 15,00)
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title: aiData.cardData?.produto || 'Transação',
      category: aiData.cardData?.categoria || 'Geral',
      date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      amount: `${tipo === 'income' ? '+' : '-'}R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      type: tipo,
      icon: getIconByCategory(aiData.cardData?.categoria),
      // 👇 SALVANDO OS NOVOS CAMPOS NO HISTÓRICO
      isRecurring: ehAssinatura,
      installments: numeroParcelas,
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  return (
    <FinanceContext.Provider value={{ income, expenses, balance, transactions, addTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => useContext(FinanceContext);