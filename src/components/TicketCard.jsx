import React from 'react';
import './TicketCard.css';
import MenuIcon from './svg/3 dot menu.svg'; // Assuming a three-dot menu icon for simplicity

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card">
      <div className="ticket-header">
        <h3 className="ticket-id">{ticket.id}</h3>
        <div className="user-avatar">
          {ticket.userId && (
            <img
              src={`https://i.pravatar.cc/150?u=${ticket.userId}`}
              alt="User Avatar"
            />
          )}
        </div>
      </div>
      <div className="ticket-content">
        <h4 className="ticket-title">{ticket.title}</h4>
      </div>
      <div className="ticket-footer">
        <img src={MenuIcon} alt="Menu Icon" className="menu-icon" />
        <div className="ticket-tag">
          <span>{ticket.tag.join(', ')}</span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
