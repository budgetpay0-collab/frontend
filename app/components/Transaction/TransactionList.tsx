import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

type Txn = {
  id: string;
  title: string; // e.g. "UPI Transfer"
  subtitle?: string; // e.g. "To: Rahul • UPI"
  amount: number; // +income, -expense (or keep separate)
  date: string; // display-ready or ISO
};

const TransactionList = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);

  const hasData = txns.length > 0;

  // ✅ Replace this with your real API call
  const fetchTransactions = async () => {
    setError(null);

    try {
      // ----------------------------
      // Example: call your API here
      // const res = await axios.get("YOUR_API_URL");
      // setTxns(res.data?.transactions ?? []);
      // ----------------------------

      // Demo (empty list). Remove this.
      await new Promise((r) => setTimeout(r, 600));
      setTxns([]); // <-- set your API data here
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
      setTxns([]);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchTransactions();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Txn }) => {
    const isPositive = item.amount >= 0;
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={styles.dot} />
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rowSub} numberOfLines={1}>
              {item.subtitle ?? item.date}
            </Text>
          </View>
        </View>

        <View style={styles.rowRight}>
          <Text style={[styles.amount, isPositive ? styles.amountPos : styles.amountNeg]}>
            {isPositive ? "+" : "-"}₹{Math.abs(item.amount).toFixed(0)}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
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

  if (loading) {
    return (
      <View style={styles.card}>
        {listHeader}
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={[styles.helper, { marginTop: 10 }]}>Loading transactions…</Text>
        </View>
      </View>
    );
  }

  // ✅ Empty state exactly like your image
  if (!hasData) {
    return (
      <View style={styles.card}>
        {listHeader}

        <View style={styles.center}>
          <View style={styles.iconWrap}>
            <Feather name="search" size={26} color="rgba(255,255,255,0.55)" />
          </View>

          <Text style={styles.subtitle}>
            {error ? "Unable to load transactions" : "No transactions found"}
          </Text>

          <Text style={styles.helper}>
            {error ? error : "Try adjusting your search or filter criteria."}
          </Text>

          <TouchableOpacity style={styles.retryBtn} onPress={fetchTransactions} activeOpacity={0.85}>
            <Feather name="refresh-cw" size={16} color="rgba(255,255,255,0.9)" />
            <Text style={styles.retryText}>{error ? "Retry" : "Refresh"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ✅ Data state
  return (
    <View style={styles.card}>
      {listHeader}

      <FlatList
        data={txns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 6 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  card: {
    // width: "100%",
    borderRadius: 18,
    paddingHorizontal: 18,
    marginHorizontal:14,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#131416",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
    overflow: "hidden",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
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
    maxWidth: 280,
  },

  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  retryText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "600",
  },

  // list rows
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
    backgroundColor: "rgba(255,255,255,0.22)",
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
  },
  amountPos: {
    color: "rgba(255,255,255,0.92)",
  },
  amountNeg: {
    color: "rgba(255,255,255,0.92)",
  },
  date: {
    marginTop: 2,
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
});