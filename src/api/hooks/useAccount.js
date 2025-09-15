import { useQuery } from "@tanstack/react-query";
import api from "../client";
import { endpoints } from "../endpoints";

const fetchAccount = async () => {
  const res = await api.get(endpoints.auth.account);
  return res.data;
};

export const useAccount = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: ["account"],
    queryFn: fetchAccount,
    enabled,
  });

const fetchSessions = async () => {
  const res = await api.get(endpoints.school.sessions);
  return res.data;
};

export const useSessions = ({ enabled = true } = {}) =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    enabled,
  });
