import { CartRepository } from './cart.repository.js';
import { DynamoCartRepository } from './cart.repository.dynamo.js';
import { InMemoryCartRepository } from './cart.repository.memory.js';

const useInMemoryCart =
  process.env.CART_REPOSITORY === 'memory' ||
  (process.env.NODE_ENV !== 'production' &&
    process.env.CART_REPOSITORY !== 'dynamo');

export const cartRepository: CartRepository = useInMemoryCart
  ? new InMemoryCartRepository()
  : new DynamoCartRepository();
