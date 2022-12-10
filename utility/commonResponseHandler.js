
module.exports = {

    commonResponse:(res,statusCode,result,message)=>{
    
        return res.status(statusCode).json({
            result:result || "",
            responseMessage:message || "",
            responseCode:statusCode
        })
    },
       sendResponseWithPagination:(responseObj, responseCode, responseMessage, data, paginationData)=>{
        return responseObj.send({'responseCode':responseCode,'responseMessage':responseMessage,result:data,paginationData:paginationData || ''})
       },
       sendResponseWithData:(responseObj,responseCode,responseMessage,data,token)=>{
        return responseObj.send({'response_code':responseCode,'response_message':responseMessage,result:data, token:tokn});
       },
       sendResponseWithoutData: (responseObj, responseCode, responseMessage) => {
        return responseObj.send({'response_code':responseCode,'response_message':responseMessage});
    }
    
    }