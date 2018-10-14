import eosjs from "eosjs";

export default function initEos(Vue) {
  const network = {
    local: {
      protocol: "http",
      host: "localhost",
      port: 8888,
      chainId:
        "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f"
    },
    jungle: {
      protocol: "https",
      host: "jungle.eosmetal.io",
      port: 18889,
      chainId:
        "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
    }
  }[process.env.VUE_APP_EOSIO_NETWORK || "local"];

  const eos = eosjs({
    chainId: network.chainId,
    httpEndpoint: `${network.protocol}://${network.host}:${network.port}`
  });
  eos.scatter = null;
  eos.extractErrorMessage = error => {
    let message;
    if (typeof error === "string") {
      const parsedError = JSON.parse(error);
      if (parsedError.error) {
        message = parsedError.error.details[0].message;
      } else {
        message = parsedError.message;
      }
    } else {
      message = error.message;
    }
    return message.charAt(0).toUpperCase() + message.slice(1);
  };

  Vue.mixin({
    beforeCreate() {
      this.$eos = eos;
    }
  });

  return { network, eos };
}
