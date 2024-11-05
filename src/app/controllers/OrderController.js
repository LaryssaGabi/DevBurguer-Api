import * as Yup from 'yup';
import Order from '../schemas/Order';
import Product from '../models/Product';
import Category from '../models/Category';
import User from '../models/User';

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array().required().of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required()
                })
            ),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        const productIds = products.map(product => product.id);

        const productsStock = await Product.findAll({
            where: {
                id: productIds,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                }
            ]
        });

        const formattedProducts = productsStock.map(product => {
            const productIndex = products.findIndex(item => item.id === product.id);

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                category: product.category.name,
                url: product.url,
                quantity: products[productIndex].quantity,
            };
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido realizado',
        };

        const createOrder = await Order.create(order);

        return response.status(201).json(createOrder);
    }

    async index(request, response) {
        const orders = await Order.find()
        return response.json(orders)
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string().required(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const {admin: isAdmin} = await User.findByPk(request.userId);;
        if(!isAdmin){
            return response.status(401).json({error: 'Only admins can change the status.'})
        }

        const { id } = request.params;
        const { status } = request.body;

        try {
            await Order.updateOne({ _id: id }, { status })
        } catch (err) {
            return response.status(400).json({ error: err.message })
        }
        return response.json({ message: 'Status updated sucessfully' })
    }
}

export default new OrderController();
