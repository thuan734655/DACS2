export const useUserDataFromLocalStorage = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  return userData;
};
