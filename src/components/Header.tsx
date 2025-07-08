import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboardIcon, Video, Info, Construction, Zap, Battery, BatteryMedium, BatteryFull } from 'lucide-react';

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const batteryPercentage: number = 85;

  const linkStyle = (path: string) =>
    `px-4 py-2 rounded-md font-medium transition-colors ${
      pathname === path
        ? 'bg-gray-100'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-300 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white shadow-sm py-2 px-6 flex items-center justify-between rounded-b-lg">
      <div className="text-2xl font-bold text-gray-900 flex items-center justify-center flex-row">
        <img src="/uranus.svg" alt="" height="50" width="50" className="mr-1" />
        U R A N U S
      </div>
      <span>
        <div className="flex items-center justify-end px-2">
          <span className="text-sm ml-1 mr-1">{batteryPercentage}%</span>
          {batteryPercentage >= 80 ? (
            <BatteryFull size={16} />
          ) : batteryPercentage >= 40 ? (
            <BatteryMedium size={16} />
          ) : (
            <Battery size={16} />
          )}
        </div>
        <nav className="flex gap-2">
          <Button
            variant="ghost"
            className={linkStyle('/dashboard')}
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboardIcon />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className={linkStyle('/camera-feed')}
            onClick={() => navigate('/camera-feed')}
          >
            <Video />
            Camera Feed
          </Button>
          <Button
            variant="ghost"
            className={linkStyle('/solar-panel')}
            onClick={() => navigate('/solar-panel')}
          >
            <Zap />
            Solar Panel
          </Button>
          <Button
            variant="ghost"
            className={linkStyle('/maintenance')}
            onClick={() => navigate('/maintenance')}
          >
            <Construction />
            Maintenance
          </Button>
          <Button
            variant="ghost"
            className={linkStyle('/about')}
            onClick={() => navigate('/about')}
          >
            <Info />
            About
          </Button>
        </nav>
      </span>
    </header>
  );
};

export default Header;
