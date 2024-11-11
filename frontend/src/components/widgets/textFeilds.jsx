const TextFeild = ({label, type, placeholder, onChange, value, maxLength}) =>
    {
        return (
            <div>
                <p className="text-dark">{label}</p>
                <input type={type} className="form-control input-text" maxLength={maxLength} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        )
    }


    const TextIconFeild = ({type, placeholder, onchange, icon, value, label, maxLength}) =>
        {
            return (
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"><img src={icon} className="img-fluid" style={{paddingTop: "5px"}}/></span>
                    {/* <p className="text-dark">{label}</p> */}
                    <input type={type} className="form-control input-secondary-text" onChange={onchange} maxLength={maxLength} value={value} placeholder={placeholder} />
                </div>
                )
        }
        

export {TextFeild, TextIconFeild}