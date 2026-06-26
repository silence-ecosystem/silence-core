/**
 * Safety Components Export
 * PatternLens v4.1
 */

export { CrisisModal, type CrisisModalProps, type CrisisResource } from './CrisisModal';

// Re-export crisis detection utilities
export { 
  calculateRiskLevel,
  containsHardKeyword,
  containsSoftKeyword,
  type RiskLevel,
  type KeywordMatch,
} from '@/lib/constants/crisis-keywords';
