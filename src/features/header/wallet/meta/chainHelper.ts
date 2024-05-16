import { ChainId, NETWORKS, hexId } from "./chains"

export async function changeChain(to: ChainId): Promise<boolean> {
  console.log(to);
  
  try {
    if (!window.ethereum) {
      alert("No crypto wallet found")
      throw new Error("No crypto wallet found")
    }

    try {
      let res = await window.ethereum?.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId(Number(to)) }],
      })
      console.log(res);
      return true
    } catch (e) {

      console.error("Error while 'switch chain': ", e)
      if ((e as any).code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexId(Number(to)),
                chainName: NETWORKS[to].name,
                rpcUrls: [NETWORKS[to].rpc],
                nativeCurrency: {
                  name: NETWORKS[to].symbol,
                  symbol: NETWORKS[to].symbol,
                  decimals: 18,
                },
                blockExplorerUrls: [NETWORKS[to].scanner],
              },
            ],
          })
        } catch (e) {
          alert("Error while 'add chain': ")
          console.error("Error while 'add chain': ", e)
          return false
        }
      } else {
        return false
      }
    }
  } catch (e) {
    console.error(e)
    return false
  }

  return true
}
