import type { Request, Response } from "express";
import { AppError } from "../../../errors/AppError.js";
import type { PaymentProvider } from "../../../infrastructure/payments/PaymentProvider.js";
import type { PaymentService } from "../services/PaymentService.js";
import type {
  ChapaCallbackQuery,
  InitializePaymentInput,
} from "../schemas/payment.schemas.js";

export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentProvider: PaymentProvider,
  ) {}

  initialize = async (
    req: Request<Record<string, never>, unknown, InitializePaymentInput>,
    res: Response,
  ): Promise<void> => {
    if (!req.user) {
      throw new AppError("Authentication required", 401);
    }
    console.log("payment initializing user", req.user);
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
    console.log({ payment, checkoutUrl });
    res.status(201).json({
      data: {
        paymentId: payment.id,
        status: payment.status,
        checkoutUrl,
      },
    });
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

    if (
      !signature ||
      !this.paymentProvider.verifyWebhookSignature(rawBody, signature)
    ) {
      res.status(401).json({ message: "Invalid webhook signature" });
      return;
    }

    const event = JSON.parse(rawBody.toString("utf8")) as { tx_ref?: string };

    if (!event.tx_ref) {
      res.status(400).json({ message: "Missing tx_ref in webhook payload" });
      return;
    }

    await this.paymentService.confirmPayment(event.tx_ref);

    res.status(200).json({ received: true });
  };

  callback = async (
    req: Request,
    res: Response<unknown, { validated: ChapaCallbackQuery }>,
  ): Promise<void> => {
    await this.paymentService.confirmPayment(res.locals.validated.tx_ref);

    res.status(200).json({ received: true });
  };
}
