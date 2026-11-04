import React from 'react';

interface WhatsAppIconProps {
  className?: string;
}

/**
 * High-definition, pixel-aligned vector WhatsApp icon.
 * Ensures crisp rendering with subpixel antialiasing and no raster blur.
 */
export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ className = 'w-3.5 h-3.5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} fill-current shrink-0`}
      aria-hidden="true"
      shapeRendering="geometricPrecision"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.82 14.15c-.24.68-1.4 1.26-1.95 1.34-.52.07-1.18.1-1.89-.13-.43-.14-.99-.32-1.7-.63-2.98-1.29-4.93-4.32-5.08-4.52-.15-.2-1.21-1.61-1.21-3.07 0-1.46.77-2.18 1.04-2.48.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.42-.07.66.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.3.31-.13.61.17.3.77 1.27 1.65 2.06 1.14 1.01 2.09 1.33 2.39 1.48.3.15.47.12.64-.08.17-.2.74-.87.94-1.16.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.72-.17 1.4z" />
    </svg>
  );
};
