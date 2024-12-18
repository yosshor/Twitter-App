import { useState, useEffect } from "react";
import getCurrentUser, {
  getMinCurrentUserData,
} from "../utils/get-current-user/get-current-user";
import type { userDetails } from "../../../src/models/User";
import { productionState } from "../pages/home/HomePage";
import { useContext } from "react";

const useCurrentUser = ({ userId }: { userId?: string } = {}) => {
  const [userData, setUserData] = useState<userDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const state = useContext(productionState);
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

export const useCurrentUserMinData = () => {
  const [minUserData, setMinUserData] = useState<{
    userId: string;
    userData: { email: string; name: string; role: string; userId: string };
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const state = useContext(productionState);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMinCurrentUserData(state.url);
        console.log("userHok:", user);
        setMinUserData(user ?? null);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMinUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [state.url]);

  return { minUserData, isLoading };
};

export default useCurrentUser;
