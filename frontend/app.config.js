const os = require("os");

function getPhysicalIPv4() {
  const networkInterfaces = os.networkInterfaces();
  const ignoredAdapters = [
    "vEthernet",
    "VirtualBox",
    "docker",
    "TAP-Windows",
    "Tailscale",
    "Loopback",
  ];

  for (const interfaceName in networkInterfaces) {
    // Bỏ qua các adapter ảo như 'vEthernet', 'docker', 'VirtualBox', 'TAP-Windows', 'Tailscale', 'Loopback', v.v.
    if (ignoredAdapters.some((adapter) => interfaceName.includes(adapter))) {
      continue;
    }

    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // Chỉ lấy IPv4 và bỏ qua các interface nội bộ (localhost)
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "Không tìm thấy địa chỉ IPv4 từ bộ điều hợp vật lý!";
}

const localIP = getPhysicalIPv4();
console.log("day la ip: ", localIP);

export default {
  name: "My App",
  version: "1.0.0",
  extra: {
    rentEaseApi: `http://${localIP}:8080`,
    cityApi: "https://vietnamese-administration.vercel.app/city",
    districtsApi: "https://vietnamese-administration.vercel.app/district",
    wardsApi: "https://vietnamese-administration.vercel.app/ward",
    fact: "kittens are cool",
  },
};
