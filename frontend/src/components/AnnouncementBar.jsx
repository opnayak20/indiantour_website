import React, { useState, useEffect } from 'react';
import { useCmsData } from '../data/cmsData';

const STAGGER_MS = 22;
const ENTER_DURATION = 2300;
const HOLD_DURATION = 3500;
const SHINE_DURATION = 3200;
const CYCLE_TOTAL = ENTER_DURATION + HOLD_DURATION + SHINE_DURATION; // 9000ms

export default function AnnouncementBar({ onOpenEmiModal }) {
  const [promoIndex, setPromoIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const [animCycle, setAnimCycle] = useState(0);
  const headerCms = useCmsData('header');
  const annConfig = headerCms?.announcement;

  if (annConfig && annConfig.enabled === false) {
    return null;
  }

  const PROMO_MESSAGES = [
    {
      desktop: [
        { text: annConfig?.text || 'Get up to 6 months of ' },
        { text: annConfig?.highlight1 || 'No Cost EMI', bold: true },
        { text: ` on your trips  •  ${annConfig?.highlight1 || '0% Interest'}  •  ${annConfig?.highlight2 || 'No Cards Required'}  •  ` },
        { type: 'button', label: annConfig?.actionText || 'Learn More', action: annConfig?.actionType || 'emi' }
      ],
      mobile: [
        { text: annConfig?.text ? annConfig.text.slice(0, 25) + '... ' : 'Get up to 6 months of ' },
        { text: annConfig?.highlight1 || 'No Cost EMI', bold: true },
        { text: '  •  ' },
        { type: 'button', label: annConfig?.actionText || 'Learn More', action: annConfig?.actionType || 'emi' }
      ]
    },
    {
      desktop: [
        { text: 'Sale of the Season', bold: true },
        { text: ' is live - extra value on every group trip  •  ' },
        { type: 'button', label: 'Explore Now', action: 'sale' }
      ],
      mobile: [
        { text: 'Sale of the Season', bold: true },
        { text: ' is live  •  ' },
        { type: 'button', label: 'Explore Now', action: 'sale' }
      ]
    },
    {
      desktop: [
        { text: 'Special Offer: Flat 15% OFF', bold: true },
        { text: ' on your first trip booking with code ' },
        { text: 'FIRSTTRIP', bold: true },
        { text: '  •  ' },
        { type: 'button', label: 'Claim Offer', action: 'sale' }
      ],
      mobile: [
        { text: 'Flat 15% OFF', bold: true },
        { text: ' code ' },
        { text: 'FIRSTTRIP  •  ', bold: true },
        { type: 'button', label: 'Claim Offer', action: 'sale' }
      ]
    }
  ];

  useEffect(() => {
    setIsLeaving(false);

    // Stagger out when enter + hold time is reached (triggers right as shine begins)
    const exitTimer = setTimeout(() => {
      setIsLeaving(true);
    }, ENTER_DURATION + HOLD_DURATION);

    // After full 9s cycle, advance to next promo message & remount shine sweep
    const cycleTimer = setTimeout(() => {
      setIsLeaving(false);
      setPromoIndex((prev) => (prev + 1) % PROMO_MESSAGES.length);
      setAnimCycle((prev) => prev + 1);
    }, CYCLE_TOTAL);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(cycleTimer);
    };
  }, [promoIndex]);

  const handleAction = (action) => {
    if (action === 'emi') {
      if (onOpenEmiModal) onOpenEmiModal();
    } else if (action === 'sale') {
      const el = document.getElementById('trending-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else if (onOpenEmiModal) {
        onOpenEmiModal();
      }
    }
  };

  const renderUnits = (items) => {
    const units = [];
    let charIdx = 0;

    items.forEach((item, itemIndex) => {
      if (item.type === 'button') {
        const delay = Math.min(charIdx * STAGGER_MS, ENTER_DURATION - 500);
        units.push(
          <span
            key={`btn-${itemIndex}`}
            className={`ofb-unit ${isLeaving ? 'ofb-out' : 'ofb-in'}`}
            style={{
              animationDelay: `${delay}ms`,
              display: 'inline-block'
            }}
          >
            <button
              type="button"
              onClick={() => handleAction(item.action)}
              className="underline underline-offset-2 font-bold cursor-pointer hover:text-gray-100 transition-colors"
            >
              {item.label}
            </button>
          </span>
        );
        charIdx += 1;
      } else if (item.text) {
        Array.from(item.text).forEach((char, cIdx) => {
          const delay = Math.min(charIdx * STAGGER_MS, ENTER_DURATION - 500);
          units.push(
            <span
              key={`t-${itemIndex}-${cIdx}`}
              className={`ofb-unit ${isLeaving ? 'ofb-out' : 'ofb-in'} ${
                item.bold ? 'font-bold productSansBold' : ''
              }`}
              style={{
                animationDelay: `${delay}ms`,
                whiteSpace: 'pre',
                display: 'inline-block'
              }}
            >
              {char}
            </span>
          );
          charIdx += 1;
        });
      }
    });

    return units;
  };

  const currentPromo = PROMO_MESSAGES[promoIndex];

  return (
    <div style={{ backgroundColor: '#e52b2b' }} className="relative w-full overflow-hidden text-white select-none z-30 py-2 px-3 text-center min-h-[38px] flex items-center justify-center">
      
      {/* Moving Shine Effect: Keyed remount restarts sweep locked to promo cycle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="max-w-7xl mx-auto relative h-full w-full">
          <span key={animCycle} className="offer-bar-shine z-10">
            <svg
              width="26"
              height="100%"
              viewBox="0 0 24 38"
              fill="none"
              preserveAspectRatio="none"
              className="block h-full"
            >
              <path
                d="M24 0H14.5L5 38H14.5L24 0Z"
                fill="white"
                fillOpacity="0.65"
              />
              <path
                d="M12 0H9.95238L0 38H2.04762L12 0Z"
                fill="white"
                fillOpacity="0.65"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Dynamic Animated Announcement Text */}
      <div className="relative z-20 flex items-center justify-center text-xs sm:text-sm font-semibold tracking-wide w-full px-2">
        {/* Desktop Message */}
        <p className="hidden sm:block whitespace-nowrap text-center">
          {renderUnits(currentPromo.desktop)}
        </p>

        {/* Mobile Message */}
        <p className="block sm:hidden text-center text-xs leading-tight py-0.5 truncate max-w-[92vw]">
          {renderUnits(currentPromo.mobile)}
        </p>
      </div>

    </div>
  );
}
