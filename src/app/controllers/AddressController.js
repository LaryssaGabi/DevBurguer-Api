import Address from '../models/Address';

class AddressController {
    async store(req, res) {
        try {
            const { rua, bairro, complemento, cep, cidade } = req.body;
            const { userId } = req; 

            console.log('User ID:', userId);
            const address = await Address.create({ rua, bairro, complemento, cep, cidade, user_id: userId });
            return res.status(201).json({ success: true, address });
        } catch (error) {
            console.error('Erro ao criar endereço:', error);
            return res.status(500).json({ success: false, error: 'Erro ao criar endereço' });
        }
    }

    async update(req, res) {
        try {
            const { rua, bairro, complemento, cep, cidade } = req.body;
            const { id } = req.params;

            const address = await Address.findByPk(id);
            if (!address) {
                return res.status(404).json({ success: false, error: 'Endereço não encontrado' });
            }

            await address.update({ rua, bairro, complemento, cep, cidade });
            return res.json({ success: true, address });
        } catch (error) {
            console.error('Erro ao atualizar endereço:', error);
            return res.status(500).json({ success: false, error: 'Erro ao atualizar endereço' });
        }
    }

    async show(req, res) {
        try {
            const { userId } = req;
            const address = await Address.findOne({ where: { user_id: userId } });
            if (!address) {
                return res.status(404).json({ success: false, error: 'Endereço não encontrado' });
            }
            return res.json({ success: true, address });
        } catch (error) {
            console.error('Erro ao buscar endereço:', error);
            return res.status(500).json({ success: false, error: 'Erro ao buscar endereço' });
        }
    }
}

export default new AddressController();
