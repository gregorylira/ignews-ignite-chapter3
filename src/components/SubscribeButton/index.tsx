import styles from "./styles.module.scss";
import { signIn, useSession } from "next-auth/react";
import { api } from "../../service/api";
import { getStripeJs } from "../../service/stripe-js";

export function SubscribeButton() {
  const { data: session, status } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
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
