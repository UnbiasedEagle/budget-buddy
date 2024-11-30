export type TransactionType = 'expense' | 'income';

export type Timeframe = 'month' | 'year';

export type Period = {
  year: number;
  month: number;
};

export type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};
