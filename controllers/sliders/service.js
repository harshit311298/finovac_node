const model=require('../../model/sliders')

module.exports={
    async addData (data){
        return await new model(data).save()
    },
    
    async editData(query,data){
      return await model.findOneAndUpdate(query,data,{new:true})
    },
 
    async findAllData(query){
        return await model.find(query)
    },

    async findOneData(query){
        return await model.findOne(query)
    },

    async deleteOneData(query){
        return await model.findOneAndDelete(query)
    },
    
    async deleteManyData(query){
        return await model.deleteMany(query)
    },

    async editManyData(query,data){
        return await model.updateMany(query,data,{multi:true})
    }
}



