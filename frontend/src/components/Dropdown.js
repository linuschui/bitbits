import React, { useState } from 'react';
import './Dropdown.css';

function DropdownMenu(props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleDropdown} className="dropdown-button">
        Menu
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={() => props.handleSelected('All')}>All</li>
          {props.data.map((item, index) => (
            <li key={index} onClick={() => props.handleSelected(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
