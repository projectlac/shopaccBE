export const compareTimeExpired = (expiredTime: Date): boolean => {
  const today = new Date();
  return today.getTime() <= expiredTime.getTime();
};
