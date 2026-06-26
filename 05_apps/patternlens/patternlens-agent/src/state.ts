export type AgentState = 'IDLE' | 'ANALYZING' | 'EXPLAINING' | 'BLOCKED';
export function nextState(current: AgentState, event: string): AgentState {
    const transitions: Record<string, any> = {
        IDLE: { SELECT: 'ANALYZING' },
        ANALYZING: { SUCCESS: 'EXPLAINING', VIOLATION: 'BLOCKED' },
        EXPLAINING: { RESET: 'IDLE' },
        BLOCKED: { RESET: 'IDLE' }
    };
    return transitions[current]?.[event] || current;
}