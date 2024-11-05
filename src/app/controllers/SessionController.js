/* eslint-disable no-unused-vars */
import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authConfig from '../../config/auth.js';

class SessionController {

    async store(request, response) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6)
        });

        const isValid = await schema.isValid(request.body);

        const emailOrPasswordIncorrect = () => {
            return response.status(401).json({ error: 'Make sure your email or password are correct' });
        };

        if (!isValid) {
            return emailOrPasswordIncorrect();
        }

        const { email, password } = request.body;

        const user = await User.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            return emailOrPasswordIncorrect();
        }

        const isSamePassword = await user.checkPassword(password);

        if (!isSamePassword) {
            return emailOrPasswordIncorrect();
        }

        return response.status(201).json({
            id: user.id,
            name: user.name,
            email,
            admin: user.admin,
            token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            }),
        });
    }

    // Método para listar usuários ativos
    async index(request, response) {
        try {
            const users = await User.findAll({
                where: {
                    active: true, 
                },
                attributes: ['id', 'name', 'email', 'admin'], 
            });

            // Gerar token para cada usuário ativo
            const usersWithToken = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                admin: user.admin,
                token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
                    expiresIn: authConfig.expiresIn,
                }),
            }));

            return response.status(200).json(usersWithToken);
        } catch (error) {
            return response.status(500).json({ error: 'Erro ao buscar usuários ativos' });
        }
    }
}

export default new SessionController();
