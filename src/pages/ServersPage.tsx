import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Server, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserGuilds } from '../services/guildService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Guild } from '../types';

const ServersPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [filteredGuilds, setFilteredGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        // In a real app, you'd get the token from your auth context
        const token = 'mock_token';
        const userGuilds = await getUserGuilds(token);
        
        // Filter guilds where user has admin permissions and the bot is present
        const managableGuilds = userGuilds.filter(guild => guild.hasBot && guild.canManage);
        
        setGuilds(managableGuilds);
        setFilteredGuilds(managableGuilds);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching guilds:', err);
        setError('Failed to load servers. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGuilds();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredGuilds(guilds);
    } else {
      const filtered = guilds.filter(guild => 
        guild.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGuilds(filtered);
    }
  }, [searchQuery, guilds]);
  
  const handleServerClick = (guildId: string) => {
    navigate(`/servers/${guildId}/logs`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
          <p className="mt-4 text-text-primary">Loading servers...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md w-full">
          <div className="text-center">
            <div className="text-error text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold mb-2">Error Loading Servers</h2>
            <p className="text-text-secondary mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Your Servers</h1>
          <p className="text-text-secondary">Select a server to manage</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search servers..."
            className="input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
        </div>
      </div>
      
      {filteredGuilds.length === 0 ? (
        <Card className="text-center p-8">
          <Server size={48} className="mx-auto text-text-secondary mb-4" />
          <h2 className="text-xl font-bold mb-2">No Servers Found</h2>
          <p className="text-text-secondary mb-4">
            {searchQuery ? 'No servers match your search query.' : 'You don\'t have any servers with SlayerBot installed.'}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuilds.map(guild => (
            <Card 
              key={guild.id} 
              className="flex flex-col"
              hoverable
              onClick={() => handleServerClick(guild.id)}
            >
              <div className="flex items-center mb-4">
                {guild.icon ? (
                  <img 
                    src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`} 
                    alt={guild.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mr-4">
                    <span className="text-white font-medium">{guild.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-lg">{guild.name}</h3>
                  <p className="text-sm text-text-secondary">ID: {guild.id}</p>
                </div>
              </div>
              <div className="mt-auto">
                <Button fullWidth>Manage</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServersPage;