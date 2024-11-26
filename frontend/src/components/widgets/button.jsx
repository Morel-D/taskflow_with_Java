import { colors } from "../tools/color"

const PrimaryButton = ({children, href, onClick}) =>
    {
       return( 
        <a className="primaryButton" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.primaryColor, '--whiteColor': colors.whiteColor }}>{children}</a>
       )
    }

const DangerButton = ({children, href, onClick}) =>
    {
        return( 
        <a className="dangerButton" id='prIdMdl'  href={href} onClick={onClick} style={{ '--primaryColor': colors.dangerColor, '--whiteColor': colors.whiteColor }}>{children}</a>
        )
    }

export {PrimaryButton, DangerButton}