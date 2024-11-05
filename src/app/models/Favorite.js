import Sequelize, { Model } from 'sequelize';

class Favorite extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    primaryKey: true, 
                    allowNull: false, 
                },
                user_id: Sequelize.UUID,
                product_id: Sequelize.INTEGER,
            },
            {
                sequelize,
                tableName: 'Favorites', 
                underscored: true,
            }
        );
        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
}

export default Favorite;
