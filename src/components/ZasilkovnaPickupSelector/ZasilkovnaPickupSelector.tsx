import { useEffect, useState } from 'react';
import './ZasilkovnaPickupSelector.css';

export interface PickupPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Props {
  apiKey: string;
  country: string;
  language?: string;
  onSelect: (point: PickupPoint | null) => void;
}

// Extend Window interface for Packeta
declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (apiKey: string, callback: (point: any) => void, options: any) => void;
        open: () => void;
      };
    };
  }
}

export function ZasilkovnaPickupSelector({ 
  apiKey, 
  country, 
  language = 'en',
  onSelect 
}: Props) {
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  
  useEffect(() => {
    // Check if widget is loaded
    const checkWidget = () => {
      if (typeof window !== 'undefined' && window.Packeta) {
        console.log('Zasilkovna widget loaded successfully');
        setWidgetReady(true);
      } else {
        console.warn('Zasilkovna widget not loaded yet');
      }
    };
    
    // Check immediately
    checkWidget();
    
    // Also check after a delay in case script is still loading
    const timer = setTimeout(checkWidget, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const openWidget = () => {
    console.log('Opening Zasilkovna widget...', { apiKey, country, widgetReady });
    
    if (!apiKey || apiKey === 'your_zasilkovna_api_key_here') {
      alert('Zasilkovna API key is not configured. Please add VITE_ZASILKOVNA_API_KEY to .env.local');
      return;
    }
    
    if (!window.Packeta) {
      alert('Zasilkovna widget is not loaded. Please refresh the page.');
      return;
    }
    
    try {
      window.Packeta.Widget.pick(
        apiKey,
        (point: any) => {
          console.log('Pickup point selected:', point);
          // Callback when user selects a pickup point
          const pickupPoint: PickupPoint = {
            id: point.id,
            name: point.name,
            address: `${point.street} ${point.houseNumber}`,
            city: point.city,
            postalCode: point.zip
          };
          
          setSelectedPoint(pickupPoint);
          onSelect(pickupPoint);
        },
        {
          country: country,
          language: language,
          layout: 'hd'
        }
      );
    } catch (error) {
      console.error('Error opening Zasilkovna widget:', error);
      alert('Failed to open pickup point selector. Please try again.');
    }
  };
  
  return (
    <div className="zasilkovna-selector">
      <h3 className="selector-title">Zasilkovna Pick-up Point</h3>
      
      {!widgetReady && (
        <p className="widget-loading">Loading pickup point selector...</p>
      )}
      
      {selectedPoint ? (
        <div className="selected-point">
          <div className="point-info">
            <p className="point-name">{selectedPoint.name}</p>
            <p className="point-address">{selectedPoint.address}</p>
            <p className="point-city">
              {selectedPoint.city}, {selectedPoint.postalCode}
            </p>
          </div>
          <button 
            type="button"
            onClick={openWidget} 
            className="change-btn"
          >
            Change Pick-up Point
          </button>
        </div>
      ) : (
        <button 
          type="button"
          onClick={openWidget} 
          className="select-btn"
          disabled={!widgetReady}
        >
          {widgetReady ? 'Select Pick-up Point' : 'Loading...'}
        </button>
      )}
    </div>
  );
}
