export interface InitializePaymentInput {
  amount: string;
  currency: string;
  txRef: string;
  email: string;
  firstName: string;
  lastName: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface InitializePaymentResult {
  checkoutUrl: string;
}

export interface VerifyPaymentResult {
  status: string;
  amount: string;
  currency: string;
  txRef: string;
  reference: string;
}

export interface PaymentProvider {
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  verify(txRef: string): Promise<VerifyPaymentResult>;
  verifyWebhookSignature(rawBody: Buffer, signatureHeader: string): boolean;
}
