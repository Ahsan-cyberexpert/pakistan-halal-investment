export * from '@/lib/types';

export type SupportedLanguage = 'en' | 'ur';

export type DashboardTab = 'home' | 'portfolio' | 'assets' | 'kameti' | 'zakat' | 'settings';

export type PaymentMethod = 'JazzCash' | 'EasyPaisa' | 'Raast' | 'BankTransfer' | 'RoshanDigital';

export interface SukukItem {
  id: string;
  name: string;
  issuer: string;
  tenure: string;
  expectedYield: string;
  minInvestment: number;
  rating: string;
  type: 'Ijarah' | 'Murabaha' | 'Mudarabah' | 'Musharakah' | 'Sovereign';
  isGovtBacked: boolean;
}

export interface KametiGroup {
  id: string;
  name: string;
  monthlyAmount: number;
  totalPool: number;
  totalMembers: number;
  currentCycle: number;
  durationMonths: number;
  status: 'Active' | 'Forming' | 'Completed';
  startDate: string;
}

export interface ShariahComplianceMetrics {
  debtToAssets: number; // Max 33% per AAOIFI
  illiquidToTotalAssets: number; // Min 20%
  nonPermissibleIncomeRatio: number; // Max 5%
  isCompliant: boolean;
}
