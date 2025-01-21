import { errorMessages } from "./errorMessage";

export const catchApiErrors = (error) => {
    console.log("ERROR --> ", error);
    if(error.response){
        const status = error.response.data.message;
        console.log("RESPONSE ERROR --> ", status);
        return {status: false, error: errorMessages[status] || errorMessages.UNKNOWN_ERROR}
    }else if(error.resquest){
        return {status: false, error: errorMessages.NETWORK_ERROR};
    }else {
        return {status: false, error: errorMessages.UNKNOWN_ERROR}
    }
};