import { colors } from "../tools/color"

const PrimaryButton = ({children, href, onClick}) =>
    {
       return( 
        <a className="primary-button" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.primaryColor, '--whiteColor': colors.whiteColor }}>{children}</a>
       )
    }


    const SecondaryButton = ({children, href, onClick}) =>
        {
           return( 
            <a className="secondary-button" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.primaryColor, '--whiteColor': colors.whiteColor }}>{children}</a>
           )
        }
    

const DangerButton = ({children, href, onClick}) =>
    {
        return( 
        <a className="danger-button" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.dangerColor, '--whiteColor': colors.whiteColor }}>{children}</a>
        )
    }


const IconButton = ({icon, children, href, onClick}) =>
    {
        return( 
        <a className="icon-button" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.dangerColor, '--whiteColor': colors.whiteColor }}><img src={icon} className="img-fluid" />{children}</a>
        )
    }

export {PrimaryButton, SecondaryButton, DangerButton, IconButton}