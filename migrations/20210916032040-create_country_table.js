'use strict';

/**
 * 
 * 1. Sequelize does not use transactions by default.
 * 2. However, for production-ready usage of Sequelize, you should definitely configure Sequelize to use transactions.
 * 3. Sequelize supports two ways of using transactions:
 * (a) - Unmanaged transactions: Committing and rolling back the transaction should be done manually by the user (by calling the appropriate Sequelize methods).
 * (b) - Managed transactions: Sequelize will automatically rollback the transaction if any error is thrown, or commit the transaction otherwise. Also, if CLS (Continuation Local Storage) is enabled, all queries within the transaction callback will automatically receive the transaction object.
 */


/**
 * 
 * UNMANAGED TRANSACTIONS
 * --------------------------
 * 
  // First, we start a transaction and save it into a variable
  const t = await sequelize.transaction();

  try {

    // Then, we do some calls passing this transaction as an option:

    const user = await User.create({
      firstName: 'Bart',
      lastName: 'Simpson'
    }, { transaction: t });

    await user.addSibling({
      firstName: 'Lisa',
      lastName: 'Simpson'
    }, { transaction: t });

    // If the execution reaches this line, no errors were thrown.
    // We commit the transaction.
    await t.commit();

  } catch (error) {

    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    await t.rollback();

  }
  As shown above, the unmanaged transaction approach requires that you commit and rollback the transaction manually, when necessary.
*/


/**
 *  MANAGED TRANSACTION
 * ------------------------
 * 
 * Managed transactions handle committing or rolling back the transaction automatically. You start a managed transaction by passing a callback to sequelize.transaction. This callback can be async (and usually is).

  The following will happen in this case:

  1. Sequelize will automatically start a transaction and obtain a transaction object t
  2. Then, Sequelize will execute the callback you provided, passing t into it
  3. If your callback throws, Sequelize will automatically rollback the transaction
  4. If your callback succeeds, Sequelize will automatically commit the transaction
  5. Only then the sequelize.transaction call will settle:
  6. Either resolving with the resolution of your callback
  7. Or, if your callback throws, rejecting with the thrown error
  Example code:

    try {

      const result = await sequelize.transaction(async (t) => {

        const user = await User.create({
          firstName: 'Abraham',
          lastName: 'Lincoln'
        }, { transaction: t });

        await user.setShooter({
          firstName: 'John',
          lastName: 'Boothe'
        }, { transaction: t });

        return user;

      });

      // If the execution reaches this line, the transaction has been committed successfully
      // `result` is whatever was returned from the transaction callback (the `user`, in this case)

    } catch (error) {

      // If the execution reaches this line, an error occurred.
      // The transaction has already been rolled back automatically by Sequelize!

    }
    Note that t.commit() and t.rollback() were not called directly (which is correct).
*/

// if you are making use of mysql then don't create the schema just start creating the database and tables.
// let tableModel = { schema: 'app', tableName: 'countries' }
let tableModel = { tableName: 'countries' }

module.exports = {

  up: async (queryInterface, Sequelize) => {
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    const transaction = await queryInterface.sequelize.transaction ();

    try {

      // 1. creating the table

      await queryInterface.createTable (tableModel, {
        
        Id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        Created: { allowNull: false, type: Sequelize.DATE, defaultValue: new Date () },
        Modified: { allowNull: false, type: Sequelize.DATE, defaultValue: new Date () },
        Name: { allowNull: false, type: Sequelize.STRING },
        Capital: { allowNull: false, type: Sequelize.STRING }

      }, { transaction })

      // 2. Add Indices

      await queryInterface.addIndex (tableModel, ['Id'], { transaction });
      await queryInterface.addIndex (tableModel, ['Name'], { transaction });

      // 3. Commit the transaction

      await transaction.commit ();

    } catch (error) {

      await transaction.rollback ();
      throw error;

    }

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable (tableModel);

  }
  
};
