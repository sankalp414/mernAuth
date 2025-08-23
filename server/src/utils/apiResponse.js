class apiResponse{
    constructor(data,message="Success",statusCode){
        this.data = data,
        this.message = message,
        this.statusCode = statusCode,
        this.success = statusCode
    }

}

export {
    apiResponse
}