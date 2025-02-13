import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { colors } from "../tools/color";




const BorderlessTextFeild = ({label, type, placeholder, onChange, value, maxLength, error}) =>
    {
        return (
            <motion.div
            animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
            transition={{ duration: 0.5 }}
            >
                <p className="text-dark">{label}</p>
                <input type={type} className={error == true ? "form-control input-danger-text" : "form-control borderless-primary-input-text"} maxLength={maxLength ?? 50} placeholder={placeholder} value={value} onChange={onChange} />
            </motion.div>
        )
    }

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

            const BordelessTextAreaFeild = ({label, placeholder, onChange, value, maxLength, row, error}) =>
                {
                    return(
                        <motion.div
                        animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                        transition={{ duration: 0.5 }}
                        >
                            <p className="text-dark">{label}</p>
                            <textarea className={error == true ? "form-control input-danger-text" : "form-control borderless-input-text"} value={value} maxLength={maxLength ?? 100} placeholder={placeholder} rows={row} onChange={onChange}></textarea>
                        </motion.div>
                    )
                }


                const SelectField = ({ label, options, onChange, value, error }) => {
                    return (
                        <motion.div
                            animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                            transition={{ duration: 0.5 }}
                        >
                            {/* <p className="text-dark">{label}</p> */}
                            <select 
                                className={error ? "form-control input-danger-text" : "form-control input-text"} 
                                value={value} 
                                onChange={onChange}
                            >
                                <option value="" disabled>{label}</option>
                                {options.map((option, index) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </motion.div>
                    );
                };
                
                const CheckboxField = ({ label, checked, onChange, error }) => {
                    return (
                        <motion.div
                            animate={error ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }} // Shake effect
                            transition={{ duration: 0.5 }}
                            className="d-flex align-items-center gap-2"
                        >
                            <input 
                                type="checkbox" 
                                checked={checked} 
                                onChange={onChange} 
                                className={error ? "form-check-input input-danger-text custom-checkbox" : "form-check-input custom-checkbox"}
                                style={{paddingTop: "20px", paddingLeft: "20px"}} 
                            />
                            <label className="text-dark">{label}</label>
                        </motion.div>
                    );
                };
        

export {
    TextFeild, 
    TextIconFeild, 
    TextAreaFeild, 
    SelectField, 
    CheckboxField, 
    TextPassWordField, 
    BorderlessTextFeild, 
    BordelessTextAreaFeild
}