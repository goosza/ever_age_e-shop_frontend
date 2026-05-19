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
  
  useEffect(() => {
    // Initialize Zasilkovna Widget
    if (typeof window !== 'undefined' && window.Packeta) {
      window.Packeta.Widget.pick(
        apiKey,
        (point: any) => {
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
    }
  }, [apiKey, country, language, onSelect]);
  
  const openWidget = () => {
    if (window.Packeta) {
      window.Packeta.Widget.open();
    }
  };
  
  return (
    <div className="zasilkovna-selector">
      <h3 className="selector-title">Zasilkovna Pick-up Point</h3>
      
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
        >
          Select Pick-up Point
        </button>
      )}
    </div>
  );
}
