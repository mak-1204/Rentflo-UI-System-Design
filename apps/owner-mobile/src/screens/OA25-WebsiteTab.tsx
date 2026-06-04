import { Copy, ExternalLink, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react'; import { Link } from 'react-router'; import { Badge } from '@stayflo/ui';
import { Button } from '@stayflo/ui';
import { Card } from '@stayflo/ui';
import { Progress } from '@stayflo/ui';
import { Switch } from '@stayflo/ui';

export function OwnerWebsiteTab() {
  const sections = [
    { name: 'Cover Photo & Name', icon: '📸', status: 'complete' },
    { name: 'Room Types & Pricing', icon: '🏠', status: 'complete' },
    { name: 'Photo Gallery', icon: '🖼️', status: 'partial', detail: '14/20 photos' },
    { name: 'Amenities', icon: '✨', status: 'complete' },
    { name: 'Floor Plan', icon: '📐', status: 'incomplete' },
    { name: 'Food Menu', icon: '🍽️', status: 'synced' },
    { name: 'Location', icon: '📍', status: 'complete' },
    { name: 'House Rules', icon: '📋', status: 'incomplete' },
  ];
  
  const getStatusIndicator = (status: string, detail?: string) => {
    if (status === 'complete') {
      return <CheckCircle className="w-5 h-5" style={{ color: '#1D9E75' }} />;
    } else if (status === 'synced') {
      return <Badge style={{ background: '#E6F1FB', color: '#0C447C', fontSize: '11px' }}>Synced</Badge>;
    } else if (status === 'partial') {
      return <span className="text-xs" style={{ color: '#EF9F27' }}>{detail}</span>;
    } else {
      return <Badge style={{ background: '#FAEEDA', color: '#633806', fontSize: '11px' }}>Add now</Badge>;
    }
  };
  
  return (
    <div className="px-4 pt-12 pb-4" style={{ background: '#F8F9FA' }}>
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-2" style={{ color: '#111827' }}>
        Your Stayflo Page
      </h1>
      <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
        Share your PG portfolio with potential tenants
      </p>
      
      {/* New Leads Banner */}
      <Link to="/owner-mobile/app/leads">
        <Card 
          className="p-4 mb-4"
          style={{ background: '#FAEEDA', border: '1px solid #EF9F27' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold" style={{ color: '#854F0B' }}>12 New Leads</p>
              <p className="text-xs mt-0.5" style={{ color: '#633806' }}>From your Stayflo website</p>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#EF9F27' }} />
          </div>
        </Card>
      </Link>
      
      {/* URL Card */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: '#111827' }}>Live URL</p>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-xs" style={{ color: '#1D9E75' }}>Published</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: '#F8F9FA' }}>
          <p className="flex-1 text-sm truncate" style={{ color: '#1D9E75' }}>
            stayflo.in/pg/sunrise-pg
          </p>
          <button>
            <Copy className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-3"
          onClick={() => window.open('/portfolio/sunrise-pg', '_blank')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Preview Website
        </Button>
        
        <p className="text-xs text-center mt-2" style={{ color: '#9CA3AF' }}>
          Last updated: 2 hours ago
        </p>
      </Card>
      
      {/* Completion Progress */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium" style={{ color: '#111827' }}>Profile Completion</p>
          <span className="text-sm font-semibold" style={{ color: '#1D9E75' }}>70%</span>
        </div>
        <Progress value={70} className="h-2" />
        <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
          Complete all sections to increase visibility
        </p>
      </Card>
      
      {/* Sections List */}
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: '#111827' }}>
          Website Sections
        </p>
        
        <div className="space-y-2">
          {sections.map((section, i) => (
            <Card key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#111827' }}>
                      {section.name}
                    </p>
                    {section.status === 'synced' && (
                      <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                        Auto-synced from food menu
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIndicator(section.status, section.detail)}
                  <ChevronRight className="w-5 h-5" style={{ color: '#9CA3AF' }} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
