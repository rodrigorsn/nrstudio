/**
 * Storage Repository for PsicoGestão NR-1
 * Local persistence layer using localStorage with fallback to in-memory state.
 * Supports complete reset to fictional demo data.
 */

import {
  AnonymousResponse,
  ActionPlanItem,
  Campaign,
  Company,
  InstrumentVersion,
  MethodologySource,
  PrivacyConfig,
  RiskAssessment,
} from '../types/domain';
import {
  DEMO_ACTION_PLANS,
  DEMO_CAMPAIGNS,
  DEMO_COMPANY,
  DEMO_INSTRUMENTS,
  DEMO_METHODOLOGY_SOURCES,
  DEMO_RISK_ASSESSMENTS,
  generateSeedResponses,
} from '../data/seedData';
import { DEFAULT_PRIVACY_CONFIG } from '../services/privacyPolicy';

const KEYS = {
  COMPANY: 'psicogestao_company_v1',
  INSTRUMENTS: 'psicogestao_instruments_v1',
  CAMPAIGNS: 'psicogestao_campaigns_v1',
  RESPONSES: 'psicogestao_responses_v1',
  RISKS: 'psicogestao_risks_v1',
  ACTIONS: 'psicogestao_actions_v1',
  METHODOLOGY: 'psicogestao_methodology_v1',
  PRIVACY: 'psicogestao_privacy_v1',
};

class StorageRepository {
  private listeners: Set<() => void> = new Set();

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  private getItem<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallback;
      return JSON.parse(item) as T;
    } catch (e) {
      console.warn(`Error reading localStorage key ${key}:`, e);
      return fallback;
    }
  }

  private setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.error(`Error writing localStorage key ${key}:`, e);
    }
  }

  // --- Initialize with Demo Data if empty ---
  public initializeIfEmpty(): void {
    if (!localStorage.getItem(KEYS.COMPANY)) {
      this.restoreDemoData();
    }
  }

  // --- Restore Demo Data ---
  public restoreDemoData(): void {
    this.setItem(KEYS.COMPANY, DEMO_COMPANY);
    this.setItem(KEYS.INSTRUMENTS, DEMO_INSTRUMENTS);
    this.setItem(KEYS.CAMPAIGNS, DEMO_CAMPAIGNS);
    this.setItem(KEYS.RESPONSES, generateSeedResponses());
    this.setItem(KEYS.RISKS, DEMO_RISK_ASSESSMENTS);
    this.setItem(KEYS.ACTIONS, DEMO_ACTION_PLANS);
    this.setItem(KEYS.METHODOLOGY, DEMO_METHODOLOGY_SOURCES);
    this.setItem(KEYS.PRIVACY, DEFAULT_PRIVACY_CONFIG);
  }

  // --- Company & Sectors ---
  public getCompany(): Company {
    return this.getItem<Company>(KEYS.COMPANY, DEMO_COMPANY);
  }

  public saveCompany(company: Company): void {
    this.setItem(KEYS.COMPANY, company);
  }

  // --- Instruments ---
  public getInstruments(): InstrumentVersion[] {
    return this.getItem<InstrumentVersion[]>(KEYS.INSTRUMENTS, DEMO_INSTRUMENTS);
  }

  public getInstrumentById(id: string): InstrumentVersion | undefined {
    return this.getInstruments().find((i) => i.id === id);
  }

  // --- Campaigns ---
  public getCampaigns(): Campaign[] {
    return this.getItem<Campaign[]>(KEYS.CAMPAIGNS, DEMO_CAMPAIGNS);
  }

  public getCampaignById(id: string): Campaign | undefined {
    return this.getCampaigns().find((c) => c.id === id);
  }

  public saveCampaign(campaign: Campaign): void {
    const campaigns = this.getCampaigns();
    const index = campaigns.findIndex((c) => c.id === campaign.id);
    if (index >= 0) {
      campaigns[index] = { ...campaign, updatedAt: new Date().toISOString() };
    } else {
      campaigns.unshift({ ...campaign, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(KEYS.CAMPAIGNS, campaigns);
  }

  // --- Responses ---
  public getResponses(campaignId?: string): AnonymousResponse[] {
    const responses = this.getItem<AnonymousResponse[]>(KEYS.RESPONSES, []);
    if (campaignId) {
      return responses.filter((r) => r.campaignId === campaignId);
    }
    return responses;
  }

  public addResponse(response: AnonymousResponse): void {
    const responses = this.getItem<AnonymousResponse[]>(KEYS.RESPONSES, []);
    responses.push(response);
    this.setItem(KEYS.RESPONSES, responses);
  }

  public addBatchResponses(newResponses: AnonymousResponse[]): void {
    const responses = this.getItem<AnonymousResponse[]>(KEYS.RESPONSES, []);
    this.setItem(KEYS.RESPONSES, [...responses, ...newResponses]);
  }

  // --- Risk Assessments ---
  public getRisks(): RiskAssessment[] {
    return this.getItem<RiskAssessment[]>(KEYS.RISKS, DEMO_RISK_ASSESSMENTS);
  }

  public saveRisk(risk: RiskAssessment): void {
    const risks = this.getRisks();
    const index = risks.findIndex((r) => r.id === risk.id);
    if (index >= 0) {
      risks[index] = { ...risk, updatedAt: new Date().toISOString() };
    } else {
      risks.unshift({ ...risk, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(KEYS.RISKS, risks);
  }

  // --- Action Plans ---
  public getActions(): ActionPlanItem[] {
    return this.getItem<ActionPlanItem[]>(KEYS.ACTIONS, DEMO_ACTION_PLANS);
  }

  public saveAction(action: ActionPlanItem): void {
    const actions = this.getActions();
    const index = actions.findIndex((a) => a.id === action.id);
    if (index >= 0) {
      actions[index] = { ...action, updatedAt: new Date().toISOString() };
    } else {
      actions.unshift({ ...action, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.setItem(KEYS.ACTIONS, actions);
  }

  public saveBatchActions(newActions: ActionPlanItem[]): void {
    const actions = this.getActions();
    this.setItem(KEYS.ACTIONS, [...newActions, ...actions]);
  }

  // --- Methodology Sources ---
  public getMethodologySources(): MethodologySource[] {
    return this.getItem<MethodologySource[]>(KEYS.METHODOLOGY, DEMO_METHODOLOGY_SOURCES);
  }

  // --- Privacy Config ---
  public getPrivacyConfig(): PrivacyConfig {
    return this.getItem<PrivacyConfig>(KEYS.PRIVACY, DEFAULT_PRIVACY_CONFIG);
  }

  public savePrivacyConfig(config: PrivacyConfig): void {
    this.setItem(KEYS.PRIVACY, config);
  }
}

export const storageRepo = new StorageRepository();
storageRepo.initializeIfEmpty();
