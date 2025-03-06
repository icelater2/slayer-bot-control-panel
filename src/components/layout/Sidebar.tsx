import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Server, Settings, LogOut, Bot, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const guildId = location.pathname.split('/')[2]; // Extract guild ID from URL if present

  return (
    <div className="h-screen w-64 bg-primary/90 border-r border-primary-light/20 flex flex-col">
      <div className="p-4 border-b border-primary-light/20">
        <div className="flex items-center space-x-3">
          <Bot size={28} className="text-primary-lighter" />
          <h1 className="text-xl font-heading font-bold text-white">SlayerBot</h1>
        </div>
        <div className="mt-4 flex items-center space-x-3">
          {user?.avatar ? (
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} 
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-white font-medium">{user?.username?.charAt(0)}</span>
            </div>
          )}
          <div>
            <p className="text-white font-medium">{user?.username}</p>
            <p className="text-xs text-text-secondary">#{user?.discriminator}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-primary-light text-white' : 'text-text-secondary hover:bg-primary-light/30 hover:text-white'
            }`
          }
        >
          <Home size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink 
          to="/servers" 
          className={({ isActive }) => 
            `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
              isActive ? 'bg-primary-light text-white' : 'text-text-secondary hover:bg-primary-light/30 hover:text-white'
            }`
          }
        >
          <Server size={18} />
          <span>Servers</span>
        </NavLink>

        {guildId && (
          <>
            <div className="pt-2 pb-1">
              <div className="px-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Server Settings
              </div>
            </div>

            <NavLink 
              to={`/servers/${guildId}/logs`} 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-primary-light text-white' : 'text-text-secondary hover:bg-primary-light/30 hover:text-white'
                }`
              }
            >
              <Activity size={18} />
              <span>Log Channels</span>
            </NavLink>

            <NavLink 
              to={`/servers/${guildId}/language`} 
              className={({ isActive }) => 
                `flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                  isActive ? 'bg-primary-light text-white' : 'text-text-secondary hover:bg-primary-light/30 hover:text-white'
                }`
              }
            >
              <Settings size={18} />
              <span>Language</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-primary-light/20">
        <Button 
          variant="secondary" 
          fullWidth 
          leftIcon={<LogOut size={18} />}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;