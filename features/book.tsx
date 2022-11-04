import { Account } from "near-api-js/lib/account";
import { useEffect, useState } from "react";
import { useConnect } from "../contexts/connect";
import { Contract } from "near-api-js";
import Table, { Market_View } from "./table";

const getContract = (account: Account): MarketContact =>
  new Contract(
    account, // the account object that is connecting
    process.env.NEXT_PUBLIC_CONTACT_ID!,
    {
      // name of contract you're connecting to
      viewMethods: ["markets", "view_market"], // view methods do not change state but usually return a value
      changeMethods: ["addMessage"], // change methods modify state
    }
  ) as MarketContact;

type MarketContact = Contract & {
  markets: () => Promise<Market[]>;
  view_market: (params: { market_id: number }) => Promise<Market_View>;
};

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

const onMarketSelect = async (
  id: number,
  contract: MarketContact | null,
  onDone: (marketView: Market_View) => void
) => {
  if (!contract) return;
  const data = await contract.view_market({ market_id: id });
  onDone(data);
};

export default () => {
  const { walletConnection, nearConnection } = useConnect();

  const [contract, setContact] = useState<MarketContact | null>(null);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketView, setMarketView] = useState<Market_View | null>(null);

  useEffect(() => {
    if (!nearConnection || !walletConnection) return;
    const accId = walletConnection.getAccountId();
    if (!accId) return;

    nearConnection.account(accId).then(async (acc) => {
      const contract = getContract(acc);
      setContact(contract);
      const markets = (await (contract as any).markets()) as Market[];
      setMarkets(markets);
      if (markets.length)
        onMarketSelect(markets[0].id, contract, setMarketView);
    });
  }, [nearConnection, walletConnection]);

  return (
    <div>
      <select
        onChange={(ev) =>
          onMarketSelect(+ev.target.value, contract, setMarketView)
        }
      >
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
