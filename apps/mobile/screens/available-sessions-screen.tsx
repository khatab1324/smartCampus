import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { sessionCatalog } from '@/constants/session-catalog';
import { tokens } from '@/constants/tokens';
import { openSessionInformationScreen } from '@/services/session-navigation.service';
import { SessionRecord } from '@/types/session';

export default function AvailableSessionsScreen() {
  const [passcode, setPasscode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionRecord | null>(null);

  const appendDigit = (digit: string) => {
    setPasscode((current) => (current.length >= 4 ? current : `${current}${digit}`));
  };

  const removeDigit = () => {
    setPasscode((current) => current.slice(0, -1));
  };

  const closeModal = () => {
    setModalVisible(false);
    setPasscode('');
    setSelectedSession(null);
  };

  const openJoinModal = (session: SessionRecord) => {
    setSelectedSession(session);
    setPasscode('');
    setModalVisible(true);
  };

  const verify = () => {
    if (passcode.length !== 4 || !selectedSession) {
      return;
    }

    const sessionCode = selectedSession.code;
    closeModal();
    openSessionInformationScreen(sessionCode);
  };

  return (
    <ScreenShell>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View style={styles.topBarBrand}>
            <MaterialIcons color={tokens.colors.primary} name="menu" size={22} />
            <Text style={styles.topBarTitle}>Smart Attendance</Text>
          </View>

          <View style={styles.avatarShell}>
            <Text style={styles.avatarText}>AH</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <View style={styles.scanningBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.scanningBadgeText}>Scanning...</Text>
              </View>

              <View style={styles.liveBadge}>
                <MaterialIcons color={tokens.colors.onSurfaceVariant} name="refresh" size={14} />
                <Text style={styles.liveBadgeText}>Live</Text>
              </View>
            </View>

            <Text style={styles.title}>Available Sessions</Text>
            <Text style={styles.subtitle}>Searching for nearby campus beacons...</Text>
          </View>

          <View style={styles.locationCard}>
            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>Current Location</Text>
              <Text style={styles.locationTitle}>Science Block, Level 4</Text>

              <View style={styles.locationMeta}>
                <MaterialIcons color={tokens.colors.primary} name="location-on" size={16} />
                <Text style={styles.locationMetaText}>Hall A & C within range</Text>
              </View>
            </View>

            <Pressable style={({ pressed }) => [styles.scanAgainButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.secondary} name="refresh" size={18} />
              <Text style={styles.scanAgainButtonText}>Scan Again</Text>
            </Pressable>

            <View style={styles.locationGlow} />
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Detected ({sessionCatalog.length})</Text>
          </View>

          <View style={styles.sessionList}>
            {sessionCatalog.map((session) => (
              <View key={session.code} style={styles.sessionCard}>
                <View style={styles.sessionCardHeader}>
                  <View style={styles.sessionMain}>
                    <View style={styles.sessionTagRow}>
                      <View style={styles.sessionCodeChip}>
                        <Text style={styles.sessionCodeText}>{session.code}</Text>
                      </View>

                      <MaterialIcons
                        color={
                          session.signalStrength === 'strong'
                            ? tokens.colors.tertiary
                            : tokens.colors.outline
                        }
                        name={
                          session.signalStrength === 'strong'
                            ? 'signal-cellular-alt'
                            : 'signal-cellular-alt-2-bar'
                        }
                        size={16}
                      />
                    </View>

                    <Text style={styles.sessionTitle}>{session.title}</Text>

                    <View style={styles.personRow}>
                      <MaterialIcons color={tokens.colors.onSurfaceVariant} name="person" size={16} />
                      <Text style={styles.personText}>{session.lecturer}</Text>
                    </View>
                  </View>

                  <View style={styles.sessionSide}>
                    <Text style={styles.sessionRoom}>{session.room}</Text>
                    <Text style={styles.sessionStatus}>{session.status}</Text>
                  </View>
                </View>

                <View style={styles.sessionFooter}>
                  {session.cta === 'Join' ? (
                    <View style={styles.attendeeStack}>
                      {session.attendeePreview.map((initials, index) => (
                        <View
                          key={`${session.code}-${initials}`}
                          style={[
                            styles.attendeeBubble,
                            index > 0 && styles.attendeeBubbleOverlap,
                          ]}>
                          <Text style={styles.attendeeInitials}>{initials}</Text>
                        </View>
                      ))}

                      <View style={[styles.attendeeOverflow, styles.attendeeBubbleOverlap]}>
                        <Text style={styles.attendeeOverflowText}>{session.attendeeOverflow}</Text>
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.progressText}>Session currently in progress</Text>
                  )}

                  <Pressable
                    onPress={() => openJoinModal(session)}
                    style={({ pressed }) => [
                      session.cta === 'Join' ? styles.primaryAction : styles.secondaryAction,
                      pressed && styles.buttonPressed,
                    ]}>
                    <Text
                      style={[
                        styles.actionText,
                        session.cta === 'Join' ? styles.primaryActionText : styles.secondaryActionText,
                      ]}>
                      {session.cta}
                    </Text>
                    <MaterialIcons
                      color={
                        session.cta === 'Join'
                          ? tokens.colors.onPrimary
                          : tokens.colors.onPrimaryFixed
                      }
                      name="chevron-right"
                      size={16}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.emptyHint}>
            <MaterialIcons color={tokens.colors.outlineVariant} name="qr-code-scanner" size={36} />
            <Text style={styles.emptyHintText}>
              Can&apos;t find your session? Try scanning the{'\n'}
              <Text style={styles.emptyHintLink}>Classroom QR Code</Text> or enter manually.
            </Text>
          </View>
        </ScrollView>

        <PasscodeModal
          onClose={closeModal}
          onDigit={appendDigit}
          onRemove={removeDigit}
          onVerify={verify}
          passcode={passcode}
          session={selectedSession}
          visible={modalVisible}
        />
      </View>
    </ScreenShell>
  );
}

function PasscodeModal({
  onClose,
  onDigit,
  onRemove,
  onVerify,
  passcode,
  session,
  visible,
}: {
  onClose: () => void;
  onDigit: (digit: string) => void;
  onRemove: () => void;
  onVerify: () => void;
  passcode: string;
  session: SessionRecord | null;
  visible: boolean;
}) {
  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'fingerprint', '0', 'backspace'];

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <Pressable onPress={onClose} style={styles.modalBackdrop} />

        <View style={styles.modalSheet}>
          <View style={styles.modalHandleWrap}>
            <View style={styles.modalHandle} />
          </View>

          <View style={styles.modalCloseRow}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.modalCloseButton, pressed && styles.buttonPressed]}>
              <MaterialIcons color={tokens.colors.onSurfaceVariant} name="close" size={20} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.modalHeader}>
              <View style={styles.modalLiveRow}>
                <View style={styles.modalLiveDot} />
                <Text style={styles.modalLiveText}>Live Session</Text>
              </View>

              <Text style={styles.modalTitle}>Enter Session Passcode</Text>
              <Text style={styles.modalSubtitle}>
                {session?.title ?? 'Session'} -{' '}
                <Text style={styles.modalSubtitleStrong}>{session?.lecturer ?? 'Lecturer'}</Text>
              </Text>
            </View>

            <View style={styles.passcodeDisplay}>
              {Array.from({ length: 4 }).map((_, index) => {
                const digit = passcode[index];

                return (
                  <View key={index} style={styles.passcodeCell}>
                    <Text style={styles.passcodeCellText}>{digit ? '•' : ''}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.keypadGrid}>
              {keypad.map((key) => (
                <KeypadButton
                  key={key}
                  label={key}
                  onPress={() => {
                    if (key === 'backspace') {
                      onRemove();
                      return;
                    }

                    if (key === 'fingerprint') {
                      return;
                    }

                    onDigit(key);
                  }}
                />
              ))}
            </View>

            <Pressable
              disabled={passcode.length !== 4}
              onPress={onVerify}
              style={({ pressed }) => [
                styles.verifyButton,
                passcode.length !== 4 && styles.verifyButtonDisabled,
                pressed && passcode.length === 4 && styles.buttonPressed,
              ]}>
              <MaterialIcons color={tokens.colors.onPrimary} name="verified-user" size={20} />
              <Text style={styles.verifyButtonText}>Verify & Continue</Text>
            </Pressable>

            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelButton, pressed && styles.buttonPressed]}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function KeypadButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  const isIcon = label === 'fingerprint' || label === 'backspace';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.keypadButton, pressed && styles.buttonPressed]}>
      {isIcon ? (
        <MaterialIcons
          color={tokens.colors.onSurface}
          name={label === 'fingerprint' ? 'fingerprint' : 'backspace'}
          size={22}
        />
      ) : (
        <Text style={styles.keypadButtonText}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderBottomColor: tokens.effects.cardBorder,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.lg,
  },
  topBarBrand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  topBarTitle: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.title,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  avatarShell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  avatarText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  content: {
    paddingBottom: 56,
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.xl,
  },
  hero: {
    marginBottom: tokens.spacing.xxxl,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: tokens.spacing.sm,
  },
  scanningBadge: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  pulseDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 10,
    width: 10,
  },
  scanningBadgeText: {
    color: tokens.colors.tertiary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  liveBadge: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  liveBadgeText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.display,
    fontWeight: '900',
    letterSpacing: -1.5,
    lineHeight: 48,
    marginBottom: tokens.spacing.sm,
  },
  subtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: tokens.colors.surfaceLow,
    borderColor: 'rgba(0,88,188,0.06)',
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    marginBottom: tokens.spacing.xxxl,
    minHeight: 224,
    overflow: 'hidden',
    padding: tokens.spacing.xl,
  },
  locationContent: {
    zIndex: 1,
  },
  locationLabel: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  locationTitle: {
    color: tokens.colors.onSurface,
    fontSize: 24,
    fontWeight: '800',
    marginTop: tokens.spacing.xs,
  },
  locationMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    marginTop: tokens.spacing.lg,
  },
  locationMetaText: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.body,
    fontWeight: '700',
  },
  scanAgainButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: tokens.colors.primaryFixed,
    borderColor: 'rgba(193,198,215,0.3)',
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    marginTop: 'auto',
    minHeight: 52,
    zIndex: 1,
  },
  scanAgainButtonText: {
    color: tokens.colors.onPrimaryFixed,
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  locationGlow: {
    backgroundColor: 'rgba(0,88,188,0.1)',
    borderRadius: 999,
    bottom: -36,
    height: 160,
    position: 'absolute',
    right: -36,
    width: 160,
  },
  sectionHeader: {
    marginBottom: tokens.spacing.md,
    paddingHorizontal: 2,
  },
  sectionHeaderText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  sessionList: {
    gap: tokens.spacing.lg,
  },
  sessionCard: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderColor: 'rgba(193,198,215,0.3)',
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    padding: tokens.spacing.xl,
    ...tokens.shadows.card,
  },
  sessionCardHeader: {
    marginBottom: tokens.spacing.lg,
  },
  sessionMain: {
    flex: 1,
  },
  sessionTagRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
  },
  sessionCodeChip: {
    backgroundColor: tokens.colors.surfaceHigh,
    borderRadius: tokens.radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sessionCodeText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  sessionTitle: {
    color: tokens.colors.onSurface,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: tokens.spacing.xs,
  },
  personRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  personText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
  },
  sessionSide: {
    alignItems: 'flex-end',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  sessionRoom: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
    textAlign: 'right',
  },
  sessionStatus: {
    color: 'rgba(65,71,85,0.7)',
    fontSize: tokens.typography.label,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  sessionFooter: {
    alignItems: 'center',
    borderTopColor: 'rgba(193,198,215,0.2)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: tokens.spacing.lg,
  },
  attendeeStack: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  attendeeBubble: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.pill,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  attendeeBubbleOverlap: {
    marginLeft: -8,
  },
  attendeeInitials: {
    color: tokens.colors.primary,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  attendeeOverflow: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceHigh,
    borderColor: tokens.colors.surfaceLowest,
    borderRadius: tokens.radii.pill,
    borderWidth: 2,
    height: 30,
    justifyContent: 'center',
    width: 38,
  },
  attendeeOverflowText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.micro,
    fontWeight: '800',
  },
  progressText: {
    color: 'rgba(65,71,85,0.7)',
    fontSize: tokens.typography.label,
    fontStyle: 'italic',
    fontWeight: '600',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.pill,
    elevation: 2,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 116,
    paddingHorizontal: 22,
    shadowColor: tokens.colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primaryFixed,
    borderRadius: tokens.radii.pill,
    flexDirection: 'row',
    gap: tokens.spacing.xs,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 116,
    paddingHorizontal: 22,
  },
  actionText: {
    fontSize: tokens.typography.body,
    fontWeight: '800',
  },
  primaryActionText: {
    color: tokens.colors.onPrimary,
  },
  secondaryActionText: {
    color: tokens.colors.onPrimaryFixed,
  },
  emptyHint: {
    alignItems: 'center',
    backgroundColor: 'rgba(241,243,254,0.3)',
    borderColor: 'rgba(193,198,215,0.2)',
    borderRadius: tokens.radii.xl,
    borderStyle: 'dashed',
    borderWidth: 2,
    marginTop: tokens.spacing.xxxl,
    padding: tokens.spacing.xl,
  },
  emptyHintText: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
    lineHeight: 22,
    marginTop: tokens.spacing.sm,
    textAlign: 'center',
  },
  emptyHintLink: {
    color: tokens.colors.primary,
    fontWeight: '800',
  },
  modalOverlay: {
    backgroundColor: 'rgba(24,28,35,0.35)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: tokens.colors.surfaceLowest,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '88%',
    paddingBottom: tokens.spacing.xl,
  },
  modalHandleWrap: {
    alignItems: 'center',
    paddingTop: tokens.spacing.md,
  },
  modalHandle: {
    backgroundColor: tokens.colors.outlineVariant,
    borderRadius: tokens.radii.pill,
    height: 4,
    width: 48,
  },
  modalCloseRow: {
    alignItems: 'flex-end',
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing.sm,
  },
  modalCloseButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  modalContent: {
    gap: tokens.spacing.xl,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.xl,
  },
  modalHeader: {
    gap: tokens.spacing.sm,
  },
  modalLiveRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  modalLiveDot: {
    backgroundColor: tokens.colors.tertiary,
    borderRadius: tokens.radii.pill,
    height: 10,
    width: 10,
  },
  modalLiveText: {
    color: tokens.colors.tertiary,
    fontSize: tokens.typography.label,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  modalTitle: {
    color: tokens.colors.onSurface,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  modalSubtitle: {
    color: tokens.colors.onSurfaceVariant,
    fontSize: tokens.typography.body,
  },
  modalSubtitleStrong: {
    color: tokens.colors.primary,
    fontWeight: '800',
  },
  passcodeDisplay: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    justifyContent: 'center',
  },
  passcodeCell: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.md,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  passcodeCellText: {
    color: tokens.colors.onSurface,
    fontSize: 28,
    fontWeight: '800',
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    justifyContent: 'center',
  },
  keypadButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.surfaceLow,
    borderRadius: tokens.radii.md,
    height: 68,
    justifyContent: 'center',
    width: 92,
  },
  keypadButtonText: {
    color: tokens.colors.onSurface,
    fontSize: 24,
    fontWeight: '700',
  },
  verifyButton: {
    alignItems: 'center',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radii.xl,
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    justifyContent: 'center',
    minHeight: 58,
  },
  verifyButtonDisabled: {
    opacity: 0.45,
  },
  verifyButtonText: {
    color: tokens.colors.onPrimary,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '800',
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: tokens.effects.fieldBorder,
    borderRadius: tokens.radii.xl,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
  },
  cancelButtonText: {
    color: tokens.colors.onSurface,
    fontSize: tokens.typography.bodyLg,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
});
