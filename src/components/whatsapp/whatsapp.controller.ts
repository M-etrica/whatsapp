import type { Request, Response, NextFunction } from 'express';
import service from './whatsapp.service';

export async function sendMessage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await service.sendMessage(req.body);
    return res.status(200).json({ message: 'OK', ...data });
  } catch (err) {
    return next(err);
  }
}

export async function sendMessageTemplate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await service.templateMessageDispatcher(req.body);
    return res.status(200).json({ message: 'OK', ...data });
  } catch (err) {
    return next(err);
  }
}

export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    await service.webhook(req.body);
    return res.status(200).json({ message: 'OK' });
  } catch (err) {
    return next(err);
  }
}

export async function webhookGet(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = await service.registerWebhook(req.query);
    return res.status(200).send(data);
  } catch (err) {
    return next(err);
  }
}
