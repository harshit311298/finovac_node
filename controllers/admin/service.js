const model = require('../../model/user')

module.exports = {
    findUser: async (query) => {
        return await model.findOne(query)
    },
    updateUser: async (query, data) => {
        return await model.findOneAndUpdate(query, data, { new: true })
    },
    findAllData: async (query) => {
        return await model.find(query)
    },
    async deleteOneData(query) {
        return await model.findOneAndDelete(query)
    },

    async deleteManyData(query) {
        return await model.deleteMany(query)
    },

    async editManyData(query, data) {
        return await model.updateMany(query, data, { multi: true })
    }

}