import  { useState } from 'react';
import './Header.css';

const Header = ({ groupBy, setGroupBy, sortBy, setSortBy }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="header">
      <div className="header-left">
        <button className="display-button" onClick={toggleDropdown}>
          Display
        </button>
        {showDropdown && (
          <div className="dropdown-menu">
            <div className="dropdown-item">
              <label>Grouping</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                <option value="status">Status</option>
                <option value="user">User</option>
                <option value="priority">Priority</option> {/* Added Priority as a grouping option */}
              </select>
            </div>
            <div className="dropdown-item">
              <label>Ordering</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
