import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  keyStores,
  connect,
  WalletConnection,
  ConnectConfig,
  Near,
} from "near-api-js";
const KEY_PREFIX = "test_prefix";

export const startUp = async () => {
  const connectionConfig: ConnectConfig = {
    networkId: "testnet",
    keyStore: new keyStores.BrowserLocalStorageKeyStore(
      localStorage,
      KEY_PREFIX
    ),
    nodeUrl: "https://rpc.testnet.near.org",
    walletUrl: "https://wallet.testnet.near.org",
    helperUrl: "https://helper.testnet.near.org",
    explorerUrl: "https://explorer.testnet.near.org",
  } as unknown as ConnectConfig;
  const nearConnection = await connect(connectionConfig);

  const walletConnection = new WalletConnection(nearConnection, KEY_PREFIX);
  return { walletConnection, nearConnection };
};

const defaultValue = { walletConnection: null, nearConnection: null };
type ConfigType = {
  walletConnection: WalletConnection | null;
  nearConnection: Near | null;
};
const ConnectContext = createContext<ConfigType>(defaultValue);

export const ConnectProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const [config, setConfig] = useState<ConfigType>(defaultValue);

  useEffect(() => {
    startUp().then(({ walletConnection, nearConnection }) =>
      setConfig({ walletConnection, nearConnection })
    );
  }, []);

  return (
    <ConnectContext.Provider value={config}>{children}</ConnectContext.Provider>
  );
};

export const useConnect = () => useContext(ConnectContext);
