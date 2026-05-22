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
  deliveryMethod?: 'PICKUP' | 'ZBOX' | 'CARRIER_PICKUP';
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
  deliveryMethod = 'PICKUP',
  onSelect 
}: Props) {
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  
  useEffect(() => {
    // Only check widget readiness after user has interacted
    if (!userInteracted) {
      console.log('ℹ️ Waiting for user interaction before checking widget...');
      return;
    }
    
    // Check if widget is loaded
    const checkWidget = () => {
      if (typeof window !== 'undefined' && window.Packeta) {
        console.log('✅ Zasilkovna widget loaded successfully');
        setWidgetReady(true);
        setError(null);
      } else {
        console.warn('⚠️ Zasilkovna widget not loaded yet');
      }
    };
    
    // Check immediately
    checkWidget();
    
    // Also check after delays
    const timer1 = setTimeout(checkWidget, 500);
    const timer2 = setTimeout(checkWidget, 1000);
    const timer3 = setTimeout(() => {
      if (!window.Packeta) {
        console.error('❌ Zasilkovna widget failed to load');
        setError('Failed to load widget. Please refresh the page.');
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [userInteracted]);
  
  // Open widget when it becomes ready and user has requested it
  useEffect(() => {
    if (widgetReady && pendingOpen) {
      setPendingOpen(false);
      actuallyOpenWidget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetReady, pendingOpen]);
  
  const actuallyOpenWidget = () => {
    if (!window.Packeta) {
      console.error('❌ Widget not available');
      return;
    }
    
    // Determine widget options based on delivery method
    const widgetOptions: any = {
      country: country,
      language: language,
      vendors: []
    };
    
    // Configure vendors based on delivery method
    if (deliveryMethod === 'ZBOX') {
      // Z-BOX: automated lockers
      console.log('� Opening widget for Z-BOX (automated lockers)');
      widgetOptions.vendors.push({
        country: country,
        group: 'zbox'
      });
    } else if (deliveryMethod === 'PICKUP') {
      // Regular pick-up points (zpoint)
      console.log('📦 Opening widget for Pick-up Points');
      widgetOptions.vendors.push({
        country: country
        // group is empty or omitted for regular pick-up points (zpoint)
      });
    } else if (deliveryMethod === 'CARRIER_PICKUP') {
      // External carrier pick-up points
      console.log('🚚 Opening widget for Carrier Pick-up Points');
      widgetOptions.vendors.push({
        country: country
        // For carrier pickup, we show regular points
        // In production, you might want to specify specific carrier IDs
      });
    }
    
    try {
      console.log('📍 Calling Widget.pick() with options:', widgetOptions);
      window.Packeta.Widget.pick(
        apiKey,
        (point: any) => {
          if (point) {
            console.log('✅ Pickup point selected:', point);
            const pickupPoint: PickupPoint = {
              id: point.id,
              name: point.name,
              address: `${point.street} ${point.houseNumber}`,
              city: point.city,
              postalCode: point.zip
            };
            
            setSelectedPoint(pickupPoint);
            onSelect(pickupPoint);
          } else {
            console.log('ℹ️ Pickup point selection cancelled');
          }
        },
        widgetOptions
      );
    } catch (error) {
      console.error('❌ Error opening Zasilkovna widget:', error);
      alert('Failed to open pickup point selector. Please try again.');
    }
  };
  
  const openWidget = () => {
    console.log('🔍 User clicked to open Zasilkovna widget...');
    
    // Mark that user has interacted (triggers widget loading check)
    if (!userInteracted) {
      setUserInteracted(true);
    }
    
    if (!apiKey || apiKey === 'your_zasilkovna_api_key_here' || apiKey === 'c36a2b238a1e11e793e0cc47a283a4c') {
      const msg = 'Zasilkovna API key is not configured. Please add your real API key to .env.local';
      console.error('❌', msg);
      alert(msg);
      return;
    }
    
    // If widget not ready yet, mark as pending
    if (!widgetReady) {
      console.log('⏳ Widget not ready yet, will open when ready...');
      setPendingOpen(true);
      setError(null);
      return;
    }
    
    // Widget is ready, open it now
    actuallyOpenWidget();
  };
  
  return (
    <div className="zasilkovna-selector">
      <h3 className="selector-title">Zasilkovna Pick-up Point</h3>
      
      {error && (
        <p className="widget-error">{error}</p>
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
          disabled={userInteracted && !widgetReady}
        >
          {userInteracted && !widgetReady ? 'Loading...' : 'Select Pick-up Point'}
        </button>
      )}
    </div>
  );
}
