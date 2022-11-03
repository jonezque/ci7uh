import { AccountBalance } from "near-api-js/lib/account";
import { useEffect, useState } from "react";
import { useConnect } from "../contexts/connect";
import Book from "./book";
import { format } from "./utils";

export default () => {
  const { walletConnection, nearConnection } = useConnect();

  const [balance, setBalance] = useState<AccountBalance | null>(null);

  const ready = !!walletConnection;
  const signedIn = walletConnection?.isSignedIn();
  const accountId = walletConnection?.getAccountId();

  useEffect(() => {
    if (!accountId || !nearConnection) return;
    const account = nearConnection.account(accountId);
    account.then((x) =>
      x.getAccountBalance().then((balance) => setBalance(balance))
    );
  }, [accountId, nearConnection]);

  if (!(ready && signedIn)) return null;

  return (
    <div>
      <div>account: {accountId}</div>
      <div>
        {balance ? (
          <div>balance: {format(balance.total)}</div>
        ) : (
          <div>loading</div>
        )}
      </div>
      <Book></Book>
    </div>
  );
};
