import { AttentionMonitorSnapshot } from '@silence/contracts';

export class AttentionMapper {
  static toAttentionMode(snapshot: AttentionMonitorSnapshot): string {
    if (!snapshot.facialPresence.facePresent) return 'disengaged';
    if (snapshot.engagementLevel === 'high') return 'focused';
    if (snapshot.engagementScore < 0.4) return 'wandering';
    return 'scanning';
  }
}
