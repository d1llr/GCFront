import { prepareWriteContract, writeContract } from "@wagmi/core"
import { ethers } from "ethers"
import * as ERC20_ABI from "./meta/erc20.abi.json"
import * as GC_ABI from "./meta/erc20.abi.json"

// approve call for ERC20
export async function deposit(amount: string) {
  const to = "0x682B708aD0fA04Ad7a49AE95b01CE24b02125f5a" // some wallet to transfer babki on
  const tokenAddress = "0xD722baC68242bc0b830667cD8999AE6DcDFAAC69" // BSC PAC

  // call approve for PAC
  const approvalConfig = await prepareWriteContract({
    address: ERC20_ABI.address,
    abi: ERC20_ABI.abi,
    functionName: "approve",
    args: [GC_ABI.address, ethers.utils.parseEther(amount)],
  })

  const approvalResult = await (await writeContract(approvalConfig)).wait()
  if (!approvalResult.status) {
    console.error(`Approval error: ${approvalResult.logs}`)
    return approvalResult
  }

  // call deposit
  const depositConfig = await prepareWriteContract({
    address: GC_ABI.address,
    abi: GC_ABI.abi,
    functionName: "deposit",
    args: [ethers.utils.parseEther(amount), 0],
  })

  const depositResult = await (await writeContract(depositConfig)).wait()
  if (!depositResult.status) {
    console.error(`Deposit error: ${depositResult.logs}`)
  }
  return depositResult
}

// approve call for ERC20
export async function withdraw(amount: string) {
  // call deposit
  const withdrawConfig = await prepareWriteContract({
    address: GC_ABI.address,
    abi: GC_ABI.abi,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(amount), 0],
  })

  const withdrawResult = await (await writeContract(withdrawConfig)).wait()
  if (!withdrawResult.status) {
    console.error(`Withdraw error: ${withdrawResult.logs}`)
  }
  return withdrawResult
}
