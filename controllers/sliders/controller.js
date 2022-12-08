const services = require('./service')

module.exports = {
    addSliders: async (req,res,next) => {
     try {
        
     } catch (error) {
        
     }
    },
    listSliders:async(req,res,next)=>{
        try {
            let findSliders=await services.findAllData({status:"ACTIVE"})
            res.status(200).send({responseCode:200,responseMessage:"Data found successFully.",result:{docs:findSliders}})

        } catch (error) {
            res.status(501).send({responseCode:501,responseMessage:"Something went wrong ."})
        }
    }
}