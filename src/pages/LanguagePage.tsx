import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save, RotateCcw, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getGuildLanguage, updateGuildLanguage } from '../services/guildService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { GuildLanguage } from '../types';

interface LanguageOption {
  code: GuildLanguage['language'];
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }
];

const LanguagePage: React.FC = () => {
  const { guildId } = useParams<{ guildId: string }>();
  const [guildLanguage, setGuildLanguage] = useState<GuildLanguage | null>(null);
  const [originalLanguage, setOriginalLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLanguage = async () => {
      if (!guildId) return;
      
      try {
        // In a real app, you'd get the token from your auth context
        const token = 'mock_token';
        const languageData = await getGuildLanguage(guildId, token);
        
        setGuildLanguage(languageData);
        setOriginalLanguage(languageData.language);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching language:', err);
        setError('Failed to load language configuration. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchLanguage();
  }, [guildId]);
  
  const handleLanguageChange = (language: GuildLanguage['language']) => {
    if (!guildLanguage) return;
    
    setGuildLanguage({
      ...guildLanguage,
      language
    });
  };
  
  const handleSaveChanges = async () => {
    if (!guildLanguage || !guildId) return;
    
    setSaving(true);
    try {
      // In a real app, you'd get the token from your auth context
      const token = 'mock_token';
      
      const updatedLanguage = await updateGuildLanguage(guildLanguage, token);
      
      setGuildLanguage(updatedLanguage);
      setOriginalLanguage(updatedLanguage.language);
      
      toast.success('Language setting saved successfully!');
    } catch (err) {
      console.error('Error saving language:', err);
      toast.error('Failed to save language setting. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleResetLanguage = () => {
    if (!guildLanguage || !originalLanguage) return;
    
    setGuildLanguage({
      ...guildLanguage,
      language: originalLanguage as GuildLanguage['language']
    });
  };
  
  const hasChanges = guildLanguage?.language !== originalLanguage;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-lighter mx-auto"></div>
          <p className="mt-4 text-text-primary">Loading language configuration...</p>
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
  
  if (!guildLanguage) {
    return null;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Language Settings</h1>
          <p className="text-text-secondary">Choose the language for bot responses in this server</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="secondary" 
            leftIcon={<RotateCcw size={18} />}
            onClick={handleResetLanguage}
            disabled={!hasChanges || saving}
          >
            Reset
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
      
      <Card>
        <div className="flex items-center mb-6">
          <Globe size={24} className="text-primary-lighter mr-3" />
          <h2 className="text-xl font-bold">Select Language</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {languages.map(language => (
            <div
              key={language.code}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                guildLanguage.language === language.code
                  ? 'border-primary-lighter bg-primary-light/30'
                  : 'border-primary-light/20 hover:border-primary-light/50 hover:bg-primary-light/10'
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-3xl mb-2">{language.flag}</span>
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-sm text-text-secondary">{language.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-primary-light/10 rounded-lg border border-primary-light/20">
          <h3 className="font-bold mb-2">About Language Settings</h3>
          <p className="text-text-secondary">
            This setting controls the language that SlayerBot will use when responding to commands and sending messages in this server.
            All users in the server will see bot responses in the selected language.
          </p>
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
              onClick={handleResetLanguage}
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

export default LanguagePage;