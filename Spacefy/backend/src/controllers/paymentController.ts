import { Request, Response } from "express";
import PaymentModel from "../models/paymentModel";

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { userId, spaceId, amount } = req.body;

    const payment = await PaymentModel.create({
      userId,
      spaceId,
      amount,
    });

    res.status(201).json({
      message: "Pedido de pagamento criado com sucesso.",
      paymentId: payment._id,
      status: payment.status,
    });
    return;
  } catch (err) {
    console.error("Erro ao criar pagamento:", err);
    res.status(500).json({ error: "Erro ao criar pagamento" });
    return;
  }
};