'use client';

import React, { useState, useEffect, useRef } from 'react';

const colorOptions = [
  { name: 'White', color: '#F5F5F0' },
  { name: 'Beige', color: '#E8DCC8' },
  { name: 'Tan', color: '#C9A67A' },
  { name: 'Brown', color: '#8B6F47' },
  { name: 'Black', color: '#2C2C2C' },
];

const RoofComponent = () => {
  const [selectedColor, setSelectedColor] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [api, setApi] = useState<any>(null);
  const [isModelReady, setIsModelReady] = useState(false);

  // Initialize Sketchfab API
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // @ts-ignore
      const client = new window.Sketchfab(iframe);

      client.init('6b2ea63f0ab04abd9cc299197cb6a158', {
        success: (apiInstance: any) => {
          setApi(apiInstance);
          apiInstance.start();

          apiInstance.addEventListener('viewerready', () => {
            setIsModelReady(true);
            console.log('Sketchfab model is ready!');
          });
        },
        error: () => {
          console.error('Sketchfab API error');
        },
      });
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Change roof color when selection changes
  useEffect(() => {
    if (!api || !isModelReady) return;

    const hexColor = colorOptions[selectedColor].color;
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    api.getMaterialList((err: any, materials: any[]) => {
      if (err) return console.error('Error getting materials:', err);

      const roofMaterials = materials.filter((m: any) =>
        m.name.toLowerCase().includes('roof')
      );

      roofMaterials.forEach((mat: any) => {
        const updated = JSON.parse(JSON.stringify(mat));

        // Patch all relevant color channels and remove textures
        const channelsToPatch = ['DiffusePBR', 'AlbedoPBR', 'DiffuseColor'];

        channelsToPatch.forEach((channelName) => {
          if (updated.channels?.[channelName]) {
            updated.channels[channelName].color = [r, g, b];
            updated.channels[channelName].enable = true;
            delete updated.channels[channelName].texture;
          }
        });

        api.setMaterial(updated, (err: any) => {
          if (err) {
            console.error(`Error setting ${mat.name}:`, err);
          } else {
            console.log(`✅ ${mat.name} → ${colorOptions[selectedColor].name}`);
          }
        });
      });
    });
  }, [selectedColor, api, isModelReady]);

  return (
    <section className="w-full px-4 pt-[120px] sm:px-6 lg:px-8 2xl:px-[100px]">
      <div className="mx-auto max-w-7xl 2xl:max-w-none">
        <div className="flex flex-col gap-[50px]">

          {/* Heading */}
          <div className="mb-8 flex w-full sm:mb-10 lg:mb-12">
            <h2 className="roof-section-heading text-gray-900">Four sizes.</h2>
            <p className="roof-section-heading !text-[#93928E] mt-1">
              Tons of Possibility.
            </p>
          </div>

          {/* 3D Model */}
          <div className="-mr-4 sm:-mr-6 w-full lg:-mr-8 2xl:-mr-[100px]">
            <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[480px] xl:h-[440px] overflow-hidden rounded-tl-[24px] rounded-bl-[24px]">
              <iframe
                ref={iframeRef}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
                src="https://sketchfab.com/models/6b2ea63f0ab04abd9cc299197cb6a158/embed?autostart=1&ui_controls=1&ui_infos=0&ui_inspector=0&ui_watermark=0&background_color=ffffff"
                allow="autoplay; fullscreen; xr-spatial-tracking"
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            
            </div>
          </div>

        </div>

        {/* Color swatches */}
        <div className="flex w-full items-center justify-center mt-[30px]">
          <div className="flex items-center gap-2 sm:gap-3 mb-8 flex-wrap">
            {colorOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(index)}
                className={`relative rounded-full transition-all duration-300 hover:scale-110 focus:outline-none ${selectedColor === index
                    ? 'p-[3px] bg-[#4DB6AC]'
                    : 'p-[3px] bg-transparent'
                  }`}
                aria-label={`Select ${option.name} color`}
              >
                {/* White gap */}
                <div
                  className={`rounded-full p-[3px] ${selectedColor === index ? 'bg-white' : 'bg-transparent'
                    }`}
                >
                  {/* Gray ring */}
                  <div
                    className={`rounded-full p-[2px] ${selectedColor === index ? 'bg-gray-300' : 'bg-transparent'
                      }`}
                  >
                    {/* Color swatch */}
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: option.color,
                        boxShadow:
                          selectedColor === index
                            ? '0 4px 12px rgba(0,0,0,0.15)'
                            : '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default RoofComponent;