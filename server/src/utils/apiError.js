class apiError extends Error{
    constructor(statusCode,errors=[],stack="",message="Something went wrong"){
            super(message)
            this.statusCode = statusCode,
            this.errors = errors,
            this.data = null,
            this.success = false,
            this.message = message
            if(stack){
                this.stack = stack
            }else{
                Error.captureStackTrace(this,this.constructor)
            }

    }
}

export {apiError}