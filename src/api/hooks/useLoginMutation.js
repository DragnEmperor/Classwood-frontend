import { useMutation } from "@tanstack/react-query";
import api from "../client";
import { endpoints } from "../endpoints";

const login = async ({ email, password }) => {
  const res = await api.post(endpoints.auth.login, { email, password });
  return res.data;
};

export const useLoginMutation = (options = {}) =>
  useMutation({ mutationFn: login, ...options });
