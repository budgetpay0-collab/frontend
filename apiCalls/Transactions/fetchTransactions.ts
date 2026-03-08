import axios from "axios";

export const fetchTransactions = async (user_ID :any , cBaseURL :any) => {
    try {
      const res = await axios.get(
        `${cBaseURL}/fetch-transactions/${user_ID}`
      );
      console.log("Fetched transactions", res.data);
      return(res.data.data || []);
    } catch (err) {
      console.warn("Fetch transaction error", err);
      return([]);
    }
  };
