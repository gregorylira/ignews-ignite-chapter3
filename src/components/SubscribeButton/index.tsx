import styles from "./styles.module.scss";
import { signIn, useSession } from "next-auth/react";

export function SubscribeButton() {
  const { data: session, status } = useSession();

  function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
