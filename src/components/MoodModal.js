import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
      <View style={styles.modalMask}>
        <View style={styles.modalBox}>
          <Text style={styles.modalTitle}>{date}</Text>
          <Text style={styles.modalPrompt}>今天的心情？</Text>
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
          <Text style={styles.modalPrompt}>描述今天的心情～</Text>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
            maxLength={128}
            style={styles.input}
          />
          <View style={styles.modalBtns}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={{ fontSize: 16, color: "#007AFF" }}>取消</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave}>
              <Text
                style={{ fontSize: 16, color: "#007AFF", fontWeight: "bold" }}
              >
                儲存
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  modalPrompt: { fontSize: 16, marginTop: 10, marginBottom: 4, color: "#333" },
  emojiChooser: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  emojiOption: {
    padding: 8,
    borderRadius: 8,
  },
  emojiSelected: {
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
  },
  emoji: {
    fontSize: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    textAlignVertical: 'top',
    padding: 12,
    marginTop: 6,
    height: 120,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
