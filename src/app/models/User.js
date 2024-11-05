import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            admin: Sequelize.BOOLEAN,
            active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            }
        }, {
            sequelize,
        });

        // Hook para hashear a senha antes de salvar
        this.addHook('beforeSave', async (User) => {
            if (User.password) {
                User.password_hash = await bcrypt.hash(User.password, 10);
            }
        });

        return this;
    }

    static associate(models) {
        this.hasMany(models.Favorite, { foreignKey: 'user_id', as: 'favorites' });
        this.hasOne(models.Address, { foreignKey: 'user_id', as: 'address' });
    }


    async checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}

export default User;
