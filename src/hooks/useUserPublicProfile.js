import { useCallback, useEffect, useMemo, useState } from "react";
import { getUserPublicProfile } from "../services/userService";
import { useUserDataFromLocalStorage } from "./useUserDataFromLocalStorage";

export const useUserPublicProfile = (id) => {
  const owner = useUserDataFromLocalStorage();
  const ownerId = owner?.idUser;

  const currentUserId = parseInt(id || ownerId);

  const [currentUser, setCurrentUser] = useState(owner);

  const reload = useCallback(() => {
    getUserPublicProfile(currentUserId).then((info) => {
      setCurrentUser(info);
    });
  }, [currentUserId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return useMemo(
    () => ({
      currentUser,
      reload,
      ownerId,
      currentUserId,
      isOwner: ownerId === currentUserId,
    }),
    [currentUser, reload, currentUserId, ownerId]
  );
};
