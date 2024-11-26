import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export const UserInfo = () => {
  const address = useTonAddress();
  const rawAddress = useTonAddress(false);
  const wallet = useTonWallet();
  const [balance, setBalance] = useState("0");

  const fetchBalance = async (userAddress: string) => {
    try {
      const response = await fetch(
        `https://testnet.toncenter.com/api/v2/getAddressInformation?address=${userAddress}`
      );
      const data = await response.json();

      console.log("data", data);
      if (data && data.result) {
        setBalance((Number(data.result.balance) / 1e9).toFixed(3));
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address]);

  return (
    <div className="mt-3">
      {address && (
        <div className="grid">
          <p className=" text-xl font-bold text-center">
            User Address: {address}
          </p>
          <span>Raw address: {rawAddress}</span>
        </div>
      )}

      {wallet && (
        <div>
          {/* <span>Connected wallet: {wallet.name}</span> */}
          <span>Device: {wallet.device.appName}</span>
        </div>
      )}

      <div className="mt-4">
        {address && (
          <div>
            <p className="text-xl font-bold">Balance: {balance} TON</p>
          </div>
        )}
      </div>
    </div>
  );
};
