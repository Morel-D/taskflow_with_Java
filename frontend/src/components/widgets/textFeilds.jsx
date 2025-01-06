const TextFeild = ({label, type, placeholder, onChange, value, maxLength, error}) =>
    {
        return (
            <div>
                <p className="text-dark">{label}</p>
                <input type={type} className={error == true ? "form-control input-danger-text" : "form-control input-text"} maxLength={maxLength} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        )
    }


    const TextIconFeild = ({type, placeholder, onchange, icon, value, label, error, maxLength}) =>
        {
            return (
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"><img src={icon} className="img-fluid" style={{paddingTop: "5px"}}/></span>
                    {/* <p className="text-dark">{label}</p> */}
                    <input type={type} className="form-control input-secondary-text" onChange={onchange} maxLength={maxLength} value={value} placeholder={placeholder} />
                </div>
                )
        }

        const TextAreaFeild = ({label, placeholder, onChange, value, maxLength, row, error}) =>
            {
                return(
                    <div>
                        <p className="text-dark">{label}</p>
                        <textarea className={error == true ? "form-control input-danger-text" : "form-control input-text"} value={value} maxLength={maxLength} placeholder={placeholder} rows={row} onChange={onChange}></textarea>
                    </div>
                )
            }
        

export {TextFeild, TextIconFeild, TextAreaFeild}