import { UnauthorizedError } from '../../errors/UnauthorizedError.js';
export const adminOnly = (req, res, next) => {
    const userId = req.header('x-user-id');
    const userRole = req.header('x-user-role');
    if (!userId || userRole !== 'admin') {
        throw new UnauthorizedError('Admin Only');
    }
    req.auth = {
        id: userId,
        role: 'admin',
    };
    next();
};
