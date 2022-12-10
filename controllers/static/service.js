const model=require('../../model/static')

module.exports={
    async addData (data){
        return await new model(data).save()
    },
    
    async editData(query,data){
      return await model.findOneAndUpdate(query,data,{new:true})
    },
 
    async findAllData(query){
        return await model.find(query).sort({slideNumber:1})
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
    },

    async paginateData(query,options){
        return await model.paginate(query,options)
    }
}