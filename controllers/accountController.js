const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');

class AccountController {

    static async createTransaction(req, res) {
        try {
            const { accountNumber, amount, type } = req.body;

            // Encontre a conta pela qual a transação está sendo feita
            let account = await Account.findOne({ accountNumber });
            if (!account) {
                return res.status(404).json({ message: 'Conta não encontrada' });
            }

            // Criar a transação
            let transaction = new Transaction({
                accountNumber,
                amount,
                type
            });

            if (type === "debit") {
                if (account.balance < amount) {
                    return res.status(400).json({ message: 'Saldo insuficiente' });
                }
                account.balance -= amount;
            } else if (type === "credit") {
                account.balance += amount;
            }

            await transaction.save();
            await account.save();  // Atualize o saldo da conta

            res.status(201).json(transaction);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getBalance(req, res) {
        try {
            const account = await Account.findOne({ accountNumber: req.params.accountNumber });
            if (!account) {
                return res.status(404).json({ message: 'Conta não encontrada' });
            }
            res.json({ balance: account.balance });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getAccountDetails(req, res) {
        try {
            const account = await Account.findOne({ accountNumber: req.params.accountNumber });
            if (!account) {
                return res.status(404).json({ message: 'Conta não encontrada' });
            }
            res.json(account);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getTransactionsHistory(req, res) {
        try {
            const transactions = await Transaction.find({ accountNumber: req.params.accountNumber });
            res.json(transactions);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AccountController;
