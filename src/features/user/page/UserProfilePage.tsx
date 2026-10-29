import { useCallback } from "react";
import { useFetch } from "@/shared/hooks/useFetch";
import { userApi } from "../api/userApi";

export const UserProfilePage = () => {
  const load = useCallback(() => userApi.getProfile(), []);
  const { data: profileData, error, isLoading } = useFetch(load);

  if (isLoading) return <div>Loading..</div>;
  if (error) return <p role="alert">{error}</p>;

  return <div>{profileData?.name}</div>;
};
