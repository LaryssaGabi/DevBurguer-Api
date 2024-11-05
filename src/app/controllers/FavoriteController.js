import Favorite from '../models/Favorite';
import Product from '../models/Product';
import User from '../models/User';

class FavoriteController {
    // Adicionar produto aos favoritos
    async store(request, response) {
        const { product_id } = request.body;
        const user_id = request.userId; // Usuário autenticado

        // Verifique se o produto existe
        const productExists = await Product.findByPk(product_id);
        if (!productExists) {
            return response.status(404).json({ error: 'Product not found.' });
        }

        // Verifique se o produto já está favoritado
        const favoriteExists = await Favorite.findOne({
            where: { user_id, product_id },
        });
        if (favoriteExists) {
            return response.status(400).json({ error: 'Product already in favorites.' });
        }

        // Adicionar aos favoritos
        const favorite = await Favorite.create({ user_id, product_id });

        return response.status(201).json(favorite);
    }

    // Listar favoritos do usuário
    async index(request, response) {
        const user_id = request.userId;

        const favorites = await Favorite.findAll({
            where: { user_id },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'path'],
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'name', 'email'],
                },
            ],
        });

        return response.json(favorites);
    }

    // Remover produto dos favoritos
    async delete(request, response) {
        const { product_id } = request.params;
        const user_id = request.userId;

        const favorite = await Favorite.findOne({
            where: { user_id, product_id },
        });

        if (!favorite) {
            return response.status(404).json({ error: 'Favorite not found.' });
        }

        await favorite.destroy();

        return response.status(200).json({ message: 'Product removed from favorites.' });
    }
}

export default new FavoriteController();
