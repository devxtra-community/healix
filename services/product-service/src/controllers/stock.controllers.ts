import { Request, Response, NextFunction } from 'express';
import { Types, startSession } from 'mongoose';
import { StockService } from '../services/stock.services.js';
import { StockRepository } from '../repositories/stock.repositories.js';
import { BadRequestError } from '../errors/BadRequestError.js';

const stockRepository = new StockRepository();
const stockService = new StockService(stockRepository);

export class StockController {
  // GET STOCK (admin / internal)

  async getStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { versionId } = req.params;

      if (!Types.ObjectId.isValid(versionId)) {
        res.status(400).json({ message: 'Invalid version ID' });
        return;
      }

      const stock = await stockService.getStock(new Types.ObjectId(versionId));

      res.status(200).json(stock);
    } catch (error) {
      next(error);
    }
  }

  // RESERVE STOCK (order created)

  async reserveStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = await startSession();

    try {
      const { versionId, quantity } = req.body;

      if (
        !Types.ObjectId.isValid(versionId) ||
        typeof quantity !== 'number' ||
        quantity <= 0
      ) {
        res.status(400).json({ message: 'Invalid input' });
        return;
      }

      session.startTransaction();

      await stockService.reserveStock(
        new Types.ObjectId(versionId),
        quantity,
        session,
      );

      await session.commitTransaction();

      res.status(200).json({ message: 'Stock reserved' });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  // CONFIRM STOCK (payment success)

  async confirmStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = await startSession();

    try {
      const { versionId, quantity } = req.body;

      if (
        !Types.ObjectId.isValid(versionId) ||
        typeof quantity !== 'number' ||
        quantity <= 0
      ) {
        res.status(400).json({ message: 'Invalid input' });
        return;
      }

      session.startTransaction();

      await stockService.confirmStock(
        new Types.ObjectId(versionId),
        quantity,
        session,
      );

      await session.commitTransaction();

      res.status(200).json({ message: 'Stock confirmed' });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  // RELEASE STOCK (order cancelled)

  async releaseStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const session = await startSession();

    try {
      const { versionId, quantity } = req.body;

      if (
        !Types.ObjectId.isValid(versionId) ||
        typeof quantity !== 'number' ||
        quantity <= 0
      ) {
        res.status(400).json({ message: 'Invalid input' });
        return;
      }

      session.startTransaction();

      await stockService.releaseStock(
        new Types.ObjectId(versionId),
        quantity,
        session,
      );

      await session.commitTransaction();

      res.status(200).json({ message: 'Stock released' });
    } catch (error) {
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  //RESTOCK (admin)

  async reStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { versionId, quantity } = req.body;

      if (!versionId || !Types.ObjectId.isValid(versionId)) {
        throw new BadRequestError('Invalid or missing versionId');
      }

      const stock = await stockService.restock(
        new Types.ObjectId(versionId),
        quantity,
      );

      res.status(200).json(stock);
    } catch (error) {
      next(error);
    }
  }

  // DECREASE STOCK (admin)

  async decreaseStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { versionId, quantity } = req.body;

      if (!versionId || !Types.ObjectId.isValid(versionId)) {
        throw new BadRequestError('Invalid or missing versionId');
      }

      const stock = await stockService.restock(
        new Types.ObjectId(versionId),
        quantity,
      );

      res.status(200).json(stock);
    } catch (error) {
      next(error);
    }
  }

  // HARD CORRECTION (admin, for audit)

  async correctStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { versionId, total } = req.body;

      if (!versionId || !Types.ObjectId.isValid(versionId)) {
        throw new BadRequestError('Invalid or missing versionId');
      }

      const stock = await stockService.restock(
        new Types.ObjectId(versionId),
        total,
      );

      res.status(200).json(stock);
    } catch (error) {
      next(error);
    }
  }
}
