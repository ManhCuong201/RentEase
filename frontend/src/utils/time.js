const currentTime = () => {
  const now = new Date();
  return now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
};

export { currentTime };
