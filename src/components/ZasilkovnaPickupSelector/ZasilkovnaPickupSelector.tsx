import { useEffect, useState, useRef } from 'react';
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

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (apiKey: string, callback: (point: any) => void, options: any, element?: HTMLElement | null) => void;
        close: () => void;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  // Render widget into container when modal opens
  useEffect(() => {
    if (!isModalOpen) return;

    // Wait for DOM to render the container
    const timer = setTimeout(() => {
      if (!window.Packeta) {
        setError('Widget failed to load. Please refresh the page.');
        return;
      }

      if (!widgetContainerRef.current) return;

      const widgetOptions: any = {
        country,
        language,
        vendors: [],
      };

      if (deliveryMethod === 'ZBOX') {
        widgetOptions.vendors.push({ country, group: 'zbox' });
      } else {
        widgetOptions.vendors.push({ country });
      }

      try {
        window.Packeta!.Widget.pick(
          apiKey,
          (point: any) => {
            if (point) {
              const pickupPoint: PickupPoint = {
                id: point.id,
                name: point.name,
                address: `${point.street} ${point.houseNumber ?? ''}`.trim(),
                city: point.city,
                postalCode: point.zip,
              };
              setSelectedPoint(pickupPoint);
              onSelect(pickupPoint);
            }
            closeModal();
          },
          widgetOptions,
          widgetContainerRef.current
        );
      } catch (err) {
        console.error('Widget error:', err);
        setError('Failed to open widget. Please try again.');
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isModalOpen]);

  const openModal = () => {
    if (!apiKey) {
      setError('API key is not configured.');
      return;
    }
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (window.Packeta) {
      try { window.Packeta.Widget.close(); } catch {}
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="zasilkovna-selector">
        <h3 className="selector-title">Zásilkovna Pick-up Point</h3>

        {error && <p className="widget-error">{error}</p>}

        {selectedPoint ? (
          <div className="selected-point">
            <div className="point-info">
              <p className="point-name">{selectedPoint.name}</p>
              <p className="point-address">{selectedPoint.address}</p>
              <p className="point-city">{selectedPoint.city}, {selectedPoint.postalCode}</p>
            </div>
            <button type="button" onClick={openModal} className="change-btn">
              Change Pick-up Point
            </button>
          </div>
        ) : (
          <button type="button" onClick={openModal} className="select-btn">
            Select Pick-up Point
          </button>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="widget-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="widget-modal">
            <div className="widget-modal-header">
              <h2>Select Pick-up Point</h2>
              <button type="button" className="widget-modal-close" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="widget-modal-body">
              <div ref={widgetContainerRef} className="widget-container" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
