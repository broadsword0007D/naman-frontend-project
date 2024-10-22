import { useState, useEffect } from 'react';
import TicketCard from './TicketCard';
import Header from './Header';
import './KanbanBoard.css';

// Importing SVG icons for statuses
import BacklogIcon from './svg/Backlog.svg';
import TodoIcon from './svg/Todo.svg';
import InProgressIcon from './svg/InProgress.svg';
import DoneIcon from './svg/Done.svg';
import CanceledIcon from './svg/Canceled.svg';

// Importing SVG icons for user section
import AddIcon from './svg/Add.svg';
import MenuIcon from './svg/3 dot menu.svg';

// Importing SVG icons for priority section
import UrgentIcon from './svg/SVG - Urgent Priority colour.svg';
import NoPriorityIcon from './svg/No-priority.svg';
import HighPriorityIcon from './svg/Img - High Priority.svg';
import MediumPriorityIcon from './svg/Img - Medium Priority.svg';
import LowPriorityIcon from './svg/Img - Low Priority.svg';

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('priority');
  const [error, setError] = useState(null);

  // Fetch tickets and users from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        if (!response.ok) {
          throw new Error(`Network response was not ok, status: ${response.status}`);
        }

        const data = await response.json();

        if (data?.tickets && data?.users) {
          setTickets(data.tickets);
          setUsers(data.users);
        } else {
          throw new Error('Unexpected response structure: Missing tickets or users');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, []);

  // Function to group tickets by status
  const groupTicketsByStatus = () => {
    const groupedTickets = {
      Backlog: [],
      Todo: [],
      'In Progress': [],
      Done: [],
      Canceled: [],
    };

    tickets.forEach((ticket) => {
      const normalizedStatus = ticket.status.toLowerCase();
      switch (normalizedStatus) {
        case 'backlog':
          groupedTickets.Backlog.push(ticket);
          break;
        case 'todo':
          groupedTickets.Todo.push(ticket);
          break;
        case 'in progress':
          groupedTickets['In Progress'].push(ticket);
          break;
        case 'done':
          groupedTickets.Done.push(ticket);
          break;
        case 'canceled':
          groupedTickets.Canceled.push(ticket);
          break;
        default:
          console.error(`Unexpected status: ${ticket.status}`);
          break;
      }
    });

    return groupedTickets;
  };

  // Function to group tickets by user
  const groupTicketsByUser = () => {
    const groupedTickets = {};

    users.forEach((user) => {
      groupedTickets[user.id] = {
        user: user,
        tickets: [],
      };
    });

    tickets.forEach((ticket) => {
      if (groupedTickets[ticket.userId]) {
        groupedTickets[ticket.userId].tickets.push(ticket);
      } else {
        console.error(`User ID ${ticket.userId} not found`);
      }
    });

    return groupedTickets;
  };

  // Function to group tickets by priority
  const groupTicketsByPriority = () => {
    const groupedTickets = {
      Urgent: [],
      High: [],
      Medium: [],
      Low: [],
      'No Priority': [],
    };

    tickets.forEach((ticket) => {
      switch (ticket.priority) {
        case 4:
          groupedTickets.Urgent.push(ticket);
          break;
        case 3:
          groupedTickets.High.push(ticket);
          break;
        case 2:
          groupedTickets.Medium.push(ticket);
          break;
        case 1:
          groupedTickets.Low.push(ticket);
          break;
        case 0:
          groupedTickets['No Priority'].push(ticket);
          break;
        default:
          console.error(`Unexpected priority: ${ticket.priority}`);
          break;
      }
    });

    return groupedTickets;
  };

  // Sorting function for tickets
  const sortTickets = (tickets) => {
    if (!Array.isArray(tickets)) {
      console.error('Tickets is not an array:', tickets);
      return []; // Ensure tickets is always an array
    }
    return [...tickets].sort((a, b) => {
      if (sortBy === 'priority') {
        return (b.priority || 0) - (a.priority || 0); // Sort by priority descending, handle undefined values
      } else if (sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || ''); // Sort by title ascending, handle undefined values
      }
      return 0;
    });
  };

  // Select grouped tickets based on grouping option
  const groupedTickets =
    groupBy === 'status'
      ? groupTicketsByStatus()
      : groupBy === 'user'
      ? groupTicketsByUser()
      : groupTicketsByPriority();

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div>
      {/* Render the header */}
      <Header groupBy={groupBy} setGroupBy={setGroupBy} sortBy={sortBy} setSortBy={setSortBy} />

      {/* Status Headers Section */}
      {groupBy === 'status' && (
        <div className="status-headers">
          {Object.keys(groupedTickets).map((status) => (
            <div key={status} className="status-header">
              <img src={getStatusIcon(status)} alt={`${status} icon`} className="status-icon" />
              <span>{status} {groupedTickets[status]?.length || 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* User Headers Section without containers */}
      {groupBy === 'user' && (
        <div className="user-headers">
          {Object.values(groupedTickets).map(({ user, tickets }) => (
            <div key={user.id} className="user-header">
              <img
                className="user-avatar"
                src={`https://i.pravatar.cc/150?u=${user.id}`}
                alt={user.name}
              />
              <span className="user-name">{user.name}</span>
              <span className="ticket-count">{tickets?.length || 0}</span>
              <img src={AddIcon} alt="Add" className="add-icon" />
              <img src={MenuIcon} alt="Menu" className="menu-icon" />
            </div>
          ))}
        </div>
      )}

      {/* Priority Headers Section */}
      {groupBy === 'priority' && (
        <div className="priority-headers">
          {Object.keys(groupedTickets).map((priority) => (
            <div key={priority} className="priority-header">
              <img
                src={getPriorityIcon(priority)}
                alt={`${priority} icon`}
                className="priority-icon"
              />
              <span>{priority} {groupedTickets[priority]?.length || 0}</span>
            </div>
          ))}
        </div>
      )}

      {/* Kanban Board Cards Section */}
      <div className="kanban-board">
        {Object.entries(groupedTickets).map(([group, data]) => {
          const tickets = groupBy === 'user' ? data.tickets : data;
          const sortedTickets = sortTickets(tickets); // Sort tickets within each group

          if (!Array.isArray(sortedTickets)) {
            console.error('Tickets are not an array:', sortedTickets);
            return null;
          }

          return (
            <div key={group} className="kanban-column">
              {sortedTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get the appropriate icon for status
const getStatusIcon = (status) => {
  switch (status) {
    case 'Backlog':
      return BacklogIcon;
    case 'Todo':
      return TodoIcon;
    case 'In Progress':
      return InProgressIcon;
    case 'Done':
      return DoneIcon;
    case 'Canceled':
      return CanceledIcon;
    default:
      return null;
  }
};

// Helper function to get the appropriate icon for priority
const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'Urgent':
      return UrgentIcon;
    case 'High':
      return HighPriorityIcon;
    case 'Medium':
      return MediumPriorityIcon;
    case 'Low':
      return LowPriorityIcon;
    case 'No Priority':
      return NoPriorityIcon;
    default:
      return null;
  }
};

export default KanbanBoard;
