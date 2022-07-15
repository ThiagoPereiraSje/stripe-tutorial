import { CardElement } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  return (
    <div>
      <h2>Payment form</h2>

      <div>
        Card: <CardElement />
      </div>
    </div>
  );
}
