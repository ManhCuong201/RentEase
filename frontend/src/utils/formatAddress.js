export const formatAddress = (address) => {
  return `${address.city.name}, ${address.district.name}, ${address.ward.name}, ${address.detail}`;
};
