import { useTonAddress, useTonWallet } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export const UserInfo = () => {
  const address = useTonAddress();

  const wallet = useTonWallet();
  const [balance, setBalance] = useState("0");

  const fetchBalance = async (userAddress: string) => {
    try {
      const response = await fetch(
        `https://testnet.toncenter.com/api/v2/getAddressInformation?address=${userAddress}`
      );
      const data = await response.json();

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="mt-3">
      {address && (
        <div className="grid">
          <p className=" text-xl font-bold text-center">
            User Address: {formatAddress(address)}
          </p>
        </div>
      )}

      {wallet && (
        <div>
          <p className="text-center">Device: {wallet.device.appName}</p>
        </div>
      )}

      <div className="mt-4">
        {address && (
          <div>
            <p className="text-xl text-center font-bold">
              Balance: {balance} TON
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
