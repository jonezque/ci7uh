import { useRouter } from "next/router";
import { useConnect } from "../contexts/connect";
import Details from "../features/details";
import styles from "../styles/Home.module.css";

export default function Home() {
  const { walletConnection } = useConnect();
  const router = useRouter();

  const ready = !!walletConnection;
  const signedIn = walletConnection?.isSignedIn() ?? false;
  const onLogin = () => {
    walletConnection?.requestSignIn({
      contractId: process.env.NEXT_PUBLIC_CONTACT_ID,
    });
  };
  const onLogOut = () => {
    router.replace("/", undefined, { shallow: true });
    walletConnection?.signOut();
  };
  return (
    <div className={styles.container}>
      <button
        disabled={!ready}
        onClick={signedIn ? onLogOut : onLogin}
      >
        {signedIn ? "Sign Out" : "sign In"}
      </button>
      <Details></Details>
    </div>
  );
}
