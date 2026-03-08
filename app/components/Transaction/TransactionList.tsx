import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Txn = {
  _id: string;
  transactionName: string;
  category: string;
  amount: number;
  createdAt?: string;
};

type Props = {
  data: Txn[];
  onEdit: (item: Txn) => void;
  onDelete: (item: Txn) => void;
};

const TransactionList: React.FC<Props> = ({
  data,
  onEdit,
  onDelete,
}) => {
  const hasData = data && data.length > 0;

  const renderItem = ({ item }: { item: Txn }) => {
    const formattedDate = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-IN")
      : "";

    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.transactionName}
            </Text>
            <Text style={styles.rowSub} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>

        <View style={styles.rowRight}>
          <Text style={styles.amount}>
            ₹{Number(item.amount).toFixed(0)}
          </Text>

          {formattedDate ? (
            <Text style={styles.date}>{formattedDate}</Text>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={() => onEdit(item)}
              style={styles.iconBtn}
            >
              <Feather name="edit-2" size={14} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onDelete(item)}
              style={styles.iconBtn}
            >
              <Feather name="trash-2" size={14} color="#ff5c5c" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const listHeader = useMemo(
    () => (
      <Text style={styles.title}>Transactions (Newest First)</Text>
    ),
    []
  );

  if (!hasData) {
    return (
      <View style={styles.card}>
        {listHeader}

        <View style={styles.center}>
          <View style={styles.iconWrap}>
            <Feather
              name="search"
              size={26}
              color="rgba(255,255,255,0.55)"
            />
          </View>

          <Text style={styles.subtitle}>
            No transactions found
          </Text>

          <Text style={styles.helper}>
            Add your first transaction to get started.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {listHeader}

      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6 }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TransactionList;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingHorizontal: 18,
    marginHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#131416",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    elevation: 6,
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },

  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },

  subtitle: {
    color: "rgba(255,255,255,0.86)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },

  helper: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },

  row: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
    paddingRight: 12,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#24C97A",
  },

  rowTitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "700",
  },

  rowSub: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    marginTop: 2,
  },

  rowRight: {
    alignItems: "flex-end",
  },

  amount: {
    fontSize: 14,
    fontWeight: "800",
    color: "white",
  },

  date: {
    marginTop: 2,
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },

  iconBtn: {
    padding: 6,
  },

  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
});
