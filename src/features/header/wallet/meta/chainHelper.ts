import { ChainId, NETWORKS, hexId } from "./chains"

export async function changeChain(to: ChainId): Promise<boolean> {
  try {
    if (!window.ethereum) {
      throw new Error("No crypto wallet found")
    }

    try {
      await window.ethereum?.request?.({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexId(Number(to)) }],
      })
      return true
    } catch (e) {
      console.error("Error while 'switch chain': ", e)
      if ((e as any).code === 4902) {
        // const result = async () => {
        //   const param = {
        //     chainId: hexId(Number(to)),
        //     chainName: NETWORKS[to].name,
        //     nativeCurrency: {
        //       name: NETWORKS[to].symbol,
        //       symbol: NETWORKS[to].symbol,
        //       decimals: 18,
        //     },
        //     rpcUrls: [NETWORKS[to].rpc],
        //     blockExplorerUrls: [NETWORKS[to].scanner],
        //   }
        //   await window.ethereum?.request?.({
        //     method: "wallet_addEthereumChain",
        //     params: [param],
        //   })
        // }
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: hexId(Number(to)),
                chainName: NETWORKS[to].name,
                rpcUrls: [NETWORKS[to].rpc],
                // iconUrls: [
                //   "https://xdaichain.com/fake/example/url/xdai.svg",
                //   "https://xdaichain.com/fake/example/url/xdai.png",
                // ],
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
          console.error("Error while 'add chain': ", e)
          return false
        }
      }
      return true
    }
  } catch (e) {
    console.error(e)
  }

  return false
}
