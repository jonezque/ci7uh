import { Account } from "near-api-js/lib/account";
import { useCallback, useEffect, useState } from "react";
import { useConnect } from "../contexts/connect";
import { Contract } from "near-api-js";
import Table, { Market_View } from "./table";

const getContract = (account: Account) =>
  new Contract(
    account, // the account object that is connecting
    process.env.NEXT_PUBLIC_CONTACT_ID!,
    {
      // name of contract you're connecting to
      viewMethods: ["markets", "view_market"], // view methods do not change state but usually return a value
      changeMethods: ["addMessage"], // change methods modify state
    }
  );

type Base = {
  ticker: string;
  decimal: number;
  address: string;
};
type Quote = {
  ticker: string;
  decimal: number;
  address: string;
};
type Market = {
  base: Base;
  fee: number;
  id: number;
  quote: Quote;
};

export default () => {
  const { walletConnection, nearConnection } = useConnect();

  const [contract, setContact] = useState<Contract | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketView, setMarketView] = useState<Market_View | null>(null);
  const onSelect = useCallback(async (id: number, contract: any) => {
    const data = await contract.view_market({ market_id: id });
    setMarketView(data);
  }, []);

  useEffect(() => {
    if (!nearConnection || !walletConnection) return;
    const accId = walletConnection.getAccountId();
    if (!accId) return;

    nearConnection.account(accId).then(async (acc) => {
      const contract = getContract(acc);
      setContact(contract);
      const markets = (await (contract as any).markets()) as Market[];
      setMarkets(markets);
      if (markets.length) onSelect(markets[0].id, contract);
    });
  }, [nearConnection, walletConnection]);

  return (
    <div>
      <select onChange={(ev) => onSelect(+ev.target.value, contract)}>
        {markets.map((x) => (
          <option value={x.id} key={x.id}>
            {x.base.ticker} / {x.quote.ticker}
          </option>
        ))}
      </select>
      {marketView && <Table marketView={marketView}></Table>}
    </div>
  );
};
