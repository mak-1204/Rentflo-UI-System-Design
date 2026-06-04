'use client';

import { Badge, Card } from '@stayflo/ui';

interface ExpenseItem {
  name: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid';
}

interface ExpensesListProps {
  expenses: ExpenseItem[];
}

export function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <Card className="p-8 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md text-left">
      <h3
        className="text-xl font-bold mb-6 text-slate-900 tracking-tight"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Operational Expenses
      </h3>
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-xs text-slate-400 font-semibold py-4 text-center">
            No logged operational expenses.
          </p>
        ) : (
          expenses.map((exp, i) => (
            <div
              key={exp.name || i}
              className="flex justify-between items-center text-xs p-4 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <div className="space-y-1">
                <p className="font-bold text-slate-800">{exp.name}</p>
                <p className="text-[10px] text-slate-400 font-medium">{exp.date}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-extrabold text-slate-900">₹{exp.amount.toLocaleString('en-IN')}</p>
                <Badge
                  style={{
                    background: exp.status === 'Paid' ? '#f0fdfa' : '#FCEBEB',
                    color: exp.status === 'Paid' ? '#14b8a6' : '#791F1F',
                  }}
                  className="text-[9px] px-2 py-0.5 border-none font-bold rounded-md uppercase tracking-wider"
                >
                  {exp.status}
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
