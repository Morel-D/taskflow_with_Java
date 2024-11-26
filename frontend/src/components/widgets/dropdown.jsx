import React, { useState } from 'react';

const Dropdown = ({ label, items, onSelect, style }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(label);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (item) => {
        setSelectedItem(item);
        setIsOpen(false);
        if (onSelect) onSelect(item); // Trigger callback with selected item
    };

    return (
        <div className="dropdown" style={style}>
            <button onClick={toggleDropdown} className="dropdown-button">
                {selectedItem}
            </button>
            {isOpen && (
                <div className="dropdown-menus">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="dropdown-item text-start"
                            onClick={() => handleSelect(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;