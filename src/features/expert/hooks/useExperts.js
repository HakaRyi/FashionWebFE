import { useState, useEffect, useCallback } from "react";
import { expertApi } from "../api/expertApi";
import { useAuth } from "@/app/providers/AuthProvider";

export default function useExperts() {
  const { user } = useAuth(); // Get current logged-in user info
  const [experts, setExperts] = useState([]);
  const [activeExperts, setActiveExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Helper to extract array from EF Core JSON ($values) or plain array
   * Short and clean logic
   */
  const extractData = (res) => {
    const actualData = res?.data || res;
    return actualData?.$values || (Array.isArray(actualData) ? actualData : []);
  };

  /**
   * Fetch all experts for public viewing
   */
  const fetchExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expertApi.getAllExperts();
      setExperts(extractData(res));
    } catch (err) {
      console.error("Fetch experts error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch active experts for invitations
   * Filter out the current user based on accountId
   */
  const fetchActiveExperts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await expertApi.getActiveList();
      const finalArray = extractData(res);

      // Filter: Only keep experts where accountId != current user's id
      // Use Number() to ensure type safety (string vs number comparison)
      const filteredExperts = user?.id
        ? finalArray.filter(expert => Number(expert.accountId) !== Number(user.id))
        : finalArray;

      setActiveExperts(filteredExperts);
    } catch (err) {
      console.error("Fetch active experts error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial load for general list
  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  return {
    experts,          // Raw list for viewing
    activeExperts,    // Filtered list for invitations (excluding self)
    loading,
    error,
    fetchExperts,
    fetchActiveExperts,
  };
}