export function nextState(current, event) {
    const transitions = {
        IDLE: { SELECT: 'ANALYZING' },
        ANALYZING: { SUCCESS: 'EXPLAINING', VIOLATION: 'BLOCKED' },
        EXPLAINING: { RESET: 'IDLE' },
        BLOCKED: { RESET: 'IDLE' }
    };
    return transitions[current]?.[event] || current;
}
