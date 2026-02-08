// SearchNdFilter.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const BG = "#0B0B0B";
const BORDER = "rgba(255,255,255,0.55)";
const MUTED = "rgba(255,255,255,0.65)";

type Props = {
  value?: string;
  onChangeText?: (t: string) => void;

  categoryLabel?: string; // default: All Categories
  onPressCategory?: () => void;

  onPressFilters?: () => void;
  onPressSort?: () => void;
};

const SearchNdFilter: React.FC<Props> = ({
  value,
  onChangeText,
  categoryLabel = "All Categories",
  onPressCategory,
  onPressFilters,
  onPressSort,
}) => {
  const [query, setQuery] = useState(value ?? "");
  const [openCategory, setOpenCategory] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const setText = (t: string) => {
    setQuery(t);
    onChangeText?.(t);
  };

  return (
    <View style={styles.wrap}>
      {/* Search bar */}
     

<View style={styles.searchBar}>
  <Ionicons name="search" size={18} color={MUTED} style={{ marginRight: 10 }} />

  <View style={{ flex: 1, justifyContent: "center" }}>
    {/* ✅ Custom placeholder (any font family) */}
    {query.length === 0 && (
      <Text style={styles.fakePlaceholder} numberOfLines={1}>
        Search for transactions...
      </Text>
    )}

    <TextInput
      value={query}
      onChangeText={setText}
      placeholder="" // ✅ keep empty
      style={styles.input}
      returnKeyType="search"
      placeholderTextColor="transparent"
    />
  </View>
</View>


      {/* Filters row */}
      <View style={styles.row}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.pill}
          onPress={onPressCategory ?? (() => setOpenCategory(true))}
        >
          <Text style={styles.pillText}>{categoryLabel}</Text>
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.pill}
          onPress={onPressFilters ?? (() => setOpenFilters(true))}
        >
          <Feather name="filter" size={16} color="#FFFFFF" />
          <Text style={[styles.pillText, { marginLeft: 8 }]}>FILTERS</Text>
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.pill}
          onPress={onPressSort ?? (() => setOpenSort(true))}
        >
          <Feather name="sliders" size={16} color="#FFFFFF" />
          <Text style={[styles.pillText, { marginLeft: 8 }]}>SORT</Text>
          <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* ✅ Optional demo modals (remove if you will navigate to other screens) */}
      <SimpleSheet
        visible={openCategory}
        title="Categories"
        onClose={() => setOpenCategory(false)}
        items={["All Categories", "Food", "Shopping", "Bills", "Travel"]}
        onPick={(x) => {
          setOpenCategory(false);
          // If you want: onPressCategory?.()
          // Or lift state up: pass callback to set selected category.
          console.log("Picked:", x);
        }}
      />

      <SimpleSheet
        visible={openFilters}
        title="Filters"
        onClose={() => setOpenFilters(false)}
        items={["This week", "This month", "Above ₹500", "Below ₹500"]}
        onPick={(x) => {
          setOpenFilters(false);
          console.log("Picked:", x);
        }}
      />

      <SimpleSheet
        visible={openSort}
        title="Sort"
        onClose={() => setOpenSort(false)}
        items={["Newest first", "Oldest first", "Amount high → low", "Amount low → high"]}
        onPick={(x) => {
          setOpenSort(false);
          console.log("Picked:", x);
        }}
      />
    </View>
  );
};

export default SearchNdFilter;

/* ------------------------- Small reusable sheet ------------------------- */
function SimpleSheet({
  visible,
  title,
  items,
  onClose,
  onPick,
}: {
  visible: boolean;
  title: string;
  items: string[];
  onClose: () => void;
  onPick: (item: string) => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={sheetStyles.backdrop} onPress={onClose}>
        <Pressable style={sheetStyles.card} onPress={() => {}}>
          <View style={sheetStyles.header}>
            <Text style={sheetStyles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {items.map((it) => (
            <TouchableOpacity
              key={it}
              activeOpacity={0.85}
              style={sheetStyles.item}
              onPress={() => onPick(it)}
            >
              <Text style={sheetStyles.itemText}>{it}</Text>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    backgroundColor: BG,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },

  searchBar: {
    height: 46,
    borderRadius: 24,
    borderWidth: 1.2,
    borderColor: "white",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
fakePlaceholder: {
  position: "absolute",
  left: 0,
  right: 0,
  color: "rgba(255,255,255,0.35)",
  fontSize: 14,
  fontWeight: "700",
  fontFamily: "Poppins-Regular", // ✅ placeholder font here
},
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    fontFamily:'Poppins-Regular',
  },

  row: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  pill: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.2,
    borderColor: BORDER,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  pillText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});

const sheetStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 14,
  },
  card: {
    backgroundColor: BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    overflow: "hidden",
  },
  header: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.10)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  title: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  itemText: {
    color: "rgba(255,255,255,0.85)",
    fontWeight: "700",
    fontSize: 13,
  },
});
