interface PaymentConfirmationEmailInput {
  customerName: string;
  orderUrl: string;
  amount: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
}
export const paymentConfirmationEmail = ({
  customerName,
  orderUrl,
  amount,
}: PaymentConfirmationEmailInput): EmailTemplate => {
  return {
    subject: "Payment Confirmation - FlowForge",
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <title>Payment Confirmation</title>
        </head>

        <body
          style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f5;
            font-family: Arial, Helvetica, sans-serif;
            color: #18181b;
          "
        >
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="background-color: #f4f4f5; padding: 40px 16px;"
          >
            <tr>
              <td align="center">

                <table
                  width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0"
                  style="
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                  "
                >

                  <!-- Header -->
                  <tr>
                    <td
                      style="
                        padding: 28px 32px;
                        background-color: #18181b;
                        text-align: center;
                      "
                    >
                      <div
                        style="
                          color: #ffffff;
                          font-size: 24px;
                          font-weight: 700;
                          letter-spacing: -0.5px;
                        "
                      >
                        FlowForge
                      </div>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 32px;">

                      <div
                        style="
                          width: 56px;
                          height: 56px;
                          margin: 0 auto 24px;
                          border-radius: 50%;
                          background-color: #dcfce7;
                          color: #16a34a;
                          font-size: 28px;
                          line-height: 56px;
                          text-align: center;
                        "
                      >
                        ✓
                      </div>

                      <h1
                        style="
                          margin: 0 0 12px;
                          text-align: center;
                          font-size: 26px;
                          line-height: 34px;
                        "
                      >
                        Payment Successful
                      </h1>

                      <p
                        style="
                          margin: 0 0 32px;
                          text-align: center;
                          color: #71717a;
                          font-size: 15px;
                          line-height: 24px;
                        "
                      >
                        Hi ${customerName}, your payment has been successfully
                        processed and your order is now being prepared.
                      </p>

                      <!-- Order Summary -->
                      <table
                        width="100%"
                        cellpadding="0"
                        cellspacing="0"
                        border="0"
                        style="
                          background-color: #fafafa;
                          border: 1px solid #e4e4e7;
                          border-radius: 8px;
                        "
                      >
                        <tr>
                          <td
                            colspan="2"
                            style="
                              padding: 18px 20px;
                              border-bottom: 1px solid #e4e4e7;
                              font-size: 14px;
                              font-weight: 700;
                            "
                          >
                            Order Summary
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 16px 20px 8px;
                              color: #71717a;
                              font-size: 14px;
                            "
                          >
                            Order
                          </td>

                          <td
                            align="right"
                            style="
                              padding: 16px 20px 8px;
                            "
                          >
                            <a
                              href="${orderUrl}"
                              style="
                                color: #18181b;
                                font-size: 14px;
                                font-weight: 600;
                                text-decoration: none;
                                "
                            >
                            View Order
                            </a>
                          </td>
                        </tr>

                        <tr>
                          <td
                            style="
                              padding: 8px 20px 16px;
                              color: #71717a;
                              font-size: 14px;
                            "
                          >
                            Total Paid
                          </td>

                          <td
                            align="right"
                            style="
                              padding: 8px 20px 16px;
                              font-size: 16px;
                              font-weight: 700;
                            "
                          >
                            ETB ${amount}
                          </td>
                        </tr>
                      </table>

                      <p
                        style="
                          margin: 28px 0 0;
                          text-align: center;
                          color: #71717a;
                          font-size: 14px;
                          line-height: 22px;
                        "
                      >
                        Thank you for shopping with FlowForge.
                        We'll keep you updated as your order progresses.
                      </p>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td
                      style="
                        padding: 24px 32px;
                        background-color: #fafafa;
                        border-top: 1px solid #e4e4e7;
                        text-align: center;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #a1a1aa;
                          font-size: 12px;
                          line-height: 18px;
                        "
                      >
                        This is an automated message from FlowForge.
                        Please do not reply to this email.
                      </p>

                      <p
                        style="
                          margin: 8px 0 0;
                          color: #a1a1aa;
                          font-size: 12px;
                        "
                      >
                        © 2026 FlowForge
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  };
};
