import type { Request, Response } from "express";
import { AppError } from "../../../errors/AppError.js";
import type { PaymentProvider } from "../../../infrastructure/payments/PaymentProvider.js";
import type { PaymentService } from "../services/PaymentService.js";
import type { IdempotencyService } from "../../../infrastructure/idempotency/IdempotencyService.js";
import type {
  ChapaCallbackQuery,
  GetPaymentsQuery,
  InitializePaymentInput,
} from "../schemas/payment.schemas.js";

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentProvider: PaymentProvider,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  initialize = async (
    req: Request<Record<string, never>, unknown, InitializePaymentInput>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    const idempotencyKey = req.idempotencyKey;
    const existing = await this.idempotencyService.get(
      `payment-initialize:${req.user.id}:${idempotencyKey}`,
    );
    if (existing?.status === "completed" && existing.response) {
      res.status(existing.response.statusCode).json(existing.response.body);

      return;
    }

    if (existing?.status === "processing") {
      throw new AppError(
        "A payment initialization request with this idempotency key is already being processed",
        409,
      );
    }

    const key = `payment-initialize:${req.user.id}:${idempotencyKey}`;

    const acquired = await this.idempotencyService.acquire(key);

    if (!acquired) {
      throw new AppError(
        "A payment initialization request with this idempotency key is already being processed",
        409,
      );
    }
    try {
      const [firstName, ...rest] = req.user.name.trim().split(/\s+/);
      const lastName = rest.join(" ") || firstName;

      const { payment, checkoutUrl } =
        await this.paymentService.initializePayment(
          req.body.orderId,
          req.user.id,
          {
            email: req.user.email,
            firstName,
            lastName,
          },
        );

      const responseBody = {
        data: {
          paymentId: payment.id,
          status: payment.status,
          checkoutUrl,
        },
      };

      await this.idempotencyService.complete(key, 201, responseBody);

      res.status(201).json(responseBody);
    } catch (error) {
      await this.idempotencyService.release(key);

      throw error;
    }
  };

  getByOrderId = async (
    req: Request<{ orderId: string }>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }

    const payment = await this.paymentService.getPaymentForOrder(
      req.params.orderId,
      req.user.id,
      req.user.role,
    );

    res.status(200).json({ data: payment });
  };
  webhook = async (req: Request, res: Response): Promise<void> => {
    const rawBody = req.body as Buffer;
    const signature =
      req.header("x-chapa-signature") ?? req.header("chapa-signature");
    console.log("Payment Controller: webhook : Signature", signature);
    if (
      !signature ||
      !this.paymentProvider.verifyWebhookSignature(rawBody, signature)
    ) {
      res.status(401).json({ message: "Invalid webhook signature" });
      return;
    }

    const event = JSON.parse(rawBody.toString("utf8")) as { tx_ref?: string };
    console.log("Payment Controller: webhook : Event", event);

    if (!event.tx_ref) {
      res.status(400).json({ message: "Missing tx_ref in webhook payload" });
      return;
    }

    await this.paymentService.confirmPayment(event.tx_ref);

    res.status(200).json({ received: true });
  };

  callback = async (
    _req: Request,
    res: Response<unknown, { validated: ChapaCallbackQuery }>,
  ): Promise<void> => {
    await this.paymentService.confirmPayment(res.locals.validated.tx_ref);

    res.status(200).json({ received: true });
  };
  getAll = async (
    _req: Request,
    res: Response<unknown, { validated: GetPaymentsQuery }>,
  ): Promise<void> => {
    const query = res.locals.validated;

    const { payments, total } = await this.paymentService.getPayments(query);

    res.status(200).json({
      data: payments,
      total,
      limit: query.limit ?? null,
      offset: query.offset ?? null,
    });
  };
}
