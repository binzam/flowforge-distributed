import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError } from "../../errors/AppError.js";
import type {
  InitializePaymentInput,
  InitializePaymentResult,
  PaymentProvider,
  VerifyPaymentResult,
} from "./PaymentProvider.js";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

export class ChapaProvider implements PaymentProvider {
  constructor(private readonly secretKey: string) {}

  async initialize(
    input: InitializePaymentInput,
  ): Promise<InitializePaymentResult> {
    const response = await fetch(`${CHAPA_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: input.amount,
        currency: input.currency,
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        tx_ref: input.txRef,
        callback_url: input.callbackUrl,
        return_url: input.returnUrl,
      }),
    });

    const body = await response.json();
    console.log("body", body);
    if (!response.ok || body.status !== "success") {
      throw new AppError(
        body?.message ?? "Failed to initialize payment with Chapa",
        502,
      );
    }

    return { checkoutUrl: body.data.checkout_url };
  }

  async verify(txRef: string): Promise<VerifyPaymentResult> {
    const response = await fetch(
      `${CHAPA_BASE_URL}/transaction/verify/${encodeURIComponent(txRef)}`,
      {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      },
    );

    const body = await response.json();

    if (!response.ok || body.status !== "success") {
      throw new AppError(
        body?.message ?? "Failed to verify payment with Chapa",
        502,
      );
    }
    return {
      status: body.data.status,
      amount: body.data.amount,
      currency: body.data.currency,
      txRef: body.data.tx_ref,
      reference: body.data.reference,
    };
  }

  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean {
    const expected = createHmac("sha256", this.secretKey)
      .update(rawBody)
      .digest("hex");

    const expectedBuf = Buffer.from(expected, "hex");
    const givenBuf = Buffer.from(signatureHeader, "hex");

    if (expectedBuf.length !== givenBuf.length) {
      return false;
    }

    return timingSafeEqual(expectedBuf, givenBuf);
  }
}
