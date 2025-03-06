import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, RotateCcw, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getLogChannels, updateLogChannels, getGuildChannels } from '../services/guildService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import { LogChannels, Channel } from '../types';

const logTypeDescriptions: Record<string, string> = {
  durumRolLog: 'Logs for role status changes',
  ticketLog: 'Logs for ticket creation and management',
  emojiLog: 'Logs for emoji additions and removals',
  mesajLog: 'Logs for message edits and deletions',
  seviyeLog: 'Logs for level up events',
  isimLog: 'Logs for username and nickname changes',
  sesLog: 'Logs for voice channel activity',
  kanalLog: 'Logs for channel creation and modifications',
  davetLog: 'Logs for invite creation and usage',
  girisCikisLog: 'Logs for server joins and leaves',
  banKickLog: 'Logs for ban and kick actions',
  muteLog: 'Logs for mute and timeout actions',
  jailLog: 'Logs for jail/restricted role actions',
  modLog: 'Logs for all moderation actions'
};

const LogChannelsPage: React.FC = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const [logChannels, setLogChannels] = useState<LogChannels | null>(null);
  const [originalLogChannels, setOriginalLogChannels] = useState<LogChannels | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!guildId) return;
      
      try {
        // In a real app, you'd get the token from your auth context
        const token = 'mock_token';
        
        // Fetch channels and log configuration in parallel
        const [channelsData, logChannelsData] = await Promise.all([
          getGuildChannels(guildId, token),
          getLogChannels(guildId, token)
        ]);
        
        setChannels(channelsData);
        setLogChannels(logChannelsData);
        setOriginalLogChannels(JSON.parse(JSON.stringify(logChannelsData))); // Deep copy
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load log channel configuration. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [guildId]);
  
  useEffect(() => {
    if (logChannels && originalLogChannels) {
      // Check if any values have changed
      const keys = Object.keys(logChannels) as Array<keyof LogChannels>;
      const changed = keys.some(key => logChannels[key] !== originalLogChannels[key]);
      setHasChanges(changed);
    }
  }, [logChannels, originalLogChannels]);
  
  const handleChannelChange = (logType: keyof LogChannels, channelId: string) => {
    if (!logChannels) return;
    
    setLogChannels({
      ...logChannels,
      [logType]: channelId === 'null' ? null : channelId
    });
  };
  
  const handleResetChannel = (logType: keyof LogChannels) => {
    if (!logChannels || !originalLogChannels) return;
    
    setLogChannels({
      ...logChannels,
      [logType]: originalLogChannels[logType]
    });
  };
  
  const handleSaveChanges = async () => {
    if (!logChannels || !guildId) return;
    
    setSaving(true);
    try {
      // In a real app, you'd get the token from your auth context
      const token = 'mock_token';
      
      const updatedLogChannels = await updateLogChannels(logChannels, token);
      
      setLogChannels(updatedLogChannels);
      setOriginalLogChannels(JSON.parse(JSON.stringify(updatedLogChannels))); // Deep copy
      setHasChanges(false);
      
      toast.success('Log channel configuration saved successfully!');
    } catch (err) {
      console.error('Error saving log channels:', err);
      toast.error('Failed to save log channel configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleResetAll = () => {
    if (!originalLogChannels) return;
    
    setLogChannels(JSON.parse(JSON.stringify(originalLogChannels))); // Deep copy
    setHasChanges(false);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
          <p className="mt-4 text-text-primary">Loading log channel configuration...</p>
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
            <h2 className="text-xl font-bold mb-2">Error Loading Configuration</h2>
            <p className="text-text-secondary mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (!logChannels) {
    return null;
  }
  
  // Group log types into categories
  const logGroups = {
    moderation: ['banKickLog', 'muteLog', 'jailLog', 'modLog'],
    server: ['durumRolLog', 'emojiLog', 'kanalLog', 'girisCikisLog', 'davetLog'],
    messages: ['mesajLog', 'seviyeLog', 'isimLog', 'sesLog', 'ticketLog']
  };
  
  const channelOptions = [
    { value: 'null', label: 'None (Disabled)' },
    ...channels.map(channel => ({
      value: channel.id,
      label: `#${channel.name}`
    }))
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Log Channel Configuration</h1>
          <p className="text-text-secondary">Configure where different log events are sent</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            leftIcon={<RotateCcw size={18} />}
            onClick={handleResetAll}
            disabled={!hasChanges || saving}
          >
            Reset All
          </Button>
          <Button 
            leftIcon={<Save size={18} />}
            onClick={handleSaveChanges}
            disabled={!hasChanges || saving}
            isLoading={saving}
          >
            Save Changes
          </Button>
        </div>
      </div>
      
      {/* Moderation Logs */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">Moderation Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logGroups.moderation.map(logType => (
            <div key={logType} className="relative">
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-text-secondary">
                  {logType.replace('Log', '').charAt(0).toUpperCase() + logType.replace('Log', '').slice(1)} Log
                </label>
                <div className="group ml-2 relative">
                  <Info size={16} className="text-text-secondary cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-background rounded-md shadow-lg text-xs text-text-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {logTypeDescriptions[logType]}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select
                    options={channelOptions}
                    value={logChannels[logType as keyof LogChannels]}
                    onChange={(value) => handleChannelChange(logType as keyof LogChannels, value)}
                    placeholder="Select a channel"
                    fullWidth
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResetChannel(logType as keyof LogChannels)}
                  disabled={logChannels[logType as keyof LogChannels] === originalLogChannels?.[logType as keyof LogChannels]}
                >
                  Reset
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Server Logs */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">Server Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logGroups.server.map(logType => (
            <div key={logType} className="relative">
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-text-secondary">
                  {logType.replace('Log', '').charAt(0).toUpperCase() + logType.replace('Log', '').slice(1)} Log
                </label>
                <div className="group ml-2 relative">
                  <Info size={16} className="text-text-secondary cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-background rounded-md shadow-lg text-xs text-text-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {logTypeDescriptions[logType]}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select
                    options={channelOptions}
                    value={logChannels[logType as keyof LogChannels]}
                    onChange={(value) => handleChannelChange(logType as keyof LogChannels, value)}
                    placeholder="Select a channel"
                    fullWidth
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResetChannel(logType as keyof LogChannels)}
                  disabled={logChannels[logType as keyof LogChannels] === originalLogChannels?.[logType as keyof LogChannels]}
                >
                  Reset
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Message Logs */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Message & User Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {logGroups.messages.map(logType => (
            <div key={logType} className="relative">
              <div className="flex items-center mb-1">
                <label className="block text-sm font-medium text-text-secondary">
                  {logType.replace('Log', '').charAt(0).toUpperCase() + logType.replace('Log', '').slice(1)} Log
                </label>
                <div className="group ml-2 relative">
                  <Info size={16} className="text-text-secondary cursor-help" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-background rounded-md shadow-lg text-xs text-text-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                    {logTypeDescriptions[logType]}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Select
                    options={channelOptions}
                    value={logChannels[logType as keyof LogChannels]}
                    onChange={(value) => handleChannelChange(logType as keyof LogChannels, value)}
                    placeholder="Select a channel"
                    fullWidth
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResetChannel(logType as keyof LogChannels)}
                  disabled={logChannels[logType as keyof LogChannels] === originalLogChannels?.[logType as keyof LogChannels]}
                >
                  Reset
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Save Changes Floating Bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-primary-light/90 backdrop-blur-sm p-4 flex justify-between items-center shadow-lg border-t border-primary-lighter/30">
          <div className="text-white">
            <p className="font-medium">You have unsaved changes</p>
            <p className="text-sm text-text-secondary">Save your changes or reset to discard them</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="secondary" 
              onClick={handleResetAll}
              disabled={saving}
            >
              Reset
            </Button>
            <Button 
              onClick={handleSaveChanges}
              isLoading={saving}
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogChannelsPage;