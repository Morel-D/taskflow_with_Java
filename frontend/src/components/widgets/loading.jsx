const Loading = () => {
    return ( 
        <div className="text-center p-5">
            <span className="loader"></span>
            {/* <p className="fs-5 mt-3">Please wait...</p> */}
        </div>
     );
}


const ButtonLoading = () => {
    return (
        <span className="loader-btn"></span>
    )
}
 
export {Loading, ButtonLoading};