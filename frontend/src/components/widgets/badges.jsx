const PrimaryBadge = ({children, clasname}) => {
    return(
        <div>
            <label className={clasname ?? "joined-badge"}>{children}</label>
        </div>
    )
}

const SecondaryBadge = ({children, classname}) => {
    <div>
        <label className={classname}>{children}</label>
    </div>
}

export {PrimaryBadge, SecondaryBadge}