export const formatCurrency = (value) => {
  const numberValue = parseFloat(value);

  if (isNaN(numberValue)) return "";

  return numberValue.toLocaleString("vi-VN", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
