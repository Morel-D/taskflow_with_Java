const Loading = () => {
    return ( 
        <div className="text-center p-5">
            <span class="loader"></span>
            {/* <p className="fs-5 mt-3">Please wait...</p> */}
        </div>
     );
}


const ButtonLoading = () => {
    return (
        <span class="loader-btn"></span>
    )
}
 
export {Loading, ButtonLoading};