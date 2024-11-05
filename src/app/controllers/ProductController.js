import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);
        if (!isAdmin) {
            return response.status(401).json({ error: 'Only admins can create products.' });
        }

        const { filename: path } = request.file;
        const { name, price, category_id, offer } = request.body;

        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
        });

        return response.status(201).json(product);
    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { admin: isAdmin } = await User.findByPk(request.userId);
        if (!isAdmin) {
            return response.status(401).json({ error: 'Only admins can update products.' });
        }

        const { id } = request.params;
        const findProduct = await Product.findByPk(id);
        if (!findProduct) {
            return response.status(404).json({ error: 'Product not found.' });
        }

        let path;
        if (request.file) {
            path = request.file.filename;
        }

        const { name, price, category_id, offer } = request.body;

        await Product.update(
            {
                name,
                price,
                category_id,
                path,
                offer,
            },
            {
                where: {
                    id,
                },
            }
        );

        return response.status(200).json({ message: 'Updated successfully' });
    }

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });
        return response.json(products);
    }

    async show(request, response) {
        const { id } = request.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });

        if (!product) {
            return response.status(404).json({ error: 'Product not found.' });
        }

        return response.json(product);
    }

    // Método para deletar produto
    async delete(request, response) {
        const { id } = request.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return response.status(404).json({ error: 'Product not found.' });
        }

        await product.destroy();

        return response.status(200).json({ message: 'Product deleted successfully.' });
    }
}

export default new ProductController();
