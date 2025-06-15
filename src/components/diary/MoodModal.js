import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import Theme from "@/lib/theme";

export default function MoodModal({
  visible,
  date,
  selectedEmoji,
  inputText = "", // Add default value to prevent undefined error
  setInputText,
  setSelectedEmoji,
  onCancel,
  onSave,
  allEmojis = [], // Add default value to prevent undefined error
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [currentStep, setCurrentStep] = useState(1); // 1: select mood, 2: input text
  const [, setSelectedMood] = useState(null);
  const [, setText] = useState("");

  const resetModal = useCallback(() => {
    // Modal appearance animation
    setCurrentStep(1);
    setSelectedMood(null);
    setText("");
    scaleAnim.setValue(0.8);
    fadeAnim.setValue(0);
  }, [scaleAnim, fadeAnim]);

  useEffect(() => {

    if (visible) {
      // Reset animation values
      scaleAnim.setValue(0.8);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      resetModal();
    }
  }, [fadeAnim, resetModal, visible, scaleAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setSelectedEmoji(mood);
    // Delay a bit to let user see the selection effect, then switch to next step
    setTimeout(() => {
      setCurrentStep(2);
    }, 300);
  };

  const goToPrevStep = () => {
    setCurrentStep(1);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View
        style={[styles.stepDot, currentStep >= 1 && styles.stepDotActive]}
      />
      <View
        style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]}
      />
      <View
        style={[styles.stepDot, currentStep >= 2 && styles.stepDotActive]}
      />
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      {/* Title area */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <LinearGradient
            colors={["#f87171", "#ef4444"]}
            style={styles.closeBtnGradient}
          >
            <Text style={styles.closeBtnText}>×</Text>
          </LinearGradient>
        </TouchableOpacity>

                  <View style={styles.titleWrapper}>
            <Text style={styles.modalTitle}>記錄心情</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>

        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      {/* Mood selection area */}
      <View style={styles.sectionContainer}>
                  <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>今天的心情是？</Text>
            <Text style={styles.sectionSubtitle}>
              選擇一個最符合你現在感受的表情
            </Text>
          <View style={styles.emojiChooser}>
            {allEmojis && allEmojis.length > 0 ? (
              allEmojis.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === e && styles.emojiSelected,
                  ]}
                  onPress={() => handleMoodSelect(e)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.emoji}>{e}</Text>
                  {selectedEmoji === e && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))
                          ) : (
                <Text style={styles.noEmojisText}>
                  沒有可用的表情選項
                </Text>
              )}
          </View>
        </View>
      </View>

              <View style={styles.stepHint}>
          <Text style={styles.hintText}>點擊表情符號繼續</Text>
        </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      {/* Title area */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={goToPrevStep}>
          <LinearGradient
            colors={[Theme.Colors.secondary, Theme.Colors.primary]}
            style={styles.backBtnGradient}
          >
            <Text style={styles.backBtnText}>‹</Text>
          </LinearGradient>
        </TouchableOpacity>

                  <View style={styles.titleWrapper}>
            <Text style={styles.modalTitle}>分享想法</Text>
            <View style={styles.selectedEmojiDisplay}>
              <Text style={styles.selectedEmojiText}>{selectedEmoji}</Text>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          </View>

        <View style={styles.placeholder} />
      </View>

      {renderStepIndicator()}

      {/* Text input area */}
      <View style={styles.sectionContainer}>
                  <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>想說些什麼嗎？</Text>
            <Text style={styles.sectionSubtitle}>
              記錄今天發生的事情或內心的感受
            </Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={inputText || ""}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
              maxLength={256}
              style={styles.input}
                              placeholder="例如：今天和朋友去咖啡廳聊天，心情很放鬆～或是工作壓力有點大，但完成任務後很有成就感！"
              placeholderTextColor={Theme.Colors.placeholder}
              autoFocus={true}
              textAlignVertical="top"
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
              autoComplete="off"
            />
            <Text style={styles.charCount}>{(inputText || "").length}/256</Text>
          </View>
        </View>
      </View>

      {/* Save button */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          onPress={() => {
            onSave(selectedEmoji, inputText);
          }}
          style={styles.saveBtn}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[Theme.Colors.primary, "#5A7A95"]}
            style={styles.saveBtnGradient}
                      >
              <Text style={styles.saveBtnText}>💾 保存心情</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <Animated.View style={[styles.modalMask, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: scaleAnim },
                  {
                    translateY: scaleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={["#ffffff", "#f8fafc", "#f1f5f9"]}
              style={styles.modalBox}
            >
              {/* Decorative top bar */}
              <View style={styles.topIndicator} />

              {/* Step content */}
              <View style={styles.stepsWrapper}>
                {currentStep === 1 ? renderStep1() : renderStep2()}
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalMask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 400,
  },
  modalBox: {
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 20,
    minHeight: 520,
    maxHeight: "85%",
  },
  topIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Theme.Colors.border,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  stepsWrapper: {
    overflow: "hidden",
  },
  stepContainer: {},
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.Colors.border,
  },
  stepDotActive: {
    backgroundColor: Theme.Colors.primary,
    elevation: 2,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Theme.Colors.border,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: Theme.Colors.primary,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(120, 149, 178, 0.1)",
  },
  closeBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  closeBtnGradient: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
  },
  backBtn: {
    borderRadius: 20,
    overflow: "hidden",
  },
  backBtnGradient: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 28,
  },
  titleWrapper: {
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Theme.Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dateText: {
    fontSize: 14,
    color: Theme.Colors.textSecondary,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  selectedEmojiDisplay: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectedEmojiText: {
    fontSize: 20,
  },
  placeholder: {
    width: 40,
  },
  sectionContainer: {
    marginBottom: 18,
  },
  sectionContent: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(120, 149, 178, 0.1)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Theme.Colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
    letterSpacing: 0.3,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: Theme.Colors.textSecondary,
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 22,
    fontWeight: "500",
    letterSpacing: 0.2,
    fontStyle: "italic",
  },
  emojiChooser: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "rgba(248, 250, 252, 0.8)",
    borderRadius: 20,
    paddingHorizontal: 12,
    gap: 8,
  },
  emojiOption: {
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minWidth: 60,
    minHeight: 60,
  },
  emojiSelected: {
    backgroundColor: Theme.Colors.accent,
    transform: [{ scale: 1.2 }],
    elevation: 4,
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  emoji: {
    fontSize: 36,
  },
  selectedIndicator: {
    position: "absolute",
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.Colors.primary,
  },
  stepHint: {
    alignItems: "center",
    marginTop: 16,
  },
  hintText: {
    fontSize: 14,
    color: Theme.Colors.textSecondary,
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.2,
    opacity: 0.8,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(120, 149, 178, 0.2)",
    borderRadius: 12,
    textAlignVertical: "top",
    padding: 16,
    height: 120,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    color: Theme.Colors.textPrimary,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: 0.3,
    marginTop: 8,
  },
  charCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: Theme.Colors.textSecondary,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontWeight: "600",
    letterSpacing: 0.2,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionContainer: {
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 8,
  },
  saveBtn: {
    borderRadius: 25,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveBtnGradient: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noEmojisText: {
    fontSize: 16,
    color: Theme.Colors.textSecondary,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
});
