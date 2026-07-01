import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Vibration } from 'react-native';
import { SilenceSDK } from '@silence/sdk';
import { MobileTheme } from '../theme';
import { BottomBar } from '../components/BottomBar';

export const MobileFocusScreen = ({ userContext }: any) => {
  const [sessionActive, setSessionActive] = useState(false);
  const [integrity, setIntegrity] = useState(0.0);
  const [profile, setProfile] = useState('standard');

  useEffect(() => {
    // Subskrypcja profilu neuroadaptacyjnego (WOW-effect na mobile)
    const unsub = SilenceSDK.onAdaptiveProfileUpdated((state) => {
      setIntegrity(state.score);
      setProfile(state.profile);
      if (state.profile === 'low-stimulus') Vibration.vibrate(500); // Haptic feedback
    });

    // Sprawdzenie czy sesja już trwa (Cross-Device Handover check)
    SilenceSDK.getActiveSession().then(session => {
      if (session) setSessionActive(true);
    });

    return () => unsub();
  }, []);

  const handleToggle = async () => {
    if (!sessionActive) {
      // Używamy realnego kontekstu zamiast hardcodu
      await SilenceSDK.startFocusSession(userContext.tenantId, userContext.actorId);
      setSessionActive(true);
      Vibration.vibrate(100);
    } else {
      await SilenceSDK.stopFocusSession();
      setSessionActive(false);
      Vibration.vibrate([100, 50, 100]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.pulseArea, profile === 'low-stimulus' && styles.lowStimulus]}>
        <View style={[styles.pulseCircle, { borderColor: profile === 'low-stimulus' ? MobileTheme.colors.danger : MobileTheme.colors.primary }]}>
          <Text style={styles.integrityText}>{(integrity * 100).toFixed(0)}%</Text>
        </View>
        <Text style={styles.statusLabel}>{profile.toUpperCase()}_MODE</Text>
      </View>

      <View style={styles.controlsArea}>
        <TouchableOpacity 
          onPress={handleToggle}
          style={[styles.button, sessionActive ? styles.buttonStop : styles.buttonStart]}
        >
          <Text style={styles.buttonText}>{sessionActive ? 'TERMINATE_SESSION' : 'RESUME_OR_START'}</Text>
        </TouchableOpacity>
      </View>
      <BottomBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: MobileTheme.colors.bg },
  pulseArea: { flex: 0.62, justifyContent: 'center', alignItems: 'center' },
  lowStimulus: { opacity: 0.5 },
  controlsArea: { flex: 0.38, padding: 24, justifyContent: 'center' },
  pulseCircle: { width: 180, height: 180, borderRadius: 90, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  integrityText: { fontSize: 42, color: '#fff', fontWeight: '100', fontFamily: 'monospace' },
  statusLabel: { marginTop: 20, color: '#475569', fontSize: 10, letterSpacing: 3 },
  button: { height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  buttonStart: { backgroundColor: MobileTheme.colors.primary },
  buttonStop: { borderWidth: 1, borderColor: MobileTheme.colors.danger },
  buttonText: { fontWeight: '600', color: '#fff', letterSpacing: 1 }
});
