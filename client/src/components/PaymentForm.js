import { CardElement } from "@stripe/react-stripe-js";

export default function PaymentForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h2>Payment form</h2>

      <form onSubmit={handleSubmit}>
        <CardElement />
        <button>Pay</button>
      </form>
    </div>
  );
}
