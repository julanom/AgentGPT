import crypto from "crypto";
import { env } from "../env/server.mjs";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

const stripeRequest = async (path: string, body: URLSearchParams) => {
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY ?? ""}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Stripe error: ${response.status} ${errorBody}`);
  }

  return response.json();
};

export const createCheckoutSession = async ({
  customerEmail,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerEmail: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) => {
  const params = new URLSearchParams();
  params.append("mode", "subscription");
  params.append("customer_email", customerEmail);
  params.append("success_url", successUrl);
  params.append("cancel_url", cancelUrl);
  params.append("line_items[0][price]", priceId);
  params.append("line_items[0][quantity]", "1");
  params.append("allow_promotion_codes", "true");

  return stripeRequest("/checkout/sessions", params);
};

export const verifyStripeSignature = ({
  payload,
  signatureHeader,
}: {
  payload: string;
  signatureHeader: string | undefined;
}) => {
  if (!signatureHeader || !env.STRIPE_WEBHOOK_SECRET) {
    return false;
  }

  const elements = signatureHeader.split(",");
  const timestampPart = elements.find((part) => part.startsWith("t="));
  const signaturePart = elements.find((part) => part.startsWith("v1="));

  if (!timestampPart || !signaturePart) {
    return false;
  }

  const timestamp = timestampPart.replace("t=", "");
  const signature = signaturePart.replace("v1=", "");

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac("sha256", env.STRIPE_WEBHOOK_SECRET)
    .update(signedPayload, "utf8")
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};
