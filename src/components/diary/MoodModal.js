import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

export default function MoodModal({
  visible,
  date,
  selectedEmoji,
  setSelectedEmoji,
  inputText,
  setInputText,
  onCancel,
  onSave,
  allEmojis,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={styles.modalMask}>
          <View style={styles.modalBox}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.headerBtn} onPress={onCancel}>
                <Text style={styles.headerBtnText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{date}</Text>
              <View style={styles.headerBtn} />
            </View>

            <View style={styles.emojiChooser}>
              {allEmojis.map((e) => (
                <TouchableOpacity
                  key={e}
                  style={[
                    styles.emojiOption,
                    selectedEmoji === e && styles.emojiSelected,
                  ]}
                  onPress={() => setSelectedEmoji(e)}
                >
                  <Text style={styles.emoji}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              multiline
              numberOfLines={4}
              maxLength={256}
              style={styles.input}
              placeholder="描述心情，例如：今天去衝浪好快樂！"
              placeholderTextColor="#A0A0A0"
            />

            <View style={styles.saveBtnWrapper}>
              <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
                <Text style={styles.saveIcon}>✔️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalMask: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBtnText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#222",
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 2,
    letterSpacing: 1,
  },
  emojiChooser: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    marginBottom: 6,
  },
  emojiOption: {
    padding: 8,
    borderRadius: 10,
  },
  emojiSelected: {
    backgroundColor: "#e0f7fa",
    borderRadius: 10,
  },
  emoji: {
    fontSize: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 10,
    marginTop: 8,
    height: 128,
    fontSize: 15,
    backgroundColor: "#fafbfc",
    marginBottom: 10,
  },
  saveBtnWrapper: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    width: 64,
    height: 36,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  saveIcon: {
    fontSize: 24,
    color: "#333",
    fontWeight: "bold",
  },
});
