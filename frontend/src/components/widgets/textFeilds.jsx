import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";




const TextFeild = ({label, type, placeholder, onChange, value, maxLength, error}) =>
    {
        return (
            <motion.div
            animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
            transition={{ duration: 0.5 }}
            >
                <p className="text-dark">{label}</p>
                <input type={type} className={error == true ? "form-control input-danger-text" : "form-control input-text"} maxLength={maxLength ?? 50} placeholder={placeholder} value={value} onChange={onChange} />
            </motion.div>
        )
    }


    const TextPassWordField = ({ label, type, placeholder, onChange, value, maxLength, error }) => {
        const [showPassword, setShowPassword] = useState(false);

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };
    
        return (
            <motion.div 
            animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
            transition={{ duration: 0.5 }}
            className="form-group has-search-suffix">
                    <span className="form-control-feedback-suffix" 
                onClick={togglePasswordVisibility}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
                <input
                    type={showPassword ? "text" : "password"}
                    className={error == true ? "form-control input-danger-text" : "form-control input-text"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    maxLength={maxLength ?? 50}
                />
            </motion.div>
        );
    };


    const TextIconFeild = ({type, placeholder, onchange, icon, value, label, error, maxLength}) =>
        {
            return (
                <div className="form-group has-search">
                    <span className="fa fa-search form-control-feedback"><img src={icon} className="img-fluid" style={{paddingTop: "5px"}}/></span>
                    {/* <p className="text-dark">{label}</p> */}
                    <input type={type} className="form-control input-secondary-text" onChange={onchange} maxLength={maxLength ?? 30} value={value} placeholder={placeholder} />
                </div>
                )
        }

        const TextAreaFeild = ({label, placeholder, onChange, value, maxLength, row, error}) =>
            {
                return(
                    <motion.div
                    animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                    transition={{ duration: 0.5 }}
                    >
                        <p className="text-dark">{label}</p>
                        <textarea className={error == true ? "form-control input-danger-text" : "form-control input-text"} value={value} maxLength={maxLength ?? 100} placeholder={placeholder} rows={row} onChange={onChange}></textarea>
                    </motion.div>
                )
            }
        

export {TextFeild, TextIconFeild, TextAreaFeild, TextPassWordField}