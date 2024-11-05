import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth';

function authMiddlewares(request, response, next) {
    const authToken = request.headers.authorization;

    if (!authToken) {
        return response.status(401).json({ error: 'Token não informado!' });
    }

    const tokenParts = authToken.split(' ');

    if (tokenParts.length !== 2) {
        return response.status(401).json({ error: 'Token mal formatado!' });
    }

    const token = tokenParts[1]; 

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return response.status(401).json({ error: 'Token inválido!' });
        }

        request.userId = decoded.id;
        request.userName = decoded.name;

        return next();
    });
}

export default authMiddlewares;
