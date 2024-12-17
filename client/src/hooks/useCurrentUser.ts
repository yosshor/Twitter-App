import { useState, useEffect } from "react";
import getCurrentUser from "../utils/get-current-user/get-current-user";
import type { userDetails } from "../../../src/models/User";
import { productionState } from "../pages/home/HomePage";
import { useContext } from "react";

const useCurrentUser = ({ userId }: { userId?: string } = {}) => {
  const [userData, setUserData] = useState<userDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const state = useContext(productionState);
  console.log("userId:", userId);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getCurrentUser(state.url, userId ?? undefined);
        setUserData(user ?? null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, state.url]); 

  return { userData, loading };
};

export default useCurrentUser;
