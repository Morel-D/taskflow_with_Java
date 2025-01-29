import { useState } from "react";

const FloatingCard = ({ triggerText, children, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    return ( 
        <div
        className="relative inline-block"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Trigger Element */}
        <span className="text-blue-600 font-semibold cursor-pointer">
          {triggerText}
        </span>
  
        {/* Dropdown Content */}
        {isOpen && (
          <div
            className={`absolute left-0 mt-2 p-4 w-56 bg-white shadow-lg border border-gray-300 rounded-lg transition-all duration-300 ease-in-out ${className}`}
          >
            {children}
          </div>
        )}
      </div>
     );
}
 
export default FloatingCard;