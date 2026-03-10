import { CartRepository } from './cart.repository.js';
import { DynamoCartRepository } from './cart.repository.dynamo.js';
import { InMemoryCartRepository } from './cart.repository.memory.js';

const repositoryMode = (process.env.CART_REPOSITORY ?? 'dynamo').toLowerCase();
const useInMemoryCart = repositoryMode === 'memory';

console.log(
  `[cart.repository] using ${useInMemoryCart ? 'memory' : 'dynamo'} backend`,
);

export const cartRepository: CartRepository = useInMemoryCart
  ? new InMemoryCartRepository()
  : new DynamoCartRepository();
