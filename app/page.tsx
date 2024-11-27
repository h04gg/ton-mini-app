"use client";

import { Address } from "@ton/core";
import {
  SendTransactionRequest,
  useTonAddress,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { useCallback, useEffect, useState } from "react";
import { UserInfo } from "./components/UserInfo/UserInfo";

export default function Home() {
  const address = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [receiveAddress, setReceiveAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionLink, setTransactionLink] = useState<string | null>(null);

  const transaction: SendTransactionRequest = {
    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
    messages: [
      {
        address: receiveAddress,
        amount: (Number(amount) * 1e9).toString(),
      },
    ],
  };

  const fetchTransactions = async (address: string) => {
    try {
      const response = await fetch(
        `https://testnet.tonapi.io/v2/blockchain/accounts/${address}`
      );
      const data = await response.json();
      if (data && data.last_transaction_hash) {
        const latestTransaction = data.last_transaction_hash; // Latest transaction
        return latestTransaction;
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
    return null;
  };

  const handleSendTransaction = async () => {
    try {
      const result = await tonConnectUI.sendTransaction(transaction);

      if (result) {
        console.log("Transaction sent successfully:", result);
        const latestTransaction = await fetchTransactions(address!);
        if (latestTransaction) {
          setTransactionLink(
            `https://testnet.tonviewer.com/transaction/${latestTransaction}`
          );
        }
      } else {
        console.error("Transaction response is empty or failed.");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const isButtonDisabled = !receiveAddress || !amount || Number(amount) <= 0;

  const handleWalletConnection = useCallback((address: string) => {
    setTonWalletAddress(address);
    console.log("Wallet connected successfully!");
    setIsLoading(false);
  }, []);

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet disconnected successfully!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account?.address);
      } else {
        handleWalletDisconnection();
      }
    };

    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address);
      } else {
        handleWalletDisconnection();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  };

  const formatAddress = (address: string) => {
    const tempAddress = Address.parse(address).toString();

    return `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">TON Connect Demo</h1>

      <UserInfo />
      {tonWalletAddress ? (
        <>
          <div className="mt-4 border rounded-xl p-4 mx-5">
            <div className="mb-4">
              <label className="block text-sm text-start font-medium text-gray-700">
                Recipient Address:
              </label>
              <input
                type="text"
                value={receiveAddress}
                onChange={(e) => setReceiveAddress(e.target.value)}
                className="mt-1 p-2 text-black border rounded-md w-full"
                placeholder="Enter recipient address"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm text-start font-medium text-gray-700">
                Amount:
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 p-2 border text-black rounded-md w-full"
                placeholder="Enter amount"
              />
            </div>

            <button
              className={`mt-4 border rounded-xl p-4 ${
                isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }`}
              onClick={handleSendTransaction}
              disabled={isButtonDisabled}
            >
              Send transaction
            </button>

            {transactionLink && (
              <div className="mt-4">
                <p>Transaction successfully sent!</p>
                <a
                  href={transactionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Transaction on Explorer
                </a>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <p className="mb-4">Connected: {formatAddress(tonWalletAddress)}</p>
            <button
              onClick={handleWalletAction}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Disconnect Wallet
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={handleWalletAction}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Connect TON Wallet
        </button>
      )}
    </main>
  );
}
