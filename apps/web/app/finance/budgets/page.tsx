import { BudgetPlanning } from '@/features/finance/budget-planning';
import { ExpenseManagement } from '@/features/finance/expense-management';
import { EnterpriseShell } from '@/layouts/enterprise-shell';

export default function Page() {
  return <EnterpriseShell><div className="space-y-5"><BudgetPlanning /><ExpenseManagement /></div></EnterpriseShell>;
}
