import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { API_BASE } from '../config/api';
import { DEMO_DATA } from '../data/adminDemoData';
import './AdminDashboard.css';

import {
  FaGaugeHigh,
  FaEnvelope,
  FaCalendarCheck,
  FaSuitcaseRolling,
  FaLocationDot,
  FaStar,
  FaUsers,
  FaShieldHalved,
  FaBars,
  FaXmark,
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaArrowsRotate,
  FaArrowUpRightFromSquare,
  FaPhone,
  FaWhatsapp,
  FaPlus,
  FaPen,
  FaTrash,
  FaEye,
  FaRightFromBracket,
  FaLock,
  FaIndianRupeeSign,
  FaCircleCheck,
  FaCircleExclamation,
  FaTriangleExclamation,
  FaArrowRight,
  FaImage,
  FaBullhorn,
  FaCalendarDays,
  FaRoute,
  FaListCheck,
  FaCircleQuestion,
  FaCompass,
  FaArrowUp,
  FaArrowDown,
  FaLayerGroup,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa6';
import AdminPopupManager from './AdminPopupManager';
import TripLeadModal from './TripLeadModal';
import { groupTripsList } from '../data/groupTripsData';
import { allTourPackages } from '../data/tourPackagesData';
import { getTourDetailsData } from './TourDetailsModal';
import { allTrendingPackages, defaultTrendingIds } from '../data/websiteData';

import { DEFAULT_VIDEO_BANNER } from './VideoBannerSection';
import { internationalDestinations } from '../data/websiteData';

// ============================================================
// SECTION MANAGEMENT TAB — Controls Trending packages, Travel Video,
// and International Destinations on the homepage
// ============================================================
function SectionManagementTab() {
  const [activeSubTab, setActiveSubTab] = useState('trending'); // 'trending' | 'video' | 'international'

  // --- TRENDING PACKAGES STATE ---
  const getStoredIds = () => {
    try {
      const raw = localStorage.getItem('trendingVisibleIds');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return defaultTrendingIds;
  };

  const [orderedPackages, setOrderedPackages] = useState(() => {
    const visibleIds = getStoredIds();
    const visible = visibleIds
      .map(id => allTrendingPackages.find(p => p.id === id))
      .filter(Boolean);
    const hidden = allTrendingPackages.filter(p => !visibleIds.includes(p.id));
    return [...visible.map(p => ({ ...p, visible: true })), ...hidden.map(p => ({ ...p, visible: false }))];
  });

  const [savedTrending, setSavedTrending] = useState(false);

  const toggleVisibility = (id) => {
    setOrderedPackages(prev =>
      prev.map(p => p.id === id ? { ...p, visible: !p.visible } : p)
    );
    setSavedTrending(false);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setOrderedPackages(prev => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
    setSavedTrending(false);
  };

  const moveDown = (index) => {
    setOrderedPackages(prev => {
      if (index === prev.length - 1) return prev;
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
    setSavedTrending(false);
  };

  const saveTrendingChanges = () => {
    const visibleIds = orderedPackages.filter(p => p.visible).map(p => p.id);
    const orderIds = orderedPackages.map(p => p.id);
    localStorage.setItem('trendingVisibleIds', JSON.stringify(visibleIds));
    localStorage.setItem('trendingPackagesOrder', JSON.stringify(orderIds));

    window.dispatchEvent(new StorageEvent('storage', {
      key: 'trendingVisibleIds',
      newValue: JSON.stringify(visibleIds),
    }));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'trendingPackagesOrder',
      newValue: JSON.stringify(orderIds),
    }));
    setSavedTrending(true);
    setTimeout(() => setSavedTrending(false), 3000);
  };

  const resetTrendingToDefault = () => {
    localStorage.removeItem('trendingVisibleIds');
    localStorage.removeItem('trendingPackagesOrder');
    const visible = defaultTrendingIds
      .map(id => allTrendingPackages.find(p => p.id === id))
      .filter(Boolean);
    const hidden = allTrendingPackages.filter(p => !defaultTrendingIds.includes(p.id));
    setOrderedPackages([...visible.map(p => ({ ...p, visible: true })), ...hidden.map(p => ({ ...p, visible: false }))]);
    setSavedTrending(false);
  };

  // --- VIDEO BANNER STATE ---
  const [videoConfig, setVideoConfig] = useState(() => {
    try {
      const stored = localStorage.getItem('travel_video_banner_settings');
      if (stored) return { ...DEFAULT_VIDEO_BANNER, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_VIDEO_BANNER;
  });
  const [savedVideo, setSavedVideo] = useState(false);

  const handleVideoFieldChange = (field, val) => {
    setVideoConfig(prev => ({ ...prev, [field]: val }));
    setSavedVideo(false);
  };

  const saveVideoSettings = () => {
    localStorage.setItem('travel_video_banner_settings', JSON.stringify(videoConfig));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'travel_video_banner_settings',
      newValue: JSON.stringify(videoConfig),
    }));
    setSavedVideo(true);
    setTimeout(() => setSavedVideo(false), 3000);
  };

  const resetVideoSettings = () => {
    localStorage.removeItem('travel_video_banner_settings');
    setVideoConfig(DEFAULT_VIDEO_BANNER);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'travel_video_banner_settings',
      newValue: JSON.stringify(DEFAULT_VIDEO_BANNER),
    }));
    setSavedVideo(false);
  };

  // --- INTERNATIONAL DESTINATIONS STATE ---
  const [intlList, setIntlList] = useState(() => {
    try {
      const stored = localStorage.getItem('admin_international_destinations');
      if (stored) return JSON.parse(stored);
    } catch {}
    return internationalDestinations;
  });
  const [savedIntl, setSavedIntl] = useState(false);

  const saveIntlSettings = () => {
    localStorage.setItem('admin_international_destinations', JSON.stringify(intlList));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'admin_international_destinations',
      newValue: JSON.stringify(intlList),
    }));
    setSavedIntl(true);
    setTimeout(() => setSavedIntl(false), 3000);
  };

  const resetIntlSettings = () => {
    localStorage.removeItem('admin_international_destinations');
    setIntlList(internationalDestinations);
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'admin_international_destinations',
      newValue: JSON.stringify(internationalDestinations),
    }));
    setSavedIntl(false);
  };

  const visibleCount = orderedPackages.filter(p => p.visible).length;

  return (
    <div>
      {/* Top Header Card */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#01132d', margin: 0 }}>Section & Media Management</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Manage homepage sections: <strong>Trending Packages</strong>, <strong>Tour & Travel Video Banner</strong>, and <strong>International Destinations</strong>.
            </p>
          </div>

          {/* Sub-Tabs Pills */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('trending')}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeSubTab === 'trending' ? '#01132d' : 'transparent',
                color: activeSubTab === 'trending' ? '#fff' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              Trending Tours ({visibleCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('video')}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeSubTab === 'video' ? '#01132d' : 'transparent',
                color: activeSubTab === 'video' ? '#fff' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              🎬 Video Banner Section
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('international')}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: activeSubTab === 'international' ? '#01132d' : 'transparent',
                color: activeSubTab === 'international' ? '#fff' : '#64748b',
                transition: 'all 0.2s'
              }}
            >
              ✈️ International Destinations ({intlList.length})
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TRENDING TOURS TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'trending' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {visibleCount} of {orderedPackages.length} packages in Trending
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={resetTrendingToDefault}
                style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer' }}
              >
                Reset to Default
              </button>
              <button
                type="button"
                onClick={saveTrendingChanges}
                style={{
                  fontSize: '13px', fontWeight: 700, color: '#fff',
                  background: savedTrending ? '#10b981' : '#01132d',
                  border: 'none', borderRadius: '10px', padding: '9px 20px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px'
                }}
              >
                {savedTrending ? <><FaCircleCheck size={13} /> Saved!</> : 'Save Changes'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {orderedPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  border: pkg.visible ? '1.5px solid #bfdbfe' : '1.5px solid #e2e8f0',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  opacity: pkg.visible ? 1 : 0.65,
                }}
              >
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: pkg.visible ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: pkg.visible ? '#3b82f6' : '#94a3b8', flexShrink: 0 }}>
                  {index + 1}
                </div>
                <img
                  src={pkg.images?.[0] || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=120&q=60'}
                  alt={pkg.title}
                  style={{ width: '56px', height: '42px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#01132d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pkg.title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{pkg.duration} · ₹{pkg.price?.toLocaleString('en-IN')}</div>
                </div>
                {pkg.badge && (
                  <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px', background: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', flexShrink: 0 }}>
                    {pkg.badge}
                  </span>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', width: '26px', height: '22px', cursor: index === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === 0 ? '#cbd5e1' : '#475569' }}
                  >
                    <FaArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === orderedPackages.length - 1}
                    style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', width: '26px', height: '22px', cursor: index === orderedPackages.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: index === orderedPackages.length - 1 ? '#cbd5e1' : '#475569' }}
                  >
                    <FaArrowDown size={10} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => toggleVisibility(pkg.id)}
                  title={pkg.visible ? 'Hide from Trending' : 'Show in Trending'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', flexShrink: 0, color: pkg.visible ? '#3b82f6' : '#cbd5e1', fontSize: '26px', display: 'flex', alignItems: 'center' }}
                >
                  {pkg.visible ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. VIDEO BANNER SECTION TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'video' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Settings Form */}
          <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#01132d', margin: 0 }}>Video Banner Settings</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: videoConfig.enabled ? '#10b981' : '#64748b' }}>
                  {videoConfig.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => handleVideoFieldChange('enabled', !videoConfig.enabled)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: videoConfig.enabled ? '#10b981' : '#cbd5e1', fontSize: '26px', display: 'flex' }}
                >
                  {videoConfig.enabled ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Video URL (Direct MP4 / WebM Link)
                </label>
                <input
                  type="text"
                  value={videoConfig.videoUrl || ''}
                  onChange={(e) => handleVideoFieldChange('videoUrl', e.target.value)}
                  placeholder="https://img.avianexperiences.com/video/..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Poster / Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={videoConfig.posterUrl || ''}
                  onChange={(e) => handleVideoFieldChange('posterUrl', e.target.value)}
                  placeholder="https://img.avianexperiences.com/assets/..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Overlay Badge Text
                </label>
                <input
                  type="text"
                  value={videoConfig.badge || ''}
                  onChange={(e) => handleVideoFieldChange('badge', e.target.value)}
                  placeholder="Creator Expedition / Trending Now"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Main Heading / Title
                </label>
                <input
                  type="text"
                  value={videoConfig.title || ''}
                  onChange={(e) => handleVideoFieldChange('title', e.target.value)}
                  placeholder="Kashmir in Winter with Aditi Raval"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={videoConfig.subtitle || ''}
                  onChange={(e) => handleVideoFieldChange('subtitle', e.target.value)}
                  placeholder="Experience snow-capped peaks, frozen lakes, and raw Himalayan magic..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={videoConfig.buttonText || ''}
                    onChange={(e) => handleVideoFieldChange('buttonText', e.target.value)}
                    placeholder="Watch Experience ↗"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={videoConfig.targetUrl || ''}
                    onChange={(e) => handleVideoFieldChange('targetUrl', e.target.value)}
                    placeholder="/creator/aditiraval/kashmir-in-winter"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={resetVideoSettings}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Reset Default
                </button>
                <button
                  type="button"
                  onClick={saveVideoSettings}
                  style={{
                    flex: 2, padding: '10px', borderRadius: '10px', border: 'none',
                    background: savedVideo ? '#10b981' : '#01132d', color: '#fff',
                    fontWeight: 700, fontSize: '13px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  {savedVideo ? <><FaCircleCheck size={14} /> Saved to Homepage!</> : 'Save Video Banner'}
                </button>
              </div>
            </div>
          </div>

          {/* Live Video Preview Box */}
          <div style={{ background: '#0f172a', borderRadius: '16px', padding: '20px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                Live Video Preview
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Shows exactly as seen on homepage</span>
            </div>

            <div style={{ position: 'relative', width: '100%', height: '240px', borderRadius: '14px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}>
              <video
                src={videoConfig.videoUrl}
                poster={videoConfig.posterUrl}
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {videoConfig.badge && (
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
                    {videoConfig.badge}
                  </span>
                )}
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>{videoConfig.title}</div>
                <div style={{ color: '#cbd5e1', fontSize: '11px', marginTop: '2px', textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{videoConfig.subtitle}</div>
              </div>
            </div>

            <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px', color: '#94a3b8', fontSize: '12px', lineHeight: 1.5 }}>
              💡 <strong>Tip:</strong> You can paste any direct video URL from YouTube CDN, CloudFront, S3, or your own hosting server. When saved, the homepage updates instantly!
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. INTERNATIONAL DESTINATIONS TAB */}
      {/* ======================================================== */}
      {activeSubTab === 'international' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {intlList.length} International Destinations from Avian Experiences
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={resetIntlSettings}
                style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer' }}
              >
                Reset Default
              </button>
              <button
                type="button"
                onClick={saveIntlSettings}
                style={{
                  fontSize: '13px', fontWeight: 700, color: '#fff',
                  background: savedIntl ? '#10b981' : '#01132d',
                  border: 'none', borderRadius: '10px', padding: '9px 20px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px'
                }}
              >
                {savedIntl ? <><FaCircleCheck size={13} /> Saved!</> : 'Save Destinations'}
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
            {intlList.map((dest, i) => (
              <div
                key={i}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '140px', position: 'relative' }}>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    {dest.price}
                  </div>
                </div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#01132d' }}>{dest.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{dest.duration}</div>
                  <input
                    type="text"
                    value={dest.price || ''}
                    onChange={(e) => {
                      const updated = [...intlList];
                      updated[i].price = e.target.value;
                      setIntlList(updated);
                      setSavedIntl(false);
                    }}
                    placeholder="Price (e.g. ₹25,800)"
                    style={{ width: '100%', marginTop: '8px', padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Comprehensive Package Catalog Merger
function getMergedPackageCatalog(backendPkgs = []) {
  const mergedMap = new Map();

  // 1. Group trips (Jaisalmer, Meghalaya, Spiti, etc.)
  (groupTripsList || []).forEach((gt) => {
    const key = gt.id || gt.slug || (gt.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    mergedMap.set(key, {
      id: key,
      slug: key,
      title: gt.title,
      duration: gt.duration || '3 Days 2 Nights',
      category: gt.category || 'Group Trip',
      location: gt.location || gt.route || gt.title,
      price: gt.price || gt.basePrice || 7800,
      original_price: gt.originalPrice || (gt.price ? gt.price + 3000 : 10800),
      image: gt.image || (gt.images && gt.images[0]) || '',
      rating: gt.rating || 4.9,
      reviews_count: gt.reviewsCount || 120,
      badge: gt.categoryBadge || 'Group Trip',
      ...gt
    });
  });

  // 2. All tour packages (Golden Triangle, Kerala, Rajasthan, etc.)
  (allTourPackages || []).forEach((tp) => {
    const key = tp.id || tp.slug || (tp.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!mergedMap.has(key)) {
      mergedMap.set(key, {
        id: key,
        slug: key,
        title: tp.title,
        duration: tp.duration || '5 Days / 4 Nights',
        category: tp.category || 'Tour Package',
        location: tp.location || tp.destination || tp.title,
        price: tp.price || tp.basePrice || 14999,
        original_price: tp.originalPrice || 19999,
        image: tp.image || '',
        rating: tp.rating || 4.8,
        reviews_count: tp.reviewsCount || 95,
        ...tp
      });
    }
  });

  // 3. Admin demo packages
  (DEMO_DATA.packages || []).forEach((dp) => {
    const key = dp.id || dp.slug || (dp.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!mergedMap.has(key)) {
      mergedMap.set(key, dp);
    }
  });

  // 4. Backend database packages
  (backendPkgs || []).forEach((bp) => {
    const key = bp.id || bp.slug || (bp.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = mergedMap.get(key) || {};
    mergedMap.set(key, { ...existing, ...bp });
  });

  // 5. LocalStorage custom packages
  try {
    const custom = JSON.parse(localStorage.getItem('india_tour_custom_packages')) || [];
    custom.forEach((cp) => {
      const key = cp.id || cp.slug || (cp.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      mergedMap.set(key, { ...(mergedMap.get(key) || {}), ...cp });
    });
  } catch {}

  // 6. LocalStorage package overrides
  try {
    const overrides = JSON.parse(localStorage.getItem('india_tour_package_overrides')) || {};
    Object.keys(overrides).forEach((k) => {
      const ov = overrides[k];
      const key = ov.id || ov.slug || k;
      if (mergedMap.has(key)) {
        mergedMap.set(key, { ...mergedMap.get(key), ...ov });
      } else {
        mergedMap.set(key, ov);
      }
    });
  } catch {}

  return Array.from(mergedMap.values());
}

// Reusable Admin Pagination Component
function AdminPagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  itemName = 'entries'
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (totalItems <= 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="adm-pagination">
      <div className="adm-pagination-info">
        Showing <strong>{start}</strong> to <strong>{end}</strong> of <strong>{totalItems}</strong> {itemName}
      </div>

      <div className="adm-pagination-controls">
        <button
          type="button"
          className="adm-page-btn adm-page-prev"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          aria-label="Previous page"
        >
          <FaChevronLeft size={11} />
          <span>Previous</span>
        </button>

        <div className="adm-page-numbers">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="adm-page-ellipsis">
                  •••
                </span>
              );
            }
            return (
              <button
                key={p}
                type="button"
                className={`adm-page-num ${p === currentPage ? 'active' : ''}`}
                onClick={() => onPageChange(p)}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="adm-page-btn adm-page-next"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          aria-label="Next page"
        >
          <span>Next</span>
          <FaChevronRight size={11} />
        </button>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onExitAdmin }) {
  // Navigation: overview | enquiries | bookings | packages | destinations | testimonials | users | security
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global search input in topbar (filters whichever tab is active)
  const [globalSearch, setGlobalSearch] = useState('');

  // Authentication state
  const [token, setToken] = useState(() => {
    return localStorage.getItem('admin_token') || localStorage.getItem('india_tour_token') || '';
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const adminU = JSON.parse(localStorage.getItem('admin_user'));
      if (adminU) return adminU;
      const tourU = JSON.parse(localStorage.getItem('india_tour_user'));
      if (tourU?.role === 'admin') return tourU;
      return null;
    } catch {
      return null;
    }
  });

  // Split-screen login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Data states
  const [stats, setStats] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Filter states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');
  const [bookingPaymentFilter, setBookingPaymentFilter] = useState('all');
  const [packageCategoryFilter, setPackageCategoryFilter] = useState('all');
  const [destTypeFilter, setDestTypeFilter] = useState('all');
  const [testiRatingFilter, setTestiRatingFilter] = useState('all');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Pagination states
  const [pageEnquiries, setPageEnquiries] = useState(1);
  const [pageBookings, setPageBookings] = useState(1);
  const [pagePackages, setPagePackages] = useState(1);
  const [pageDestinations, setPageDestinations] = useState(1);
  const [pageTestimonials, setPageTestimonials] = useState(1);
  const [pageUsers, setPageUsers] = useState(1);

  // Lead Pop-up Configuration State
  const DEFAULT_POPUP_CONFIG = {
    enabled: true,
    triggerOnGroupTrips: false, // Do NOT open when user opens group page
    triggerOnCreatorTrips: false,
    triggerOnPackageClick: true, // Open when user opens a particular trip package
    delaySeconds: 20, // 20 seconds delay on package
    showFrequency: 'always',
    defaultTitle: 'Meghalaya Tour Package',
    defaultDuration: '6 Days 5 Nights',
    defaultSubtitle: 'Krem Chympe, Waterfalls & Root Bridges',
    defaultImage: '/meghalaya_root_bridge.jpg',
    badgeText: 'No Cost EMI options available ↗',
    badgeAction: 'open_emi_modal',
    formHeading: 'Plan Your Next Trip',
    buttonText: 'Connect with Expert',
    buttonColor: '#e52b2b',
    whatsappNumber: '+919548436762'
  };

  const [popupSettings, setPopupSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('india_tour_popup_settings');
      if (stored) return { ...DEFAULT_POPUP_CONFIG, ...JSON.parse(stored) };
    } catch {}
    return DEFAULT_POPUP_CONFIG;
  });
  const [popupSaving, setPopupSaving] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewModalSettings, setPreviewModalSettings] = useState(null);

  const ITEMS_PER_PAGE_TABLE = 10;
  const ITEMS_PER_PAGE_GRID = 8;

  // Slide-over drawer state
  const [drawerType, setDrawerType] = useState(null); // 'enquiry' | 'convert_enquiry' | 'package' | 'destination' | 'booking' | 'testimonial'
  const [drawerData, setDrawerData] = useState(null);
  const [pkgEditorTab, setPkgEditorTab] = useState('basic');
  const [drawerNoteText, setDrawerNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete confirmation modal state
  const [deleteDialog, setDeleteDialog] = useState(null); // { type, id, title, message }

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((text, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  // Central Logout Handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('india_tour_token');
    localStorage.removeItem('india_tour_user');
    setToken('');
    setAdminUser(null);
    setDrawerType(null);
    setDeleteDialog(null);
  }, []);

  // Central API Helper (signs out immediately on 401 Unauthorized)
  const apiCall = useCallback(async (endpoint, options = {}) => {
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
      });

      if (res.status === 401) {
        handleLogout();
        showToast('Session expired. Please sign in again.', 'error');
        throw new Error('Unauthorized');
      }

      const json = await res.json();
      return { ok: res.ok, status: res.status, data: json };
    } catch (err) {
      if (err.message === 'Unauthorized') throw err;
      throw err;
    }
  }, [token, handleLogout, showToast]);

  // Load all initial data simultaneously (using backend API with fallback for localhost demo)
  const fetchAllData = useCallback(async () => {
    if (!token) return;
    setDataLoading(true);

    try {
      const [
        statsRes,
        enquiriesRes,
        bookingsRes,
        packagesRes,
        destinationsRes,
        testimonialsRes,
        usersRes
      ] = await Promise.allSettled([
        apiCall('/admin/stats.php'),
        apiCall('/admin/enquiries.php'),
        apiCall('/admin/bookings.php'),
        apiCall('/admin/packages.php'),
        apiCall('/admin/destinations.php'),
        apiCall('/admin/testimonials.php?admin=1'),
        apiCall('/admin/users.php')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.data?.status && statsRes.value.data.data) {
        setStats(statsRes.value.data.data);
      } else {
        setStats(DEMO_DATA.stats);
      }

      if (enquiriesRes.status === 'fulfilled' && enquiriesRes.value?.data?.data?.enquiries?.length) {
        setEnquiries(enquiriesRes.value.data.data.enquiries);
      } else {
        setEnquiries((prev) => (prev.length ? prev : DEMO_DATA.enquiries));
      }

      if (bookingsRes.status === 'fulfilled' && bookingsRes.value?.data?.data?.bookings?.length) {
        setBookings(bookingsRes.value.data.data.bookings);
      } else {
        setBookings((prev) => (prev.length ? prev : DEMO_DATA.bookings));
      }

      const backendPackages = (packagesRes.status === 'fulfilled' && packagesRes.value?.data?.data?.packages?.length)
        ? packagesRes.value.data.data.packages
        : [];
      setPackages(getMergedPackageCatalog(backendPackages));

      if (destinationsRes.status === 'fulfilled' && destinationsRes.value?.data?.data?.destinations?.length) {
        setDestinations(destinationsRes.value.data.data.destinations);
      } else {
        setDestinations((prev) => (prev.length ? prev : DEMO_DATA.destinations));
      }

      if (testimonialsRes.status === 'fulfilled' && testimonialsRes.value?.data?.data?.testimonials?.length) {
        setTestimonials(testimonialsRes.value.data.data.testimonials);
      } else {
        setTestimonials((prev) => (prev.length ? prev : DEMO_DATA.testimonials));
      }

      if (usersRes.status === 'fulfilled' && usersRes.value?.data?.data?.users?.length) {
        setUsers(usersRes.value.data.data.users);
      } else {
        setUsers((prev) => (prev.length ? prev : DEMO_DATA.users));
      }

      // Also retrieve lead popup configuration
      try {
        const popupRes = await apiCall('/admin/popup_settings.php');
        if (popupRes?.data?.data) {
          setPopupSettings((prev) => ({ ...prev, ...popupRes.data.data }));
          localStorage.setItem('india_tour_popup_settings', JSON.stringify(popupRes.data.data));
        }
      } catch {
        // Fallback already loaded from localStorage
      }
    } catch {
      // Gracefully ensure UI has demo dataset
      setStats((prev) => prev || DEMO_DATA.stats);
      setEnquiries((prev) => (prev.length ? prev : DEMO_DATA.enquiries));
      setBookings((prev) => (prev.length ? prev : DEMO_DATA.bookings));
      setPackages(getMergedPackageCatalog([]));
      setDestinations((prev) => (prev.length ? prev : DEMO_DATA.destinations));
      setTestimonials((prev) => (prev.length ? prev : DEMO_DATA.testimonials));
      setUsers((prev) => (prev.length ? prev : DEMO_DATA.users));
    } finally {
      setDataLoading(false);
    }
  }, [token, apiCall]);

  // Handle saving popup configuration
  const handleSavePopupSettings = async (newSettings) => {
    setPopupSaving(true);
    setPopupSettings(newSettings);
    try {
      localStorage.setItem('india_tour_popup_settings', JSON.stringify(newSettings));
      window.dispatchEvent(new Event('storage'));
      
      const res = await apiCall('/admin/popup_settings.php', {
        method: 'POST',
        body: JSON.stringify(newSettings)
      });
      if (res?.ok) {
        showToast('Lead Pop-up configuration saved & published!', 'success');
      } else {
        showToast('Saved locally in browser storage.', 'success');
      }
    } catch {
      showToast('Saved locally in browser storage.', 'success');
    } finally {
      setPopupSaving(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token, fetchAllData]);

  // Escape key closes slide-over drawer and delete dialog
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (deleteDialog) {
          setDeleteDialog(null);
        } else if (drawerType) {
          setDrawerType(null);
          setDrawerData(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerType, deleteDialog]);

  // Login handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch(`${API_BASE}/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();

      if (res.ok && data.status && data.data?.token) {
        if (data.data.user?.role !== 'admin') {
          setLoginError('Access denied: Administrator privileges required.');
          setLoginLoading(false);
          return;
        }

        localStorage.setItem('admin_token', data.data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.data.user));
        localStorage.setItem('india_tour_token', data.data.token);
        localStorage.setItem('india_tour_user', JSON.stringify(data.data.user));

        setToken(data.data.token);
        setAdminUser(data.data.user);
        showToast('Welcome to India Tour Console!');
      } else {
        setLoginError(data.message || 'Invalid email or password.');
      }
    } catch {
      setLoginError('Failed to connect to authentication server. Please check backend.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Image upload helper
  const handleImageUpload = async (file, onUploaded) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);

    try {
      showToast('Uploading image...', 'info');
      const res = await apiCall('/admin/upload_image.php', {
        method: 'POST',
        body: formData
      });

      if (res.ok && res.data?.status && res.data.data?.url) {
        onUploaded(res.data.data.url);
        showToast('Image uploaded successfully!');
      } else {
        showToast(res.data?.message || 'Image upload failed', 'error');
      }
    } catch {
      showToast('Error uploading image to server', 'error');
    }
  };

  // Live count computations
  const newEnquiriesCount = useMemo(() => {
    return enquiries.filter((e) => e.status === 'new').length;
  }, [enquiries]);

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus = enquiryStatusFilter === 'all' || e.status === enquiryStatusFilter;
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.phone?.toLowerCase().includes(q) ||
        e.destination?.toLowerCase().includes(q) ||
        e.message?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [enquiries, enquiryStatusFilter, globalSearch]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = bookingStatusFilter === 'all' || b.booking_status === bookingStatusFilter;
      const matchPayment = bookingPaymentFilter === 'all' || b.payment_status === bookingPaymentFilter;
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.customer_name?.toLowerCase().includes(q) ||
        b.customer_email?.toLowerCase().includes(q) ||
        b.package_name?.toLowerCase().includes(q) ||
        String(b.id || '').includes(q);
      return matchStatus && matchPayment && matchSearch;
    });
  }, [bookings, bookingStatusFilter, bookingPaymentFilter, globalSearch]);

  // Filtered Packages
  const filteredPackages = useMemo(() => {
    return packages.filter((p) => {
      const matchCat = packageCategoryFilter === 'all' || p.category?.toLowerCase() === packageCategoryFilter.toLowerCase();
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [packages, packageCategoryFilter, globalSearch]);

  // Filtered Destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((d) => {
      const matchType = destTypeFilter === 'all' || d.type?.toLowerCase() === destTypeFilter.toLowerCase();
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.name?.toLowerCase().includes(q) ||
        d.state?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
  }, [destinations, destTypeFilter, globalSearch]);

  // Filtered Testimonials
  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((t) => {
      const matchRating = testiRatingFilter === 'all' || Number(t.rating) === Number(testiRatingFilter);
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.name?.toLowerCase().includes(q) ||
        t.location?.toLowerCase().includes(q) ||
        t.comment?.toLowerCase().includes(q);
      return matchRating && matchSearch;
    });
  }, [testimonials, testiRatingFilter, globalSearch]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const q = globalSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [users, userRoleFilter, globalSearch]);

  // Reset pagination to page 1 whenever filters or global search change
  useEffect(() => {
    setPageEnquiries(1);
    setPageBookings(1);
    setPagePackages(1);
    setPageDestinations(1);
    setPageTestimonials(1);
    setPageUsers(1);
  }, [globalSearch]);

  useEffect(() => { setPageEnquiries(1); }, [enquiryStatusFilter]);
  useEffect(() => { setPageBookings(1); }, [bookingStatusFilter, bookingPaymentFilter]);
  useEffect(() => { setPagePackages(1); }, [packageCategoryFilter]);
  useEffect(() => { setPageDestinations(1); }, [destTypeFilter]);
  useEffect(() => { setPageTestimonials(1); }, [testiRatingFilter]);
  useEffect(() => { setPageUsers(1); }, [userRoleFilter]);

  // Paginated slices for each tab
  const paginatedEnquiries = useMemo(() => {
    const start = (pageEnquiries - 1) * ITEMS_PER_PAGE_TABLE;
    return filteredEnquiries.slice(start, start + ITEMS_PER_PAGE_TABLE);
  }, [filteredEnquiries, pageEnquiries]);

  const paginatedBookings = useMemo(() => {
    const start = (pageBookings - 1) * ITEMS_PER_PAGE_TABLE;
    return filteredBookings.slice(start, start + ITEMS_PER_PAGE_TABLE);
  }, [filteredBookings, pageBookings]);

  const paginatedPackages = useMemo(() => {
    const start = (pagePackages - 1) * ITEMS_PER_PAGE_GRID;
    return filteredPackages.slice(start, start + ITEMS_PER_PAGE_GRID);
  }, [filteredPackages, pagePackages]);

  const paginatedDestinations = useMemo(() => {
    const start = (pageDestinations - 1) * ITEMS_PER_PAGE_GRID;
    return filteredDestinations.slice(start, start + ITEMS_PER_PAGE_GRID);
  }, [filteredDestinations, pageDestinations]);

  const paginatedTestimonials = useMemo(() => {
    const start = (pageTestimonials - 1) * ITEMS_PER_PAGE_GRID;
    return filteredTestimonials.slice(start, start + ITEMS_PER_PAGE_GRID);
  }, [filteredTestimonials, pageTestimonials]);

  const paginatedUsers = useMemo(() => {
    const start = (pageUsers - 1) * ITEMS_PER_PAGE_TABLE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE_TABLE);
  }, [filteredUsers, pageUsers]);

  // Open Package Drawer for Creating
  const handleOpenCreatePackage = () => {
    const uniqueSlug = 'tour-' + Date.now().toString(36);
    setDrawerData({
      id: uniqueSlug,
      slug: uniqueSlug,
      title: '',
      subtitle: 'Curated Group Adventure',
      category: 'Group Trip',
      categoryBadge: 'Group Trip',
      duration: '4 Days 3 Nights',
      location: '',
      price: 9999,
      original_price: 13999,
      saveAmount: 4000,
      difficulty: 'Moderate',
      altitude: '10,000 ft',
      rating: 4.9,
      reviews_count: 50,
      image: '',
      overviewText: 'Experience an unforgettable journey through breathtaking landscapes, authentic culture, and rich local heritage.',
      heroImages: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
      ],
      memoriesImages: [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80'
      ],
      itinerary: [
        {
          day: 0,
          title: 'Arrival & Welcome Session',
          date: 'Day 0',
          img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
          points: [
            'Arrive at the designated reporting point and meet group members.',
            'Check in to your hotel/camp and freshen up.',
            'Orientation briefing and welcome dinner.'
          ],
          stay: '🏨 Deluxe Boutique Hotel',
          meals: '🍽️ Dinner Included'
        },
        {
          day: 1,
          title: 'Full Day Sightseeing & Exploration',
          date: 'Day 1',
          img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          points: [
            'Morning breakfast with panoramic views.',
            'Guided sightseeing of the key landmark attractions.',
            'Evening leisure time at local markets and cultural halts.'
          ],
          stay: '🏨 Deluxe Boutique Hotel',
          meals: '🍽️ Breakfast & Dinner Included'
        }
      ],
      inclusions: [
        'Stay in verified hotels and scenic camps',
        'Breakfast and dinner as specified in the itinerary',
        'Private vehicle for transfers and sightseeing halts',
        'Experienced and certified Trip Captain throughout the expedition',
        'All toll taxes, parking fees, and driver allowances'
      ],
      exclusions: [
        '5% GST on the final billing amount',
        'Airfare or train fare to reporting city',
        'Lunch meals during transit and sightseeing halts',
        'Personal expenses, room service, laundry, and tips'
      ],
      placesToVisit: [
        { name: 'Panoramic Viewpoints', desc: 'Marvel at dramatic vistas and pristine horizons with photo halts.' },
        { name: 'Heritage Landmarks', desc: 'Explore historic architecture, local bazaars, and traditional streets.' }
      ],
      attractions: [
        { name: 'Iconic Scenic Valley', tag: 'Breathtaking mountain perspectives', img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
        { name: 'Historic Heritage Quarter', tag: 'Centuries-old stone architecture and alleys', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }
      ],
      thingsToDo: [
        { name: 'Campfire & Acoustic Evenings', desc: 'Unwind under blanket of stars with acoustic tunes and group bonding.' },
        { name: 'Local Gastronomy Tastings', desc: 'Sample authentic regional delicacies and fresh beverages.' }
      ],
      travelTips: [
        { name: 'Pack suitable layers', desc: 'Check seasonal temperatures and carry adequate warm clothing.' },
        { name: 'Sturdy footwear', desc: 'Comfortable walking shoes are strongly recommended.' },
        { name: 'Carry government ID', desc: 'Carry original ID for hotel check-ins and travel permits.' }
      ],
      perks: [
        { title: 'Stay included', desc: 'Handpicked Stays' },
        { title: 'Meals included', desc: 'Breakfast & Dinner' },
        { title: 'Sightseeing included', desc: 'All Major Spots' },
        { title: 'Trip Leader included', desc: 'Certified Captain' }
      ],
      packageCities: [
        { id: 'standard', name: 'Standard Route', duration: '4 Days', regularPrice: 13999, discountPrice: 9999, vehicle: 'Tempo Traveller / AC Coach', img: '' }
      ],
      sharingOptions: [
        { id: 'quad', name: 'Quad Sharing', regular: 13999, discounted: 9999, off: 4000 },
        { id: 'triple', name: 'Triple Sharing', regular: 14999, discounted: 10999, off: 4000 },
        { id: 'double', name: 'Double Sharing', regular: 16999, discounted: 12499, off: 4500 }
      ],
      batches: [
        { date: '10 Nov', day: 'Friday', fullDate: '10 Nov - 14 Nov', status: 'Available' },
        { date: '17 Nov', day: 'Friday', fullDate: '17 Nov - 21 Nov', status: 'Filling Fast' }
      ],
      faqs: [
        { q: 'What is included in this package?', a: 'Accommodations, daily breakfasts and dinners, ground transport for scheduled itinerary, and an experienced trip captain are all included.' },
        { q: 'Is this trip safe for solo travelers?', a: 'Yes! Our group trips are completely safe and friendly for solo travelers, women, and couples alike.' }
      ],
      is_edit: false
    });
    setPkgEditorTab('basic');
    setDrawerType('package');
  };

  // Open Package Drawer for Editing
  const handleOpenEditPackage = (pkg) => {
    const fullDetails = getTourDetailsData(pkg);
    const merged = {
      ...pkg,
      ...fullDetails,
      id: pkg.id || fullDetails.id || pkg.slug,
      slug: pkg.slug || pkg.id,
      title: pkg.title || fullDetails.title,
      subtitle: pkg.subtitle || fullDetails.subtitle,
      category: pkg.category || fullDetails.categoryBadge || 'Group Trip',
      categoryBadge: fullDetails.categoryBadge || pkg.category || 'Group Trip',
      duration: pkg.duration || fullDetails.duration,
      location: pkg.location || fullDetails.routeSummary,
      price: Number(pkg.price || fullDetails.basePrice || 0),
      original_price: Number(pkg.original_price || fullDetails.originalPrice || 0),
      saveAmount: Number(pkg.saveAmount || fullDetails.saveAmount || 0),
      image: pkg.image || (fullDetails.heroImages && fullDetails.heroImages[0]) || '',
      overviewText: pkg.overviewText || pkg.overview || fullDetails.overviewText,
      heroImages: (Array.isArray(pkg.heroImages) && pkg.heroImages.length) ? pkg.heroImages : fullDetails.heroImages,
      memoriesImages: (Array.isArray(pkg.memoriesImages) && pkg.memoriesImages.length) ? pkg.memoriesImages : fullDetails.memoriesImages,
      itinerary: (Array.isArray(pkg.itinerary) && pkg.itinerary.length) ? pkg.itinerary : fullDetails.itinerary,
      inclusions: (Array.isArray(pkg.inclusions) && pkg.inclusions.length) ? pkg.inclusions : fullDetails.inclusions,
      exclusions: (Array.isArray(pkg.exclusions) && pkg.exclusions.length) ? pkg.exclusions : fullDetails.exclusions,
      placesToVisit: (Array.isArray(pkg.placesToVisit) && pkg.placesToVisit.length) ? pkg.placesToVisit : fullDetails.placesToVisit,
      attractions: (Array.isArray(pkg.attractions) && pkg.attractions.length) ? pkg.attractions : fullDetails.attractions,
      thingsToDo: (Array.isArray(pkg.thingsToDo) && pkg.thingsToDo.length) ? pkg.thingsToDo : fullDetails.thingsToDo,
      travelTips: (Array.isArray(pkg.travelTips) && pkg.travelTips.length) ? pkg.travelTips : fullDetails.travelTips,
      perks: (Array.isArray(pkg.perks) && pkg.perks.length) ? pkg.perks : fullDetails.perks,
      packageCities: (Array.isArray(pkg.packageCities) && pkg.packageCities.length) ? pkg.packageCities : fullDetails.packageCities,
      sharingOptions: (Array.isArray(pkg.sharingOptions) && pkg.sharingOptions.length) ? pkg.sharingOptions : fullDetails.sharingOptions,
      batches: (Array.isArray(pkg.batches) && pkg.batches.length) ? pkg.batches : fullDetails.batches,
      faqs: (Array.isArray(pkg.faqs) && pkg.faqs.length) ? pkg.faqs : fullDetails.faqs,
      is_edit: true
    };
    setDrawerData(merged);
    setPkgEditorTab('basic');
    setDrawerType('package');
  };

  // CRUD Actions: Packages
  const handleSavePackage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(drawerData.is_edit);
      const pkgId = drawerData.id || drawerData.slug || (drawerData.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const payload = {
        ...drawerData,
        id: pkgId,
        slug: pkgId,
        is_update: isEdit,
        price: Number(drawerData.price || 0),
        original_price: Number(drawerData.original_price || 0),
        saveAmount: Math.max(0, Number(drawerData.original_price || 0) - Number(drawerData.price || 0)),
        basePriceNum: Number(drawerData.price || 0),
        updated_at: new Date().toISOString()
      };

      // 1. Save to localStorage overrides
      try {
        const rawOverrides = localStorage.getItem('india_tour_package_overrides');
        const allOverrides = rawOverrides ? JSON.parse(rawOverrides) : {};
        allOverrides[pkgId] = payload;
        if (drawerData.slug) allOverrides[drawerData.slug] = payload;
        if (drawerData.title) allOverrides[drawerData.title.toLowerCase().trim()] = payload;
        localStorage.setItem('india_tour_package_overrides', JSON.stringify(allOverrides));
      } catch (err) {
        console.error('Failed saving override to localStorage:', err);
      }

      // 2. Also save to custom packages list in localStorage
      try {
        const rawCustom = localStorage.getItem('india_tour_custom_packages');
        const customList = rawCustom ? JSON.parse(rawCustom) : [];
        const existingIdx = customList.findIndex((p) => p.id === pkgId);
        if (existingIdx >= 0) {
          customList[existingIdx] = payload;
        } else {
          customList.unshift(payload);
        }
        localStorage.setItem('india_tour_custom_packages', JSON.stringify(customList));
      } catch (err) {
        console.error('Failed saving custom pkg to localStorage:', err);
      }

      // 3. Send to PHP backend API
      try {
        await apiCall('/admin/packages.php', {
          method: isEdit ? 'PUT' : 'POST',
          body: JSON.stringify(payload)
        });
      } catch (apiErr) {
        console.warn('Backend API call notice (offline/demo mode):', apiErr);
      }

      // 4. Update local state in AdminDashboard immediately
      setPackages((prev) => {
        const idx = prev.findIndex((p) => p.id === pkgId);
        if (idx >= 0) {
          const clone = [...prev];
          clone[idx] = { ...clone[idx], ...payload };
          return clone;
        }
        return [payload, ...prev];
      });

      // 5. Dispatch events for live updates on TourDetailsModal and throughout the app
      window.dispatchEvent(new CustomEvent('india_tour_package_updated', { detail: payload }));
      window.dispatchEvent(new Event('storage'));

      showToast(`Package "${payload.title}" saved successfully!`);
      setDrawerType(null);
      setDrawerData(null);
    } catch {
      showToast('Error saving package', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Actions: Destinations
  const handleSaveDestination = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(drawerData.is_edit);
      const res = await apiCall('/admin/destinations.php', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify({
          ...drawerData,
          is_update: isEdit
        })
      });

      if (res.ok && res.data?.status) {
        showToast(res.data.message || 'Destination saved successfully!');
        setDrawerType(null);
        setDrawerData(null);
        fetchAllData();
      } else {
        showToast(res.data?.message || 'Failed to save destination', 'error');
      }
    } catch {
      showToast('Error saving destination', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Actions: Enquiry update & note appending
  const handleSaveEnquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiCall('/admin/enquiries.php', {
        method: 'POST',
        body: JSON.stringify({
          id: drawerData.id,
          status: drawerData.status,
          notes: drawerData.notes,
          append_note: drawerNoteText
        })
      });

      if (res.ok && res.data?.status) {
        showToast('Enquiry details updated!');
        setDrawerType(null);
        setDrawerData(null);
        setDrawerNoteText('');
        fetchAllData();
      } else {
        showToast(res.data?.message || 'Failed to update enquiry', 'error');
      }
    } catch {
      showToast('Error updating enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert Enquiry to Booking
  const handleConvertEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiCall('/admin/bookings.php', {
        method: 'POST',
        body: JSON.stringify({
          action: 'convert_enquiry',
          enquiry_id: drawerData.enquiry_id,
          package_name: drawerData.package_name,
          travel_date: drawerData.travel_date,
          travelers: drawerData.travelers,
          total_price: drawerData.total_price,
          booking_status: drawerData.booking_status,
          payment_status: drawerData.payment_status,
          special_requests: drawerData.special_requests
        })
      });

      if (res.ok && res.data?.status) {
        showToast(res.data.message || 'Enquiry successfully converted to booking!');
        setDrawerType(null);
        setDrawerData(null);
        fetchAllData();
        setActiveTab('bookings'); // Switch immediately to Bookings tab
      } else {
        showToast(res.data?.message || 'Failed to convert enquiry', 'error');
      }
    } catch {
      showToast('Error converting enquiry', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Actions: Bookings
  const handleSaveBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(drawerData.id);
      const res = await apiCall('/admin/bookings.php', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(drawerData)
      });

      if (res.ok && res.data?.status) {
        showToast('Booking updated successfully!');
        setDrawerType(null);
        setDrawerData(null);
        fetchAllData();
      } else {
        showToast(res.data?.message || 'Failed to update booking', 'error');
      }
    } catch {
      showToast('Error saving booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // CRUD Actions: Testimonials
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const isEdit = Boolean(drawerData.id && drawerData.is_edit);
      const res = await apiCall('/admin/testimonials.php', {
        method: isEdit ? 'PUT' : 'POST',
        body: JSON.stringify(drawerData)
      });

      if (res.ok && res.data?.status) {
        showToast('Review saved successfully!');
        setDrawerType(null);
        setDrawerData(null);
        fetchAllData();
      } else {
        showToast(res.data?.message || 'Failed to save review', 'error');
      }
    } catch {
      showToast('Error saving review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Testimonial Public / Hidden
  const handleToggleTestimonialVisibility = async (t) => {
    const nextActive = t.is_active ? 0 : 1;
    try {
      const res = await apiCall('/admin/testimonials.php', {
        method: 'POST',
        body: JSON.stringify({ ...t, is_active: nextActive })
      });

      if (res.ok && res.data?.status) {
        showToast(`Review status set to ${nextActive ? 'Public' : 'Hidden'}.`);
        setTestimonials((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, is_active: nextActive } : item))
        );
      } else {
        showToast(res.data?.message || 'Could not toggle review', 'error');
      }
    } catch {
      showToast('Error toggling review status', 'error');
    }
  };

  // Change User Role
  const handleUpdateUserRole = async (user, newRole) => {
    try {
      const res = await apiCall('/admin/users.php', {
        method: 'POST',
        body: JSON.stringify({ id: user.id, role: newRole })
      });

      if (res.ok && res.data?.status) {
        showToast(`Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      } else {
        showToast(res.data?.message || 'Failed to update role', 'error');
      }
    } catch {
      showToast('Error updating user role', 'error');
    }
  };

  // Security: Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await apiCall('/user/profile.php', {
        method: 'POST',
        body: JSON.stringify({ password: newPassword })
      });

      if (res.ok && res.data?.status) {
        showToast('Password changed successfully! Please safeguard your credentials.');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.data?.message || 'Failed to update password', 'error');
      }
    } catch {
      showToast('Error updating password', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Execute Confirmed Delete
  const handleConfirmDelete = async () => {
    if (!deleteDialog) return;
    const { type, id } = deleteDialog;
    setDeleteDialog(null);

    try {
      let endpoint = '';
      if (type === 'package') endpoint = `/admin/packages.php?id=${encodeURIComponent(id)}`;
      if (type === 'destination') endpoint = `/admin/destinations.php?id=${encodeURIComponent(id)}`;
      if (type === 'enquiry') endpoint = `/admin/enquiries.php?id=${encodeURIComponent(id)}`;
      if (type === 'booking') endpoint = `/admin/bookings.php?id=${encodeURIComponent(id)}`;
      if (type === 'testimonial') endpoint = `/admin/testimonials.php?id=${encodeURIComponent(id)}`;

      const res = await apiCall(endpoint, { method: 'DELETE' });
      
      if (type === 'package') {
        try {
          const overrides = JSON.parse(localStorage.getItem('india_tour_package_overrides')) || {};
          delete overrides[id];
          localStorage.setItem('india_tour_package_overrides', JSON.stringify(overrides));
          const custom = JSON.parse(localStorage.getItem('india_tour_custom_packages')) || [];
          const filtered = custom.filter((p) => p.id !== id && p.slug !== id);
          localStorage.setItem('india_tour_custom_packages', JSON.stringify(filtered));
        } catch {}
        setPackages((prev) => prev.filter((p) => p.id !== id && p.slug !== id));
        window.dispatchEvent(new Event('storage'));
      }

      if (res.ok && res.data?.status) {
        showToast('Record deleted successfully.');
        fetchAllData();
      } else {
        showToast(res.data?.message || 'Record deleted from catalog.');
        fetchAllData();
      }
    } catch {
      showToast('Error executing delete operation', 'error');
    }
  };

  // Open Convert Enquiry Modal
  const openConvertToBooking = (enq) => {
    setDrawerType('convert_enquiry');
    setDrawerData({
      enquiry_id: enq.id,
      customer_name: enq.name,
      customer_email: enq.email,
      customer_phone: enq.phone,
      package_name: enq.destination || 'Custom Tour',
      travel_date: enq.date || new Date().toISOString().split('T')[0],
      travelers: enq.travelers || 1,
      total_price: '',
      booking_status: 'confirmed',
      payment_status: 'unpaid',
      special_requests: enq.message || ''
    });
  };

  // If not logged in, render the Split-Screen Login View
  if (!token) {
    return (
      <div className="adm">
        <div className="adm-login-wrapper">
          {/* Brand Visual Column */}
          <div className="adm-login-hero">
            <div className="adm-login-brand">
              <img
                src="/indiatournewlogo.jpg"
                alt="India Tourism Live Travels"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  background: '#ffffff',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
              <div className="adm-brand-text">
                <span className="adm-brand-name">India <span>Tourism</span></span>
                <span className="adm-brand-subtitle">Console & Operations</span>
              </div>
            </div>

            <div className="adm-login-hero-body">
              <span className="adm-login-hero-tag">Enterprise Console</span>
              <h1 className="adm-login-hero-title">
                Manage Tours, Leads & <span>Bookings</span> With Ease.
              </h1>
              <p className="adm-login-hero-desc">
                Real-time dashboard for curated group departures, customer pipeline, package inventory, and customer reviews.
              </p>
            </div>

            <div className="adm-login-hero-footer">
              <span>© {new Date().getFullYear()} India Tour Experiences Pvt. Ltd.</span>
              <span>•</span>
              <span>Secure Role-Based Access</span>
            </div>
          </div>

          {/* Form Column */}
          <div className="adm-login-form-side">
            <div className="adm-login-card">
              <h2 className="adm-login-title">Sign In</h2>
              <p className="adm-login-desc">Enter your administrator credentials to access the console.</p>

              {loginError && (
                <div className="adm-demo-alert" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}>
                  <FaTriangleExclamation style={{ flexShrink: 0 }} />
                  <div>{loginError}</div>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                <div className="adm-form-group">
                  <label className="adm-form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="adm-form-input"
                    placeholder="admin@indiatour.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="adm-form-group">
                  <label className="adm-form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="adm-form-input"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="adm-btn-action adm-btn-primary"
                  style={{ width: '100%', justifyContent: 'center', height: '44px', marginTop: '12px' }}
                >
                  {loginLoading ? 'Authenticating...' : 'Access Admin Console'}
                </button>
              </form>

              {onExitAdmin && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={onExitAdmin}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    ← Return to Public Website
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toasts */}
        <div className="adm-toasts-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`adm-toast-item ${toast.type}`}>
              <span>{toast.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Active Title text helper
  const pageTitles = {
    overview: 'Overview & Performance',
    enquiries: 'Customer Enquiries & Leads',
    bookings: 'Trip Bookings & Reservations',
    popup: 'Trip Lead Pop-up Manager',
    packages: 'Tour Packages Catalogue',
    destinations: 'Destination Guides',
    testimonials: 'Customer Reviews & Stories',
    users: 'User Accounts & Roles',
    security: 'Account & Security Settings'
  };

  return (
    <div className="adm">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`adm-sidebar-backdrop ${isMobileMenuOpen ? 'show' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ======================================================================
          SIDEBAR
          ====================================================================== */}
      <aside className={`adm-sidebar ${isSidebarCollapsed ? 'adm-sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'adm-sidebar-mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="adm-sidebar-header">
          <div className="adm-brand">
            <img
              src="/indiatournewlogo.jpg"
              alt="India Tourism Live Travels"
              style={{
                height: isSidebarCollapsed ? '28px' : '36px',
                width: 'auto',
                maxWidth: isSidebarCollapsed ? '28px' : '130px',
                objectFit: 'contain',
                background: '#ffffff',
                padding: '2px 6px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            />
            {!isSidebarCollapsed && (
              <div className="adm-brand-text">
                <span className="adm-brand-name">India <span>Tourism</span></span>
                <span className="adm-brand-subtitle">Console</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="adm-collapse-btn"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? <FaChevronRight size={11} /> : <FaChevronLeft size={11} />}
          </button>
        </div>

        {/* Nav Items Grouped */}
        <div className="adm-nav-container">
          {/* GROUP 1: Overview */}
          <div className="adm-nav-group">
            <div className="adm-nav-group-title">
              {isSidebarCollapsed ? '•' : 'Overview'}
            </div>
            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('overview');
                setIsMobileMenuOpen(false);
              }}
              title="Overview"
            >
              <span className="adm-nav-icon"><FaGaugeHigh /></span>
              {!isSidebarCollapsed && <span className="adm-nav-label">Dashboard</span>}
            </button>
          </div>

          {/* GROUP 2: Sales */}
          <div className="adm-nav-group">
            <div className="adm-nav-group-title">
              {isSidebarCollapsed ? '•' : 'Sales'}
            </div>
            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('enquiries');
                setIsMobileMenuOpen(false);
              }}
              title="Enquiries"
            >
              <span className="adm-nav-icon"><FaEnvelope /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Enquiries</span>
                  {newEnquiriesCount > 0 ? (
                    <span className="adm-nav-badge adm-nav-badge-lead">{newEnquiriesCount}</span>
                  ) : (
                    <span className="adm-nav-badge">{enquiries.length}</span>
                  )}
                </>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('bookings');
                setIsMobileMenuOpen(false);
              }}
              title="Bookings"
            >
              <span className="adm-nav-icon"><FaCalendarCheck /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Bookings</span>
                  <span className="adm-nav-badge">{bookings.length}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'popup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('popup');
                setIsMobileMenuOpen(false);
              }}
              title="Trip Lead Pop-up Manager"
            >
              <span className="adm-nav-icon"><FaBullhorn /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Lead Pop-up</span>
                  <span className={`adm-nav-badge ${popupSettings.enabled ? 'adm-nav-badge-lead' : ''}`}>
                    {popupSettings.enabled ? 'ON' : 'OFF'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* GROUP 3: Catalogue */}
          <div className="adm-nav-group">
            <div className="adm-nav-group-title">
              {isSidebarCollapsed ? '•' : 'Catalogue'}
            </div>
            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'packages' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('packages');
                setIsMobileMenuOpen(false);
              }}
              title="Packages"
            >
              <span className="adm-nav-icon"><FaSuitcaseRolling /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Packages</span>
                  <span className="adm-nav-badge">{packages.length}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'destinations' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('destinations');
                setIsMobileMenuOpen(false);
              }}
              title="Destinations"
            >
              <span className="adm-nav-icon"><FaLocationDot /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Destinations</span>
                  <span className="adm-nav-badge">{destinations.length}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'section-mgmt' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('section-mgmt');
                setIsMobileMenuOpen(false);
              }}
              title="Section Management"
            >
              <span className="adm-nav-icon"><FaLayerGroup /></span>
              {!isSidebarCollapsed && (
                <span className="adm-nav-label">Section Management</span>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('testimonials');
                setIsMobileMenuOpen(false);
              }}
              title="Customer Reviews"
            >
              <span className="adm-nav-icon"><FaStar /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Reviews</span>
                  <span className="adm-nav-badge">{testimonials.length}</span>
                </>
              )}
            </button>
          </div>

          {/* GROUP 4: Access */}
          <div className="adm-nav-group">
            <div className="adm-nav-group-title">
              {isSidebarCollapsed ? '•' : 'Access'}
            </div>
            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('users');
                setIsMobileMenuOpen(false);
              }}
              title="Users"
            >
              <span className="adm-nav-icon"><FaUsers /></span>
              {!isSidebarCollapsed && (
                <>
                  <span className="adm-nav-label">Users</span>
                  <span className="adm-nav-badge">{users.length}</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={`adm-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('security');
                setIsMobileMenuOpen(false);
              }}
              title="Security & Account"
            >
              <span className="adm-nav-icon"><FaShieldHalved /></span>
              {!isSidebarCollapsed && <span className="adm-nav-label">Security</span>}
            </button>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="adm-sidebar-footer">
          <div className="adm-user-avatar-sm">
            {(adminUser?.name || 'Admin').charAt(0).toUpperCase()}
          </div>
          {!isSidebarCollapsed && (
            <div className="adm-sidebar-user-info">
              <div className="adm-sidebar-user-name">{adminUser?.name || 'Administrator'}</div>
              <div className="adm-sidebar-user-role">Admin</div>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="adm-collapse-btn"
            title="Sign out of console"
            style={{ marginLeft: 'auto' }}
          >
            <FaRightFromBracket size={13} />
          </button>
        </div>
      </aside>

      {/* ======================================================================
          MAIN CONTENT WRAPPER
          ====================================================================== */}
      <div className="adm-content-wrapper">
        {/* TOPBAR */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              type="button"
              className="adm-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              title="Open menu"
            >
              <FaBars />
            </button>
            <h1 className="adm-page-title">{pageTitles[activeTab] || 'Console'}</h1>
          </div>

          <div className="adm-topbar-right">
            {/* Search Box */}
            <div className="adm-search-box">
              <span className="adm-search-icon"><FaMagnifyingGlass /></span>
              <input
                type="text"
                className="adm-search-input"
                placeholder={`Search in ${activeTab}...`}
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              className="adm-btn-action adm-btn-action-icon"
              onClick={fetchAllData}
              title="Refresh all data"
            >
              <FaArrowsRotate className={dataLoading ? 'adm-spin' : ''} />
            </button>

            {/* View Site Button */}
            {onExitAdmin && (
              <button
                type="button"
                className="adm-btn-action"
                onClick={onExitAdmin}
                title="View public website"
              >
                <span>View Site</span>
                <FaArrowUpRightFromSquare size={12} />
              </button>
            )}
          </div>
        </header>

        {/* MAIN BODY AREA */}
        <main className="adm-main-body">
          {/* ==================================================================
              TAB: OVERVIEW
              ================================================================== */}
          {activeTab === 'overview' && (
            <div>
              {/* Greeting Banner with Lead Pipeline Chevrons */}
              <div className="adm-greeting-banner">
                <div className="adm-greeting-header">
                  <div>
                    <h2 className="adm-greeting-title">
                      Welcome back, {adminUser?.name?.split(' ')[0] || 'Admin'}
                    </h2>
                    <div className="adm-greeting-date">
                      {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <span className="adm-panel-badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                    Live Operations
                  </span>
                </div>

                {/* 5-Stage Pipeline Chevrons */}
                <div className="adm-pipeline-container">
                  {[
                    { key: 'new', label: 'New', count: enquiries.filter((e) => e.status === 'new').length, isNew: true },
                    { key: 'contacted', label: 'Contacted', count: enquiries.filter((e) => e.status === 'contacted').length },
                    { key: 'in_progress', label: 'In Progress', count: enquiries.filter((e) => e.status === 'in_progress').length },
                    { key: 'converted', label: 'Converted', count: enquiries.filter((e) => e.status === 'converted').length },
                    { key: 'closed', label: 'Closed', count: enquiries.filter((e) => e.status === 'closed').length }
                  ].map((stage) => (
                    <div
                      key={stage.key}
                      className={`adm-pipeline-stage ${stage.isNew && stage.count > 0 ? 'new-stage' : ''}`}
                      onClick={() => {
                        setActiveTab('enquiries');
                        setEnquiryStatusFilter(stage.key);
                      }}
                      title={`View ${stage.label} enquiries`}
                    >
                      <div className="adm-pipeline-stage-top">
                        <span>{stage.label}</span>
                        <FaArrowRight size={10} style={{ opacity: 0.6 }} />
                      </div>
                      <div className="adm-pipeline-count">{stage.count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="adm-kpi-grid">
                {/* 1. Revenue Collected */}
                <div className="adm-kpi-card">
                  <div className="adm-kpi-top">
                    <span className="adm-kpi-label">Revenue Collected</span>
                    <div className="adm-kpi-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                      <FaIndianRupeeSign />
                    </div>
                  </div>
                  <div className="adm-kpi-val">
                    ₹{Number(stats?.revenue_collected || 0).toLocaleString('en-IN')}
                  </div>
                  <div className="adm-kpi-sub">
                    <span style={{ color: '#ef4444', fontWeight: 600 }}>
                      ₹{Number(stats?.revenue_unpaid || 0).toLocaleString('en-IN')}
                    </span>
                    <span>unpaid / pending</span>
                  </div>
                </div>

                {/* 2. Open Leads */}
                <div className="adm-kpi-card">
                  <div className="adm-kpi-top">
                    <span className="adm-kpi-label">Open Leads</span>
                    <div className="adm-kpi-icon-wrap" style={{ background: '#fff5f6', color: '#ec1d24' }}>
                      <FaEnvelope />
                    </div>
                  </div>
                  <div className="adm-kpi-val">
                    {newEnquiriesCount}
                  </div>
                  <div className="adm-kpi-sub">
                    <span>{enquiries.length} total enquiries in pipeline</span>
                  </div>
                </div>

                {/* 3. Upcoming Departures */}
                <div className="adm-kpi-card">
                  <div className="adm-kpi-top">
                    <span className="adm-kpi-label">Confirmed Bookings</span>
                    <div className="adm-kpi-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                      <FaSuitcaseRolling />
                    </div>
                  </div>
                  <div className="adm-kpi-val">
                    {stats?.bookings_by_status?.confirmed ?? bookings.filter((b) => b.booking_status === 'confirmed').length}
                  </div>
                  <div className="adm-kpi-sub">
                    <span>{bookings.length} reservations on file</span>
                  </div>
                </div>

                {/* 4. Active Users */}
                <div className="adm-kpi-card">
                  <div className="adm-kpi-top">
                    <span className="adm-kpi-label">Registered Users</span>
                    <div className="adm-kpi-icon-wrap" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                      <FaUsers />
                    </div>
                  </div>
                  <div className="adm-kpi-val">
                    {users.length || stats?.total_users || 0}
                  </div>
                  <div className="adm-kpi-sub">
                    <span>{users.filter((u) => u.role === 'admin').length} administrator accounts</span>
                  </div>
                </div>
              </div>

              {/* Split Lists: Needs a first reply & Next departures */}
              <div className="adm-split-grid">
                {/* Panel 1: Needs a first reply */}
                <div className="adm-panel">
                  <div className="adm-panel-header">
                    <div className="adm-panel-title">
                      <FaEnvelope style={{ color: '#fd5b01' }} />
                      <span>Needs a First Reply</span>
                    </div>
                    <span className="adm-panel-badge">{newEnquiriesCount} Leads</span>
                  </div>

                  <div>
                    {enquiries.filter((e) => e.status === 'new').slice(0, 5).map((enq) => (
                      <div key={enq.id} className="adm-list-item">
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', color: '#01132d' }}>
                            {enq.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                            <span><strong>Trip:</strong> {enq.destination || 'General Enquiry'}</span>
                            <span>•</span>
                            <span>{enq.travelers || 1} Pax</span>
                            <span>•</span>
                            <span>{enq.date || 'Flexible'}</span>
                          </div>
                        </div>

                        {/* Quick Contact & View Actions */}
                        <div className="adm-quick-actions">
                          {enq.phone && (
                            <a
                              href={`tel:${enq.phone}`}
                              className="adm-icon-btn call"
                              title={`Call ${enq.phone}`}
                            >
                              <FaPhone />
                            </a>
                          )}
                          {enq.phone && (
                            <a
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="adm-icon-btn whatsapp"
                              title="Chat on WhatsApp"
                            >
                              <FaWhatsapp />
                            </a>
                          )}
                          {enq.email && (
                            <a
                              href={`mailto:${enq.email}`}
                              className="adm-icon-btn email"
                              title={`Email ${enq.email}`}
                            >
                              <FaEnvelope />
                            </a>
                          )}
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() => {
                              setDrawerType('enquiry');
                              setDrawerData(enq);
                            }}
                            title="Open Lead Details"
                          >
                            <FaEye />
                          </button>
                        </div>
                      </div>
                    ))}

                    {enquiries.filter((e) => e.status === 'new').length === 0 && (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        All caught up! No pending enquiries waiting for a first reply.
                      </div>
                    )}
                  </div>
                </div>

                {/* Panel 2: Next departures */}
                <div className="adm-panel">
                  <div className="adm-panel-header">
                    <div className="adm-panel-title">
                      <FaCalendarCheck style={{ color: '#0284c7' }} />
                      <span>Next Departures</span>
                    </div>
                    <span className="adm-panel-badge" style={{ background: '#f0f9ff', color: '#0284c7' }}>
                      Upcoming
                    </span>
                  </div>

                  <div>
                    {bookings
                      .filter((b) => b.booking_status !== 'cancelled')
                      .slice(0, 5)
                      .map((b) => (
                        <div key={b.id} className="adm-list-item">
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#01132d' }}>
                              {b.package_name || 'Custom Package'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                              <span><strong>Guest:</strong> {b.customer_name}</span>
                              <span>•</span>
                              <span>{b.travel_date || 'Date TBD'}</span>
                              <span>•</span>
                              <span>{b.travelers || 1} Travelers</span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#01132d' }}>
                              ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                            </div>
                            <span className={`adm-badge ${b.payment_status === 'paid' ? 'adm-badge-green' : b.payment_status === 'partial' ? 'adm-badge-yellow' : 'adm-badge-red'}`}>
                              <span className="adm-badge-dot" />
                              {b.payment_status || 'unpaid'}
                            </span>
                          </div>
                        </div>
                      ))}

                    {bookings.length === 0 && (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                        No bookings recorded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB: ENQUIRIES
              ================================================================== */}
          {activeTab === 'enquiries' && (
            <div className="adm-table-card">
              <div className="adm-table-toolbar">
                <div className="adm-filters-wrap">
                  {[
                    { id: 'all', label: 'All Statuses' },
                    { id: 'new', label: 'New' },
                    { id: 'contacted', label: 'Contacted' },
                    { id: 'in_progress', label: 'In Progress' },
                    { id: 'converted', label: 'Converted' },
                    { id: 'closed', label: 'Closed' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      className={`adm-filter-pill ${enquiryStatusFilter === filter.id ? 'active' : ''}`}
                      onClick={() => setEnquiryStatusFilter(filter.id)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Showing {filteredEnquiries.length} leads
                </div>
              </div>

              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact Info</th>
                      <th>Tour / Destination</th>
                      <th>Travel Date & Pax</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEnquiries.map((enq) => {
                      const badgeClass =
                        enq.status === 'new'
                          ? 'adm-badge-orange'
                          : enq.status === 'contacted'
                          ? 'adm-badge-blue'
                          : enq.status === 'in_progress'
                          ? 'adm-badge-yellow'
                          : enq.status === 'converted'
                          ? 'adm-badge-green'
                          : 'adm-badge-gray';

                      return (
                        <tr key={enq.id}>
                          <td>
                            <div style={{ fontWeight: 700, color: '#01132d' }}>{enq.name}</div>
                            <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                              ID #{enq.id} • {enq.created_at ? new Date(enq.created_at).toLocaleDateString() : 'Recent'}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '13px' }}>{enq.email}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{enq.phone || 'No phone'}</div>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600 }}>{enq.destination || 'General Enquiry'}</span>
                          </td>
                          <td>
                            <div>{enq.date || 'Flexible'}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{enq.travelers || 1} Person(s)</div>
                          </td>
                          <td>
                            <span className={`adm-badge ${badgeClass}`}>
                              <span className="adm-badge-dot" />
                              {enq.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="adm-quick-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                type="button"
                                className="adm-icon-btn"
                                onClick={() => {
                                  setDrawerType('enquiry');
                                  setDrawerData(enq);
                                }}
                                title="View & Edit Notes"
                              >
                                <FaPen />
                              </button>
                              <button
                                type="button"
                                className="adm-icon-btn"
                                onClick={() => openConvertToBooking(enq)}
                                title="Convert to Booking"
                                style={{ color: '#10b981' }}
                              >
                                <FaCalendarCheck />
                              </button>
                              <button
                                type="button"
                                className="adm-icon-btn"
                                onClick={() =>
                                  setDeleteDialog({
                                    type: 'enquiry',
                                    id: enq.id,
                                    title: `Delete Enquiry #${enq.id}`,
                                    message: `Are you sure you want to delete the enquiry from ${enq.name}? This action cannot be reversed.`
                                  })
                                }
                                title="Delete Enquiry"
                                style={{ color: '#ef4444' }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No enquiries found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                currentPage={pageEnquiries}
                totalItems={filteredEnquiries.length}
                pageSize={ITEMS_PER_PAGE_TABLE}
                onPageChange={setPageEnquiries}
                itemName="leads"
              />
            </div>
          )}

          {/* ==================================================================
              TAB: BOOKINGS
              ================================================================== */}
          {activeTab === 'bookings' && (
            <div className="adm-table-card">
              <div className="adm-table-toolbar">
                <div className="adm-filters-wrap">
                  {/* Booking status filter */}
                  <select
                    className="adm-select"
                    value={bookingStatusFilter}
                    onChange={(e) => setBookingStatusFilter(e.target.value)}
                  >
                    <option value="all">All Booking Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  {/* Payment status filter */}
                  <select
                    className="adm-select"
                    value={bookingPaymentFilter}
                    onChange={(e) => setBookingPaymentFilter(e.target.value)}
                  >
                    <option value="all">All Payment Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  Showing {filteredBookings.length} reservations
                </div>
              </div>

              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Ref & Customer</th>
                      <th>Tour Package</th>
                      <th>Date & Travelers</th>
                      <th>Total Amount</th>
                      <th>Booking Status</th>
                      <th>Payment Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedBookings.map((b) => (
                      <tr key={b.id}>
                        <td>
                          <div style={{ fontWeight: 700, color: '#01132d' }}>{b.customer_name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            Ref #{b.id} • {b.customer_email || b.customer_phone || ''}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{b.package_name}</div>
                        </td>
                        <td>
                          <div>{b.travel_date || 'Date TBD'}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{b.travelers || 1} Travelers</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#01132d' }}>
                            ₹{Number(b.total_price || 0).toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`adm-badge ${
                              b.booking_status === 'confirmed'
                                ? 'adm-badge-green'
                                : b.booking_status === 'pending'
                                ? 'adm-badge-yellow'
                                : b.booking_status === 'completed'
                                ? 'adm-badge-blue'
                                : 'adm-badge-red'
                            }`}
                          >
                            <span className="adm-badge-dot" />
                            {b.booking_status}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`adm-badge ${
                              b.payment_status === 'paid'
                                ? 'adm-badge-green'
                                : b.payment_status === 'partial'
                                ? 'adm-badge-yellow'
                                : 'adm-badge-red'
                            }`}
                          >
                            <span className="adm-badge-dot" />
                            {b.payment_status || 'unpaid'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="adm-quick-actions" style={{ justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="adm-icon-btn"
                              onClick={() => {
                                setDrawerType('booking');
                                setDrawerData(b);
                              }}
                              title="Edit Booking"
                            >
                              <FaPen />
                            </button>
                            <button
                              type="button"
                              className="adm-icon-btn"
                              onClick={() =>
                                setDeleteDialog({
                                    type: 'booking',
                                    id: b.id,
                                    title: `Delete Booking #${b.id}`,
                                    message: `Are you sure you want to delete the booking for ${b.customer_name}?`
                                })
                              }
                              title="Delete Booking"
                              style={{ color: '#ef4444' }}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No bookings found matching filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                currentPage={pageBookings}
                totalItems={filteredBookings.length}
                pageSize={ITEMS_PER_PAGE_TABLE}
                onPageChange={setPageBookings}
                itemName="reservations"
              />
            </div>
          )}

          {/* ==================================================================
              TAB: PACKAGES
              ================================================================== */}
          {activeTab === 'packages' && (
            <div>
              <div className="adm-table-toolbar" style={{ background: '#fff', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div className="adm-filters-wrap">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'Golden Triangle', label: 'Golden Triangle' },
                    { id: 'Rajasthan', label: 'Rajasthan' },
                    { id: 'Kashmir', label: 'Kashmir' },
                    { id: 'Kerala', label: 'Kerala' },
                    { id: 'Ladakh', label: 'Ladakh' },
                    { id: 'Spiritual', label: 'Spiritual' },
                    { id: 'Wildlife', label: 'Wildlife' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`adm-filter-pill ${packageCategoryFilter.toLowerCase() === cat.id.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setPackageCategoryFilter(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="adm-btn-action adm-btn-primary"
                  onClick={handleOpenCreatePackage}
                >
                  <FaPlus />
                  <span>Add New Package</span>
                </button>
              </div>

              {/* Grid of Packages */}
              <div className="adm-catalog-grid">
                {paginatedPackages.map((pkg) => (
                  <div key={pkg.id} className="adm-item-card">
                    <img
                      src={pkg.image || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80'}
                      alt={pkg.title}
                      className="adm-item-card-img"
                    />
                    <div className="adm-item-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="adm-panel-badge">{pkg.category || 'Tour'}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>
                          <FaStar size={11} />
                          <span>{pkg.rating || '4.8'}</span>
                        </div>
                      </div>

                      <h3 className="adm-item-card-title">{pkg.title}</h3>
                      <div className="adm-item-card-sub">
                        <span>{pkg.duration}</span> • <span>{pkg.location}</span>
                      </div>

                      <div className="adm-item-card-footer">
                        <div>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>From </span>
                          <strong style={{ fontSize: '17px', color: '#01132d' }}>
                            ₹{Number(pkg.price || 0).toLocaleString('en-IN')}
                          </strong>
                        </div>

                        <div className="adm-quick-actions">
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() => handleOpenEditPackage(pkg)}
                            title="Edit Everything on Package Page"
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() =>
                              setDeleteDialog({
                                type: 'package',
                                id: pkg.id,
                                title: `Delete Package: ${pkg.title}`,
                                message: `Are you sure you want to remove package '${pkg.id}'? It will no longer be visible to visitors.`
                              })
                            }
                            title="Delete Package"
                            style={{ color: '#ef4444' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredPackages.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#94a3b8' }}>
                    No packages match your search or filter.
                  </div>
                )}
              </div>

              <div className="adm-catalog-pagination-wrap">
                <AdminPagination
                  currentPage={pagePackages}
                  totalItems={filteredPackages.length}
                  pageSize={ITEMS_PER_PAGE_GRID}
                  onPageChange={setPagePackages}
                  itemName="packages"
                />
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB: SECTION MANAGEMENT
              ================================================================== */}
          {activeTab === 'section-mgmt' && (
            <SectionManagementTab />
          )}

          {/* ==================================================================
              TAB: DESTINATIONS
              ================================================================== */}
          {activeTab === 'destinations' && (
            <div>
              <div className="adm-table-toolbar" style={{ background: '#fff', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div className="adm-filters-wrap">
                  {[
                    { id: 'all', label: 'All Types' },
                    { id: 'Heritage', label: 'Heritage' },
                    { id: 'Nature', label: 'Nature' },
                    { id: 'Mountain', label: 'Mountain' },
                    { id: 'Beach', label: 'Beach' },
                    { id: 'Spiritual', label: 'Spiritual' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      className={`adm-filter-pill ${destTypeFilter.toLowerCase() === type.id.toLowerCase() ? 'active' : ''}`}
                      onClick={() => setDestTypeFilter(type.id)}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="adm-btn-action adm-btn-primary"
                  onClick={() => {
                    setDrawerType('destination');
                    setDrawerData({
                      id: '',
                      name: '',
                      state: '',
                      type: 'Heritage',
                      image: '',
                      description: '',
                      best_time: 'October to March',
                      is_edit: false
                    });
                  }}
                >
                  <FaPlus />
                  <span>Add Destination</span>
                </button>
              </div>

              {/* Grid of Destinations */}
              <div className="adm-catalog-grid">
                {paginatedDestinations.map((dest) => (
                  <div key={dest.id} className="adm-item-card">
                    <img
                      src={dest.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'}
                      alt={dest.name}
                      className="adm-item-card-img"
                    />
                    <div className="adm-item-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="adm-panel-badge">{dest.type || 'Destination'}</span>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{dest.state}</span>
                      </div>

                      <h3 className="adm-item-card-title">{dest.name}</h3>
                      <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 12px 0', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {dest.description || 'Iconic Indian destination showcasing rich architecture and culture.'}
                      </p>

                      <div className="adm-item-card-footer">
                        <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                          Best: {dest.best_time || 'All year'}
                        </span>

                        <div className="adm-quick-actions">
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() => {
                              setDrawerType('destination');
                              setDrawerData({ ...dest, is_edit: true });
                            }}
                            title="Edit Destination"
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() =>
                              setDeleteDialog({
                                type: 'destination',
                                id: dest.id,
                                title: `Delete Destination: ${dest.name}`,
                                message: `Are you sure you want to remove ${dest.name}?`
                              })
                            }
                            title="Delete Destination"
                            style={{ color: '#ef4444' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredDestinations.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#94a3b8' }}>
                    No destinations match your criteria.
                  </div>
                )}
              </div>

              <div className="adm-catalog-pagination-wrap">
                <AdminPagination
                  currentPage={pageDestinations}
                  totalItems={filteredDestinations.length}
                  pageSize={ITEMS_PER_PAGE_GRID}
                  onPageChange={setPageDestinations}
                  itemName="destinations"
                />
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB: TESTIMONIALS / REVIEWS
              ================================================================== */}
          {activeTab === 'testimonials' && (
            <div>
              <div className="adm-table-toolbar" style={{ background: '#fff', borderRadius: '14px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                <div className="adm-filters-wrap">
                  {[
                    { id: 'all', label: 'All Ratings' },
                    { id: '5', label: '5 Stars' },
                    { id: '4', label: '4 Stars' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      className={`adm-filter-pill ${testiRatingFilter === r.id ? 'active' : ''}`}
                      onClick={() => setTestiRatingFilter(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="adm-btn-action adm-btn-primary"
                  onClick={() => {
                    setDrawerType('testimonial');
                    setDrawerData({
                      name: '',
                      location: '',
                      rating: 5,
                      comment: '',
                      trip: '',
                      avatar: '',
                      is_active: 1,
                      is_edit: false
                    });
                  }}
                >
                  <FaPlus />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Grid of Reviews */}
              <div className="adm-catalog-grid">
                {paginatedTestimonials.map((t) => (
                  <div key={t.id} className="adm-item-card">
                    <div className="adm-item-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        {/* Interactive Public / Hidden pill */}
                        <button
                          type="button"
                          onClick={() => handleToggleTestimonialVisibility(t)}
                          className={`adm-badge ${t.is_active ? 'adm-badge-green' : 'adm-badge-gray'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                          title="Click to toggle Public / Hidden"
                        >
                          <span className="adm-badge-dot" />
                          {t.is_active ? 'Public' : 'Hidden'}
                        </button>

                        <div style={{ display: 'flex', color: '#f59e0b', gap: '2px', fontSize: '12px' }}>
                          {Array.from({ length: Number(t.rating || 5) }).map((_, i) => (
                            <FaStar key={i} />
                          ))}
                        </div>
                      </div>

                      <p style={{ fontSize: '13px', color: '#334155', fontStyle: 'italic', marginBottom: '16px', flex: 1 }}>
                        "{t.comment}"
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' }}>
                        <div className="adm-user-avatar-sm" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {(t.name || 'G').charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#01132d' }}>{t.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {t.location || 'India'} {t.trip ? `• ${t.trip}` : ''}
                          </div>
                        </div>

                        <div className="adm-quick-actions">
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() => {
                              setDrawerType('testimonial');
                              setDrawerData({ ...t, is_edit: true });
                            }}
                            title="Edit Review"
                          >
                            <FaPen />
                          </button>
                          <button
                            type="button"
                            className="adm-icon-btn"
                            onClick={() =>
                              setDeleteDialog({
                                type: 'testimonial',
                                id: t.id,
                                title: `Delete Review from ${t.name}`,
                                message: `Are you sure you want to delete this customer review?`
                              })
                            }
                            title="Delete Review"
                            style={{ color: '#ef4444' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredTestimonials.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', background: '#fff', borderRadius: '12px', color: '#94a3b8' }}>
                    No testimonials found.
                  </div>
                )}
              </div>

              <div className="adm-catalog-pagination-wrap">
                <AdminPagination
                  currentPage={pageTestimonials}
                  totalItems={filteredTestimonials.length}
                  pageSize={ITEMS_PER_PAGE_GRID}
                  onPageChange={setPageTestimonials}
                  itemName="reviews"
                />
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB: USERS
              ================================================================== */}
          {activeTab === 'users' && (
            <div className="adm-table-card">
              <div className="adm-table-toolbar">
                <div className="adm-filters-wrap">
                  {[
                    { id: 'all', label: 'All Roles' },
                    { id: 'user', label: 'Users' },
                    { id: 'admin', label: 'Admins' },
                    { id: 'agent', label: 'Agents' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      className={`adm-filter-pill ${userRoleFilter === role.id ? 'active' : ''}`}
                      onClick={() => setUserRoleFilter(role.id)}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>

                <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                  {filteredUsers.length} total registered accounts
                </div>
              </div>

              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Joined Date</th>
                      <th>Role</th>
                      <th style={{ textAlign: 'right' }}>Change Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="adm-user-avatar-sm" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                              {(u.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, color: '#01132d' }}>{u.name}</div>
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID #{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>{u.phone || '—'}</td>
                        <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</td>
                        <td>
                          <span
                            className={`adm-badge ${
                              u.role === 'admin'
                                ? 'adm-badge-orange'
                                : u.role === 'agent'
                                ? 'adm-badge-blue'
                                : 'adm-badge-gray'
                            }`}
                          >
                            <span className="adm-badge-dot" />
                            {u.role?.toUpperCase() || 'USER'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <select
                            className="adm-select"
                            value={u.role || 'user'}
                            onChange={(e) => handleUpdateUserRole(u, e.target.value)}
                            style={{ height: '32px', fontSize: '12px' }}
                          >
                            <option value="user">User</option>
                            <option value="agent">Agent</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                          No users match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <AdminPagination
                currentPage={pageUsers}
                totalItems={filteredUsers.length}
                pageSize={ITEMS_PER_PAGE_TABLE}
                onPageChange={setPageUsers}
                itemName="accounts"
              />
            </div>
          )}

          {/* ==================================================================
              TAB: SECURITY
              ================================================================== */}
          {activeTab === 'security' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '960px' }}>
              {/* Password update card */}
              <div className="adm-panel">
                <div className="adm-panel-header">
                  <div className="adm-panel-title">
                    <FaLock style={{ color: '#fd5b01' }} />
                    <span>Change Admin Password</span>
                  </div>
                </div>

                <form onSubmit={handleChangePassword} style={{ padding: '24px' }}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      className="adm-form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      className="adm-form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="adm-btn-action adm-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', height: '42px', marginTop: '10px' }}
                  >
                    {passwordLoading ? 'Updating Password...' : 'Save New Password'}
                  </button>
                </form>
              </div>

              {/* Active Session Card */}
              <div className="adm-panel">
                <div className="adm-panel-header">
                  <div className="adm-panel-title">
                    <FaShieldHalved style={{ color: '#0284c7' }} />
                    <span>Current Session & Device</span>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <div style={{ marginBottom: '16px', fontSize: '13.5px', color: '#475569', lineHeight: 1.6 }}>
                    <div><strong>Signed in as:</strong> {adminUser?.name || 'Administrator'}</div>
                    <div><strong>Email:</strong> {adminUser?.email || 'admin@indiatour.com'}</div>
                    <div><strong>Authorization:</strong> Admin Bearer Token</div>
                    <div><strong>Environment:</strong> {isLocalhost ? 'Local Development' : 'Production Cloud'}</div>
                  </div>

                  <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="adm-btn-action"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        color: '#ef4444',
                        borderColor: '#fecaca',
                        background: '#fef2f2',
                        height: '42px'
                      }}
                    >
                      <FaRightFromBracket />
                      <span>Sign out of this device</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================================
              TAB 9: LEAD POP-UP MANAGER
              ================================================================== */}
          {activeTab === 'popup' && (
            <AdminPopupManager
              popupSettings={popupSettings}
              onSave={handleSavePopupSettings}
              saving={popupSaving}
              enquiries={enquiries}
              showToast={showToast}
              apiCall={apiCall}
              packages={packages}
              onOpenPreviewModal={(settings) => {
                setPreviewModalSettings(settings);
                setPreviewModalOpen(true);
              }}
            />
          )}
        </main>
      </div>

      {/* ======================================================================
          SLIDE-OVER DRAWER (Right-Hand Form Drawer, Escape to close)
          ====================================================================== */}
      {drawerType && drawerData && (
        <div
          className="adm-slideover-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDrawerType(null);
              setDrawerData(null);
            }
          }}
        >
          <div className={`adm-slideover-drawer ${drawerType === 'package' ? 'package-editor' : ''}`}>
            {/* Drawer Header */}
            <div className="adm-drawer-header">
              <h3 className="adm-drawer-title">
                {drawerType === 'package' && (drawerData.is_edit ? `Edit Package: ${drawerData.title || drawerData.id}` : 'Create New Package')}
                {drawerType === 'destination' && (drawerData.is_edit ? 'Edit Destination' : 'Add Destination')}
                {drawerType === 'enquiry' && `Enquiry Details #${drawerData.id}`}
                {drawerType === 'convert_enquiry' && 'Convert Lead to Booking'}
                {drawerType === 'booking' && `Edit Booking #${drawerData.id}`}
                {drawerType === 'testimonial' && (drawerData.is_edit ? 'Edit Review' : 'Add New Review')}
              </h3>
              <button
                type="button"
                className="adm-drawer-close"
                onClick={() => {
                  setDrawerType(null);
                  setDrawerData(null);
                }}
                title="Close (Esc)"
              >
                <FaXmark />
              </button>
            </div>

            {/* Package Editor Tab Bar */}
            {drawerType === 'package' && (
              <div className="adm-editor-tabs-bar">
                {[
                  { id: 'basic', label: 'Basic & Pricing', icon: FaSuitcaseRolling },
                  { id: 'media', label: 'Media & Gallery', icon: FaImage },
                  { id: 'overview', label: 'Overview & Story', icon: FaCompass },
                  { id: 'itinerary', label: `Itinerary (${drawerData.itinerary?.length || 0} Days)`, icon: FaCalendarDays },
                  { id: 'inclusions', label: 'Inclusions & Exclusions', icon: FaListCheck },
                  { id: 'places', label: 'Places & Attractions', icon: FaLocationDot },
                  { id: 'activities', label: 'Activities & Tips', icon: FaRoute },
                  { id: 'batches', label: 'Batches, Cities & FAQs', icon: FaCircleQuestion }
                ].map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      className={`adm-editor-tab-btn ${pkgEditorTab === t.id ? 'active' : ''}`}
                      onClick={() => setPkgEditorTab(t.id)}
                    >
                      <Icon size={12} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Drawer Body Forms */}
            <div className="adm-drawer-body">
              {/* 1. COMPREHENSIVE PACKAGE FORM */}
              {drawerType === 'package' && (
                <form id="drawer-form" onSubmit={handleSavePackage}>
                  
                  {/* TAB 1: BASIC & PRICING */}
                  {pkgEditorTab === 'basic' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Package Core Information & Pricing</h4>
                        <p className="adm-tab-section-desc">
                          Edit the tour title, slug, route summary, badges, duration, and price points displayed across all cards and hero sections.
                        </p>
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Package Identifier (Slug)</label>
                        <input
                          type="text"
                          required
                          disabled={drawerData.is_edit}
                          className="adm-form-input"
                          placeholder="e.g. jaisalmer-group-trip"
                          value={drawerData.id || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, id: e.target.value, slug: e.target.value })}
                        />
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Package Title</label>
                        <input
                          type="text"
                          required
                          className="adm-form-input"
                          placeholder="e.g. Jaisalmer Group Trip"
                          value={drawerData.title || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, title: e.target.value })}
                        />
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Subtitle / Highlight Tagline</label>
                        <input
                          type="text"
                          className="adm-form-input"
                          placeholder="e.g. Free Camel Safari or Krem Chympe & Living Root Bridges"
                          value={drawerData.subtitle || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, subtitle: e.target.value })}
                        />
                      </div>

                      <div className="adm-editor-grid-2">
                        <div className="adm-form-group">
                          <label className="adm-form-label">Duration</label>
                          <input
                            type="text"
                            required
                            className="adm-form-input"
                            placeholder="e.g. 3 Days 2 Nights"
                            value={drawerData.duration || ''}
                            onChange={(e) => setDrawerData({ ...drawerData, duration: e.target.value })}
                          />
                        </div>
                        <div className="adm-form-group">
                          <label className="adm-form-label">Category Badge</label>
                          <input
                            type="text"
                            required
                            className="adm-form-input"
                            placeholder="e.g. Group Trip, Rajasthan, Mountain"
                            value={drawerData.category || ''}
                            onChange={(e) => setDrawerData({ ...drawerData, category: e.target.value, categoryBadge: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Route / Summary Headline</label>
                        <input
                          type="text"
                          required
                          className="adm-form-input"
                          placeholder="e.g. Ahmedabad Package with AC Sleeper Bus + Tempo Traveller"
                          value={drawerData.location || drawerData.routeSummary || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, location: e.target.value, routeSummary: e.target.value })}
                        />
                      </div>

                      <div className="adm-editor-grid-3">
                        <div className="adm-form-group">
                          <label className="adm-form-label">Offer Price (₹)</label>
                          <input
                            type="number"
                            required
                            className="adm-form-input"
                            value={drawerData.price || ''}
                            onChange={(e) => setDrawerData({ ...drawerData, price: e.target.value })}
                          />
                        </div>
                        <div className="adm-form-group">
                          <label className="adm-form-label">Original Price (₹)</label>
                          <input
                            type="number"
                            className="adm-form-input"
                            value={drawerData.original_price || ''}
                            onChange={(e) => setDrawerData({ ...drawerData, original_price: e.target.value })}
                          />
                        </div>
                        <div className="adm-form-group">
                          <label className="adm-form-label">Save Amount (₹)</label>
                          <input
                            type="number"
                            className="adm-form-input"
                            value={drawerData.saveAmount || ''}
                            onChange={(e) => setDrawerData({ ...drawerData, saveAmount: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="adm-editor-grid-2">
                        <div className="adm-form-group">
                          <label className="adm-form-label">Difficulty Level</label>
                          <input
                            type="text"
                            className="adm-form-input"
                            placeholder="e.g. Easy, Moderate, Challenging"
                            value={drawerData.difficulty || 'Easy'}
                            onChange={(e) => setDrawerData({ ...drawerData, difficulty: e.target.value })}
                          />
                        </div>
                        <div className="adm-form-group">
                          <label className="adm-form-label">Max Altitude / Climate</label>
                          <input
                            type="text"
                            className="adm-form-input"
                            placeholder="e.g. 12,500 ft or Desert Terrain"
                            value={drawerData.altitude || 'N/A'}
                            onChange={(e) => setDrawerData({ ...drawerData, altitude: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="adm-editor-grid-2">
                        <div className="adm-form-group">
                          <label className="adm-form-label">Star Rating (1.0 to 5.0)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="1"
                            max="5"
                            className="adm-form-input"
                            value={drawerData.rating || 4.9}
                            onChange={(e) => setDrawerData({ ...drawerData, rating: e.target.value })}
                          />
                        </div>
                        <div className="adm-form-group">
                          <label className="adm-form-label">Total Reviews Count</label>
                          <input
                            type="number"
                            className="adm-form-input"
                            value={drawerData.reviews_count || drawerData.reviewsCount || 120}
                            onChange={(e) => setDrawerData({ ...drawerData, reviews_count: e.target.value, reviewsCount: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MEDIA & GALLERY */}
                  {pkgEditorTab === 'media' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Cover & Gallery Media</h4>
                        <p className="adm-tab-section-desc">
                          Manage cover photography, desktop hero mosaic images, and memories gallery slides.
                        </p>
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Main Card Cover Image URL</label>
                        <input
                          type="url"
                          className="adm-form-input"
                          placeholder="https://..."
                          value={drawerData.image || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, image: e.target.value })}
                        />
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="file"
                            accept="image/*"
                            id="package-file-upload"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (url) => setDrawerData((prev) => ({ ...prev, image: url })));
                            }}
                          />
                          <label
                            htmlFor="package-file-upload"
                            className="adm-btn-action"
                            style={{ display: 'inline-flex', cursor: 'pointer' }}
                          >
                            <FaImage />
                            <span>Upload Cover Image File</span>
                          </label>
                        </div>

                        {drawerData.image && (
                          <div className="adm-img-preview-box" style={{ marginTop: '10px' }}>
                            <img src={drawerData.image} alt="Cover Preview" className="adm-img-preview" />
                          </div>
                        )}
                      </div>

                      {/* Hero Mosaic Images */}
                      <div className="adm-form-group" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Desktop Hero Mosaic Images (5 Images)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.heroImages || [])];
                              list.push('');
                              setDrawerData({ ...drawerData, heroImages: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Hero Photo</span>
                          </button>
                        </div>
                        
                        {(drawerData.heroImages || []).map((imgUrl, i) => (
                          <div key={i} className="adm-dynamic-row">
                            {imgUrl ? (
                              <img src={imgUrl} alt={`Hero ${i + 1}`} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '42px', height: '42px', background: '#e2e8f0', borderRadius: '6px', flexShrink: 0 }} />
                            )}
                            <input
                              type="url"
                              className="adm-form-input"
                              placeholder={`Hero photo ${i + 1} URL (https://...)`}
                              value={imgUrl}
                              onChange={(e) => {
                                const list = [...(drawerData.heroImages || [])];
                                list[i] = e.target.value;
                                setDrawerData({ ...drawerData, heroImages: list });
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-danger-icon"
                              onClick={() => {
                                const list = (drawerData.heroImages || []).filter((_, idx) => idx !== i);
                                setDrawerData({ ...drawerData, heroImages: list });
                              }}
                              title="Delete photo"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Memories Gallery Images */}
                      <div className="adm-form-group" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Memories Slider Images
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.memoriesImages || [])];
                              list.push('');
                              setDrawerData({ ...drawerData, memoriesImages: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Memory Photo</span>
                          </button>
                        </div>

                        {(drawerData.memoriesImages || []).map((imgUrl, i) => (
                          <div key={i} className="adm-dynamic-row">
                            {imgUrl ? (
                              <img src={imgUrl} alt={`Memory ${i + 1}`} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: '42px', height: '42px', background: '#e2e8f0', borderRadius: '6px', flexShrink: 0 }} />
                            )}
                            <input
                              type="url"
                              className="adm-form-input"
                              placeholder={`Memory photo ${i + 1} URL`}
                              value={imgUrl}
                              onChange={(e) => {
                                const list = [...(drawerData.memoriesImages || [])];
                                list[i] = e.target.value;
                                setDrawerData({ ...drawerData, memoriesImages: list });
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-danger-icon"
                              onClick={() => {
                                const list = (drawerData.memoriesImages || []).filter((_, idx) => idx !== i);
                                setDrawerData({ ...drawerData, memoriesImages: list });
                              }}
                              title="Delete photo"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: OVERVIEW & STORY */}
                  {pkgEditorTab === 'overview' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Trip Story & Overview</h4>
                        <p className="adm-tab-section-desc">
                          Craft the narrative that introduces visitors to the destination, experience, and key inclusions.
                        </p>
                      </div>

                      <div className="adm-form-group">
                        <label className="adm-form-label">Full Overview & Story Narrative</label>
                        <textarea
                          rows={7}
                          className="adm-form-textarea"
                          placeholder="Describe the overall destination story and experience..."
                          value={drawerData.overviewText || drawerData.overview || ''}
                          onChange={(e) => setDrawerData({ ...drawerData, overviewText: e.target.value, overview: e.target.value })}
                        />
                      </div>

                      <div style={{ marginTop: '20px' }}>
                        <label className="adm-form-label">4 Key Included Perks (Stay, Meals, Sightseeing, Trip Leader)</label>
                        <div className="adm-editor-grid-2">
                          {(drawerData.perks || [
                            { title: 'Stay included', desc: 'Hotel & Desert Camp' },
                            { title: 'Meals included', desc: 'Breakfast & Dinner' },
                            { title: 'Sightseeing included', desc: 'All Major Attractions' },
                            { title: 'Trip Leader included', desc: 'Experienced Leader' }
                          ]).map((perk, pIdx) => (
                            <div key={pIdx} className="adm-item-box">
                              <input
                                type="text"
                                className="adm-form-input"
                                style={{ marginBottom: '6px', fontWeight: 600 }}
                                placeholder="Perk Title (e.g. Stay included)"
                                value={perk.title || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.perks || [])];
                                  list[pIdx] = { ...list[pIdx], title: e.target.value };
                                  setDrawerData({ ...drawerData, perks: list });
                                }}
                              />
                              <input
                                type="text"
                                className="adm-form-input"
                                placeholder="Perk Description (e.g. Hotel & Swiss Camp)"
                                value={perk.desc || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.perks || [])];
                                  list[pIdx] = { ...list[pIdx], desc: e.target.value };
                                  setDrawerData({ ...drawerData, perks: list });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: DAY-BY-DAY ITINERARY */}
                  {pkgEditorTab === 'itinerary' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 className="adm-tab-section-title">
                            Day-by-Day Itinerary ({(drawerData.itinerary || []).length} Days)
                          </h4>
                          <p className="adm-tab-section-desc">
                            Edit day titles, dates, photos, stay, meals, and line-by-line schedule items. Reorder days with arrows.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="adm-btn-action adm-btn-primary"
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                          onClick={() => {
                            const list = [...(drawerData.itinerary || [])];
                            list.push({
                              day: list.length,
                              title: `Day ${list.length} Exploration`,
                              date: '',
                              img: '',
                              points: ['New activity highlight'],
                              stay: '🏨 Deluxe Boutique Hotel',
                              meals: '🍽️ Breakfast Included'
                            });
                            setDrawerData({ ...drawerData, itinerary: list });
                          }}
                        >
                          <FaPlus size={11} />
                          <span>Add New Day</span>
                        </button>
                      </div>

                      {/* Day Cards List */}
                      <div className="adm-itinerary-list">
                        {(drawerData.itinerary || []).map((dayItem, dayIdx) => (
                          <div key={dayIdx} className="adm-itinerary-card">
                            <div className="adm-day-header">
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="adm-day-badge">Day {dayItem.day !== undefined ? dayItem.day : dayIdx}</span>
                                <strong style={{ fontSize: '14px', color: '#01132d' }}>
                                  {dayItem.title || 'Untitled Day'}
                                </strong>
                              </div>
                              <div className="adm-day-actions">
                                <button
                                  type="button"
                                  className="adm-day-action-btn"
                                  disabled={dayIdx === 0}
                                  onClick={() => {
                                    if (dayIdx === 0) return;
                                    const list = [...(drawerData.itinerary || [])];
                                    const temp = list[dayIdx];
                                    list[dayIdx] = list[dayIdx - 1];
                                    list[dayIdx - 1] = temp;
                                    // Re-number day index
                                    list.forEach((item, i) => (item.day = i));
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                  title="Move Day Up"
                                >
                                  <FaArrowUp size={11} />
                                </button>
                                <button
                                  type="button"
                                  className="adm-day-action-btn"
                                  disabled={dayIdx === (drawerData.itinerary || []).length - 1}
                                  onClick={() => {
                                    if (dayIdx >= (drawerData.itinerary || []).length - 1) return;
                                    const list = [...(drawerData.itinerary || [])];
                                    const temp = list[dayIdx];
                                    list[dayIdx] = list[dayIdx + 1];
                                    list[dayIdx + 1] = temp;
                                    list.forEach((item, i) => (item.day = i));
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                  title="Move Day Down"
                                >
                                  <FaArrowDown size={11} />
                                </button>
                                <button
                                  type="button"
                                  className="adm-day-action-btn delete"
                                  onClick={() => {
                                    const list = (drawerData.itinerary || []).filter((_, idx) => idx !== dayIdx);
                                    list.forEach((item, i) => (item.day = i));
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                  title="Delete Day"
                                >
                                  <FaTrash size={11} />
                                </button>
                              </div>
                            </div>

                            {/* Day Title & Date */}
                            <div className="adm-editor-grid-2">
                              <div className="adm-form-group">
                                <label className="adm-form-label">Day Headline / Title</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. Arrival in Jaisalmer & City Sightseeing"
                                  value={dayItem.title || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.itinerary || [])];
                                    list[dayIdx] = { ...list[dayIdx], title: e.target.value };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                />
                              </div>
                              <div className="adm-form-group">
                                <label className="adm-form-label">Date / Subtitle Tag</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. November 06, 2026 or Day 1"
                                  value={dayItem.date || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.itinerary || [])];
                                    list[dayIdx] = { ...list[dayIdx], date: e.target.value };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                />
                              </div>
                            </div>

                            {/* Day Image URL */}
                            <div className="adm-form-group">
                              <label className="adm-form-label">Day Photo URL</label>
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                {dayItem.img ? (
                                  <img src={dayItem.img} alt={`Day ${dayItem.day}`} style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                                ) : (
                                  <div style={{ width: '42px', height: '42px', background: '#e2e8f0', borderRadius: '6px', flexShrink: 0 }} />
                                )}
                                <input
                                  type="url"
                                  className="adm-form-input"
                                  placeholder="https://..."
                                  value={dayItem.img || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.itinerary || [])];
                                    list[dayIdx] = { ...list[dayIdx], img: e.target.value };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                />
                              </div>
                            </div>

                            {/* Stay & Meals */}
                            <div className="adm-editor-grid-2">
                              <div className="adm-form-group">
                                <label className="adm-form-label">Stay Accommodation</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. 🏨 Overnight stay at hotel in Jaisalmer"
                                  value={dayItem.stay || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.itinerary || [])];
                                    list[dayIdx] = { ...list[dayIdx], stay: e.target.value };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                />
                              </div>
                              <div className="adm-form-group">
                                <label className="adm-form-label">Meals Included</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. 🍽️ Breakfast & Dinner Included"
                                  value={dayItem.meals || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.itinerary || [])];
                                    list[dayIdx] = { ...list[dayIdx], meals: e.target.value };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                />
                              </div>
                            </div>

                            {/* Schedule Highlights (Bullet Points) */}
                            <div className="adm-form-group">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                <label className="adm-form-label" style={{ margin: 0 }}>
                                  Day Schedule Highlights / Bullet Points
                                </label>
                                <button
                                  type="button"
                                  className="adm-btn-action"
                                  style={{ fontSize: '11px', padding: '3px 8px' }}
                                  onClick={() => {
                                    const list = [...(drawerData.itinerary || [])];
                                    const points = [...(list[dayIdx].points || [])];
                                    points.push('');
                                    list[dayIdx] = { ...list[dayIdx], points };
                                    setDrawerData({ ...drawerData, itinerary: list });
                                  }}
                                >
                                  <FaPlus size={9} />
                                  <span>Add Point</span>
                                </button>
                              </div>

                              {(dayItem.points || []).map((pt, ptIdx) => (
                                <div key={ptIdx} className="adm-dynamic-row">
                                  <span style={{ color: '#94a3b8', fontSize: '14px', flexShrink: 0 }}>•</span>
                                  <input
                                    type="text"
                                    className="adm-form-input"
                                    placeholder={`Schedule point ${ptIdx + 1}`}
                                    value={pt}
                                    onChange={(e) => {
                                      const list = [...(drawerData.itinerary || [])];
                                      const points = [...(list[dayIdx].points || [])];
                                      points[ptIdx] = e.target.value;
                                      list[dayIdx] = { ...list[dayIdx], points };
                                      setDrawerData({ ...drawerData, itinerary: list });
                                    }}
                                  />
                                  <button
                                    type="button"
                                    className="adm-btn-danger-icon"
                                    style={{ width: '28px', height: '28px' }}
                                    onClick={() => {
                                      const list = [...(drawerData.itinerary || [])];
                                      const points = (list[dayIdx].points || []).filter((_, idx) => idx !== ptIdx);
                                      list[dayIdx] = { ...list[dayIdx], points };
                                      setDrawerData({ ...drawerData, itinerary: list });
                                    }}
                                    title="Remove point"
                                  >
                                    <FaXmark size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="adm-btn-add-item"
                        style={{ marginTop: '12px' }}
                        onClick={() => {
                          const list = [...(drawerData.itinerary || [])];
                          list.push({
                            day: list.length,
                            title: `Day ${list.length} Activities`,
                            date: '',
                            img: '',
                            points: ['Activity highlight 1'],
                            stay: '🏨 Deluxe Boutique Hotel',
                            meals: '🍽️ Breakfast Included'
                          });
                          setDrawerData({ ...drawerData, itinerary: list });
                        }}
                      >
                        <FaPlus size={11} />
                        <span>Add Another Itinerary Day</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 5: INCLUSIONS & EXCLUSIONS */}
                  {pkgEditorTab === 'inclusions' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Inclusions & Exclusions</h4>
                        <p className="adm-tab-section-desc">
                          Clearly detail what is covered by India Tour versus what requires extra expenditure.
                        </p>
                      </div>

                      {/* Inclusions */}
                      <div className="adm-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0, color: '#10b981' }}>
                            ✓ Trip Inclusions ({(drawerData.inclusions || []).length} Items)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.inclusions || [])];
                              list.push('');
                              setDrawerData({ ...drawerData, inclusions: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Inclusion</span>
                          </button>
                        </div>

                        {(drawerData.inclusions || []).map((inc, i) => (
                          <div key={i} className="adm-dynamic-row">
                            <span style={{ color: '#10b981', flexShrink: 0, fontWeight: 700 }}>✓</span>
                            <input
                              type="text"
                              className="adm-form-input"
                              placeholder="e.g. AC Sleeper Bus / Private Vehicle for all sightseeing"
                              value={inc}
                              onChange={(e) => {
                                const list = [...(drawerData.inclusions || [])];
                                list[i] = e.target.value;
                                setDrawerData({ ...drawerData, inclusions: list });
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-danger-icon"
                              onClick={() => {
                                const list = (drawerData.inclusions || []).filter((_, idx) => idx !== i);
                                setDrawerData({ ...drawerData, inclusions: list });
                              }}
                              title="Delete inclusion"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Exclusions */}
                      <div className="adm-form-group" style={{ marginTop: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0, color: '#ef4444' }}>
                            ✗ Trip Exclusions ({(drawerData.exclusions || []).length} Items)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.exclusions || [])];
                              list.push('');
                              setDrawerData({ ...drawerData, exclusions: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Exclusion</span>
                          </button>
                        </div>

                        {(drawerData.exclusions || []).map((exc, i) => (
                          <div key={i} className="adm-dynamic-row">
                            <span style={{ color: '#ef4444', flexShrink: 0, fontWeight: 700 }}>✗</span>
                            <input
                              type="text"
                              className="adm-form-input"
                              placeholder="e.g. 5% GST on the final billing amount"
                              value={exc}
                              onChange={(e) => {
                                const list = [...(drawerData.exclusions || [])];
                                list[i] = e.target.value;
                                setDrawerData({ ...drawerData, exclusions: list });
                              }}
                            />
                            <button
                              type="button"
                              className="adm-btn-danger-icon"
                              onClick={() => {
                                const list = (drawerData.exclusions || []).filter((_, idx) => idx !== i);
                                setDrawerData({ ...drawerData, exclusions: list });
                              }}
                              title="Delete exclusion"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 6: PLACES & ATTRACTIONS */}
                  {pkgEditorTab === 'places' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Places to Visit & Attractions Showcase</h4>
                        <p className="adm-tab-section-desc">
                          Manage the prominent attractions grid cards and places to visit descriptions.
                        </p>
                      </div>

                      {/* Attractions Showcase */}
                      <div className="adm-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Visual Attractions Cards ({(drawerData.attractions || []).length} Attractions)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.attractions || [])];
                              list.push({ name: '', tag: '', img: '' });
                              setDrawerData({ ...drawerData, attractions: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Attraction</span>
                          </button>
                        </div>

                        {(drawerData.attractions || []).map((attr, aIdx) => (
                          <div key={aIdx} className="adm-item-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <strong style={{ fontSize: '13px', color: '#01132d' }}>
                                Attraction #{aIdx + 1}: {attr.name || 'New Attraction'}
                              </strong>
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px' }}
                                onClick={() => {
                                  const list = (drawerData.attractions || []).filter((_, idx) => idx !== aIdx);
                                  setDrawerData({ ...drawerData, attractions: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>

                            <div className="adm-editor-grid-2">
                              <input
                                type="text"
                                className="adm-form-input"
                                placeholder="Attraction Name (e.g. Jaisalmer Fort)"
                                value={attr.name || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.attractions || [])];
                                  list[aIdx] = { ...list[aIdx], name: e.target.value };
                                  setDrawerData({ ...drawerData, attractions: list });
                                }}
                              />
                              <input
                                type="text"
                                className="adm-form-input"
                                placeholder="Tagline (e.g. The Golden Wonder of Rajasthan)"
                                value={attr.tag || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.attractions || [])];
                                  list[aIdx] = { ...list[aIdx], tag: e.target.value };
                                  setDrawerData({ ...drawerData, attractions: list });
                                }}
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                              {attr.img ? (
                                <img src={attr.img} alt={attr.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                              ) : (
                                <div style={{ width: '38px', height: '38px', background: '#e2e8f0', borderRadius: '6px', flexShrink: 0 }} />
                              )}
                              <input
                                type="url"
                                className="adm-form-input"
                                placeholder="Attraction Photo URL (https://...)"
                                value={attr.img || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.attractions || [])];
                                  list[aIdx] = { ...list[aIdx], img: e.target.value };
                                  setDrawerData({ ...drawerData, attractions: list });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Places to Visit */}
                      <div className="adm-form-group" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Places to Visit Summary
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.placesToVisit || [])];
                              list.push({ name: '', desc: '' });
                              setDrawerData({ ...drawerData, placesToVisit: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Place</span>
                          </button>
                        </div>

                        {(drawerData.placesToVisit || []).map((pl, pIdx) => (
                          <div key={pIdx} className="adm-item-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <input
                                type="text"
                                className="adm-form-input"
                                style={{ fontWeight: 600 }}
                                placeholder="Place Name (e.g. Sam Sand Dunes)"
                                value={pl.name || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.placesToVisit || [])];
                                  list[pIdx] = { ...list[pIdx], name: e.target.value };
                                  setDrawerData({ ...drawerData, placesToVisit: list });
                                }}
                              />
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px', marginLeft: '8px' }}
                                onClick={() => {
                                  const list = (drawerData.placesToVisit || []).filter((_, idx) => idx !== pIdx);
                                  setDrawerData({ ...drawerData, placesToVisit: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              className="adm-form-textarea"
                              placeholder="Place description..."
                              value={pl.desc || ''}
                              onChange={(e) => {
                                const list = [...(drawerData.placesToVisit || [])];
                                list[pIdx] = { ...list[pIdx], desc: e.target.value };
                                setDrawerData({ ...drawerData, placesToVisit: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 7: ACTIVITIES & TIPS */}
                  {pkgEditorTab === 'activities' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Activities & Travel Tips</h4>
                        <p className="adm-tab-section-desc">
                          Manage experiential things to do and practical advice for travelers.
                        </p>
                      </div>

                      {/* Things To Do */}
                      <div className="adm-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Things to Do (Experiential Highlights)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.thingsToDo || [])];
                              list.push({ name: '', desc: '' });
                              setDrawerData({ ...drawerData, thingsToDo: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Activity</span>
                          </button>
                        </div>

                        {(drawerData.thingsToDo || []).map((act, idx) => (
                          <div key={idx} className="adm-item-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <input
                                type="text"
                                className="adm-form-input"
                                style={{ fontWeight: 600 }}
                                placeholder="Activity Title (e.g. Ride a camel at Sam)"
                                value={act.name || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.thingsToDo || [])];
                                  list[idx] = { ...list[idx], name: e.target.value };
                                  setDrawerData({ ...drawerData, thingsToDo: list });
                                }}
                              />
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px', marginLeft: '8px' }}
                                onClick={() => {
                                  const list = (drawerData.thingsToDo || []).filter((_, i) => i !== idx);
                                  setDrawerData({ ...drawerData, thingsToDo: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                            <input
                              type="text"
                              className="adm-form-input"
                              placeholder="Short description of experience"
                              value={act.desc || ''}
                              onChange={(e) => {
                                const list = [...(drawerData.thingsToDo || [])];
                                list[idx] = { ...list[idx], desc: e.target.value };
                                setDrawerData({ ...drawerData, thingsToDo: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Travel Tips */}
                      <div className="adm-form-group" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Travel Tips & Things to Carry
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.travelTips || [])];
                              list.push({ name: '', desc: '' });
                              setDrawerData({ ...drawerData, travelTips: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Travel Tip</span>
                          </button>
                        </div>

                        {(drawerData.travelTips || []).map((tip, idx) => (
                          <div key={idx} className="adm-item-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <input
                                type="text"
                                className="adm-form-input"
                                style={{ fontWeight: 600 }}
                                placeholder="Tip Title (e.g. Pack warm layers)"
                                value={tip.name || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.travelTips || [])];
                                  list[idx] = { ...list[idx], name: e.target.value };
                                  setDrawerData({ ...drawerData, travelTips: list });
                                }}
                              />
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px', marginLeft: '8px' }}
                                onClick={() => {
                                  const list = (drawerData.travelTips || []).filter((_, i) => i !== idx);
                                  setDrawerData({ ...drawerData, travelTips: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                            <input
                              type="text"
                              className="adm-form-input"
                              placeholder="Tip details or advice..."
                              value={tip.desc || ''}
                              onChange={(e) => {
                                const list = [...(drawerData.travelTips || [])];
                                list[idx] = { ...list[idx], desc: e.target.value };
                                setDrawerData({ ...drawerData, travelTips: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 8: BATCHES, CITIES & FAQS */}
                  {pkgEditorTab === 'batches' && (
                    <div className="adm-tab-pane">
                      <div className="adm-tab-section-header">
                        <h4 className="adm-tab-section-title">Departure Batches, Cities & FAQs</h4>
                        <p className="adm-tab-section-desc">
                          Manage fixed group departure batch dates, pickup cities, and frequently asked questions.
                        </p>
                      </div>

                      {/* Batches */}
                      <div className="adm-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Departure Batches ({(drawerData.batches || []).length} Batches)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.batches || [])];
                              list.push({ date: '10 Nov', day: 'Friday', fullDate: '10 Nov - 14 Nov', status: 'Available' });
                              setDrawerData({ ...drawerData, batches: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add Batch</span>
                          </button>
                        </div>

                        {(drawerData.batches || []).map((batch, bIdx) => (
                          <div key={bIdx} className="adm-item-box">
                            <div className="adm-editor-grid-3">
                              <div>
                                <label className="adm-form-label" style={{ fontSize: '11px' }}>Short Date</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. 5 Nov"
                                  value={batch.date || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.batches || [])];
                                    list[bIdx] = { ...list[bIdx], date: e.target.value };
                                    setDrawerData({ ...drawerData, batches: list });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="adm-form-label" style={{ fontSize: '11px' }}>Day of Week</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. Thursday"
                                  value={batch.day || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.batches || [])];
                                    list[bIdx] = { ...list[bIdx], day: e.target.value };
                                    setDrawerData({ ...drawerData, batches: list });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="adm-form-label" style={{ fontSize: '11px' }}>Full Date Range</label>
                                <input
                                  type="text"
                                  className="adm-form-input"
                                  placeholder="e.g. 05 Nov - 09 Nov"
                                  value={batch.fullDate || ''}
                                  onChange={(e) => {
                                    const list = [...(drawerData.batches || [])];
                                    list[bIdx] = { ...list[bIdx], fullDate: e.target.value };
                                    setDrawerData({ ...drawerData, batches: list });
                                  }}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="adm-form-label" style={{ margin: 0, fontSize: '11px' }}>Availability Status:</label>
                                <select
                                  className="adm-form-select"
                                  style={{ padding: '4px 8px', fontSize: '12px' }}
                                  value={batch.status || 'Available'}
                                  onChange={(e) => {
                                    const list = [...(drawerData.batches || [])];
                                    list[bIdx] = { ...list[bIdx], status: e.target.value };
                                    setDrawerData({ ...drawerData, batches: list });
                                  }}
                                >
                                  <option value="Available">Available</option>
                                  <option value="Filling Fast">Filling Fast</option>
                                  <option value="Sold Out">Sold Out</option>
                                </select>
                              </div>
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px' }}
                                onClick={() => {
                                  const list = (drawerData.batches || []).filter((_, idx) => idx !== bIdx);
                                  setDrawerData({ ...drawerData, batches: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* FAQs */}
                      <div className="adm-form-group" style={{ marginTop: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label className="adm-form-label" style={{ margin: 0 }}>
                            Frequently Asked Questions ({(drawerData.faqs || []).length} FAQs)
                          </label>
                          <button
                            type="button"
                            className="adm-btn-action"
                            style={{ fontSize: '11.5px', padding: '4px 10px' }}
                            onClick={() => {
                              const list = [...(drawerData.faqs || [])];
                              list.push({ q: '', a: '' });
                              setDrawerData({ ...drawerData, faqs: list });
                            }}
                          >
                            <FaPlus size={10} />
                            <span>Add FAQ</span>
                          </button>
                        </div>

                        {(drawerData.faqs || []).map((faq, fIdx) => (
                          <div key={fIdx} className="adm-item-box">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                              <input
                                type="text"
                                className="adm-form-input"
                                style={{ fontWeight: 600 }}
                                placeholder="Question (e.g. Is this trip safe for solo travelers?)"
                                value={faq.q || ''}
                                onChange={(e) => {
                                  const list = [...(drawerData.faqs || [])];
                                  list[fIdx] = { ...list[fIdx], q: e.target.value };
                                  setDrawerData({ ...drawerData, faqs: list });
                                }}
                              />
                              <button
                                type="button"
                                className="adm-btn-danger-icon"
                                style={{ width: '28px', height: '28px', marginLeft: '8px' }}
                                onClick={() => {
                                  const list = (drawerData.faqs || []).filter((_, idx) => idx !== fIdx);
                                  setDrawerData({ ...drawerData, faqs: list });
                                }}
                              >
                                <FaTrash size={11} />
                              </button>
                            </div>
                            <textarea
                              rows={2}
                              className="adm-form-textarea"
                              placeholder="Detailed answer..."
                              value={faq.a || ''}
                              onChange={(e) => {
                                const list = [...(drawerData.faqs || [])];
                                list[fIdx] = { ...list[fIdx], a: e.target.value };
                                setDrawerData({ ...drawerData, faqs: list });
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              )}

              {/* 2. DESTINATION FORM */}
              {drawerType === 'destination' && (
                <form id="drawer-form" onSubmit={handleSaveDestination}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Destination Slug</label>
                    <input
                      type="text"
                      required
                      disabled={drawerData.is_edit}
                      className="adm-form-input"
                      placeholder="e.g. jaipur-rajasthan"
                      value={drawerData.id}
                      onChange={(e) => setDrawerData({ ...drawerData, id: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Destination Name</label>
                    <input
                      type="text"
                      required
                      className="adm-form-input"
                      placeholder="e.g. Jaipur"
                      value={drawerData.name}
                      onChange={(e) => setDrawerData({ ...drawerData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">State / Region</label>
                      <input
                        type="text"
                        required
                        className="adm-form-input"
                        placeholder="e.g. Rajasthan"
                        value={drawerData.state}
                        onChange={(e) => setDrawerData({ ...drawerData, state: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Type</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.type}
                        onChange={(e) => setDrawerData({ ...drawerData, type: e.target.value })}
                      >
                        <option value="Heritage">Heritage</option>
                        <option value="Nature">Nature</option>
                        <option value="Mountain">Mountain</option>
                        <option value="Beach">Beach</option>
                        <option value="Spiritual">Spiritual</option>
                      </select>
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Best Time To Visit</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. October to March"
                      value={drawerData.best_time}
                      onChange={(e) => setDrawerData({ ...drawerData, best_time: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Overview Description</label>
                    <textarea
                      rows={3}
                      className="adm-form-textarea"
                      placeholder="Write a brief overview of the destination..."
                      value={drawerData.description}
                      onChange={(e) => setDrawerData({ ...drawerData, description: e.target.value })}
                    />
                  </div>

                  {/* Image Upload & Preview */}
                  <div className="adm-form-group">
                    <label className="adm-form-label">Destination Image URL</label>
                    <input
                      type="url"
                      className="adm-form-input"
                      placeholder="https://..."
                      value={drawerData.image}
                      onChange={(e) => setDrawerData({ ...drawerData, image: e.target.value })}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="dest-file-upload"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, (url) => setDrawerData((prev) => ({ ...prev, image: url })));
                        }}
                      />
                      <label
                        htmlFor="dest-file-upload"
                        className="adm-btn-action"
                        style={{ display: 'inline-flex', cursor: 'pointer' }}
                      >
                        <FaImage />
                        <span>Upload Image File</span>
                      </label>
                    </div>

                    {drawerData.image && (
                      <div className="adm-img-preview-box">
                        <img src={drawerData.image} alt="Preview" className="adm-img-preview" />
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* 3. ENQUIRY VIEW & UPDATE FORM */}
              {drawerType === 'enquiry' && (
                <form id="drawer-form" onSubmit={handleSaveEnquiry}>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '18px' }}>
                    <div style={{ fontWeight: 700, fontSize: '16px', color: '#01132d' }}>{drawerData.name}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                      <div>Email: {drawerData.email}</div>
                      <div>Phone: {drawerData.phone || 'N/A'}</div>
                      <div>Requested Tour: {drawerData.destination || 'General'}</div>
                      <div>Travel Date: {drawerData.date || 'Flexible'} ({drawerData.travelers || 1} Travelers)</div>
                    </div>
                  </div>

                  {drawerData.message && (
                    <div className="adm-form-group">
                      <label className="adm-form-label">Customer's Message</label>
                      <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
                        "{drawerData.message}"
                      </div>
                    </div>
                  )}

                  <div className="adm-form-group">
                    <label className="adm-form-label">Lead Status</label>
                    <select
                      className="adm-form-select"
                      value={drawerData.status}
                      onChange={(e) => setDrawerData({ ...drawerData, status: e.target.value })}
                    >
                      <option value="new">New (Uncontacted)</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="converted">Converted to Booking</option>
                      <option value="closed">Closed / Archived</option>
                    </select>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Internal Follow-Up Notes</label>
                    <textarea
                      rows={3}
                      className="adm-form-textarea"
                      placeholder="Existing staff notes..."
                      value={drawerData.notes || ''}
                      onChange={(e) => setDrawerData({ ...drawerData, notes: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Append New Note Log</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Called client; sent Golden Triangle quote on WhatsApp."
                      value={drawerNoteText}
                      onChange={(e) => setDrawerNoteText(e.target.value)}
                    />
                  </div>

                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      className="adm-btn-action"
                      style={{ width: '100%', justifyContent: 'center', color: '#10b981', borderColor: '#a7f3d0', background: '#ecfdf5' }}
                      onClick={() => openConvertToBooking(drawerData)}
                    >
                      <FaCalendarCheck />
                      <span>Convert Directly To Booking</span>
                    </button>
                  </div>
                </form>
              )}

              {/* 4. CONVERT ENQUIRY TO BOOKING FORM */}
              {drawerType === 'convert_enquiry' && (
                <form id="drawer-form" onSubmit={handleConvertEnquirySubmit}>
                  <div style={{ background: '#fff5f6', border: '1px solid #fecdd3', padding: '14px', borderRadius: '10px', marginBottom: '16px' }}>
                    <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '13.5px' }}>
                      Converting Lead: {drawerData.customer_name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#dc2626' }}>
                      {drawerData.customer_email} • {drawerData.customer_phone}
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Package Name</label>
                    <input
                      type="text"
                      required
                      className="adm-form-input"
                      value={drawerData.package_name}
                      onChange={(e) => setDrawerData({ ...drawerData, package_name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Departure Date</label>
                      <input
                        type="date"
                        required
                        className="adm-form-input"
                        value={drawerData.travel_date}
                        onChange={(e) => setDrawerData({ ...drawerData, travel_date: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Number of Travelers</label>
                      <input
                        type="number"
                        min={1}
                        required
                        className="adm-form-input"
                        value={drawerData.travelers}
                        onChange={(e) => setDrawerData({ ...drawerData, travelers: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Agreed Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="adm-form-input"
                      placeholder="e.g. 29999"
                      value={drawerData.total_price}
                      onChange={(e) => setDrawerData({ ...drawerData, total_price: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Booking Status</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.booking_status}
                        onChange={(e) => setDrawerData({ ...drawerData, booking_status: e.target.value })}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="adm-form-group">
                      <label className="adm-form-label">Payment Status</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.payment_status}
                        onChange={(e) => setDrawerData({ ...drawerData, payment_status: e.target.value })}
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Fully Paid</option>
                      </select>
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Special Requests / Notes</label>
                    <textarea
                      rows={2}
                      className="adm-form-textarea"
                      value={drawerData.special_requests}
                      onChange={(e) => setDrawerData({ ...drawerData, special_requests: e.target.value })}
                    />
                  </div>
                </form>
              )}

              {/* 5. BOOKING EDIT FORM */}
              {drawerType === 'booking' && (
                <form id="drawer-form" onSubmit={handleSaveBooking}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Customer Name</label>
                    <input
                      type="text"
                      required
                      className="adm-form-input"
                      value={drawerData.customer_name}
                      onChange={(e) => setDrawerData({ ...drawerData, customer_name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Email</label>
                      <input
                        type="email"
                        className="adm-form-input"
                        value={drawerData.customer_email || ''}
                        onChange={(e) => setDrawerData({ ...drawerData, customer_email: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Phone</label>
                      <input
                        type="text"
                        className="adm-form-input"
                        value={drawerData.customer_phone || ''}
                        onChange={(e) => setDrawerData({ ...drawerData, customer_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Package Name</label>
                    <input
                      type="text"
                      required
                      className="adm-form-input"
                      value={drawerData.package_name}
                      onChange={(e) => setDrawerData({ ...drawerData, package_name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Travel Date</label>
                      <input
                        type="date"
                        className="adm-form-input"
                        value={drawerData.travel_date || ''}
                        onChange={(e) => setDrawerData({ ...drawerData, travel_date: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Travelers</label>
                      <input
                        type="number"
                        min={1}
                        className="adm-form-input"
                        value={drawerData.travelers || 1}
                        onChange={(e) => setDrawerData({ ...drawerData, travelers: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Total Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="adm-form-input"
                      value={drawerData.total_price}
                      onChange={(e) => setDrawerData({ ...drawerData, total_price: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Booking Status</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.booking_status}
                        onChange={(e) => setDrawerData({ ...drawerData, booking_status: e.target.value })}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div className="adm-form-group">
                      <label className="adm-form-label">Payment Status</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.payment_status}
                        onChange={(e) => setDrawerData({ ...drawerData, payment_status: e.target.value })}
                      >
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                        <option value="unpaid">Unpaid</option>
                      </select>
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Special Requests</label>
                    <textarea
                      rows={2}
                      className="adm-form-textarea"
                      value={drawerData.special_requests || ''}
                      onChange={(e) => setDrawerData({ ...drawerData, special_requests: e.target.value })}
                    />
                  </div>
                </form>
              )}

              {/* 6. TESTIMONIAL FORM */}
              {drawerType === 'testimonial' && (
                <form id="drawer-form" onSubmit={handleSaveTestimonial}>
                  <div className="adm-form-group">
                    <label className="adm-form-label">Reviewer Name</label>
                    <input
                      type="text"
                      required
                      className="adm-form-input"
                      value={drawerData.name}
                      onChange={(e) => setDrawerData({ ...drawerData, name: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Location</label>
                      <input
                        type="text"
                        className="adm-form-input"
                        placeholder="e.g. Mumbai, India"
                        value={drawerData.location || ''}
                        onChange={(e) => setDrawerData({ ...drawerData, location: e.target.value })}
                      />
                    </div>
                    <div className="adm-form-group">
                      <label className="adm-form-label">Rating (Stars)</label>
                      <select
                        className="adm-form-select"
                        value={drawerData.rating || 5}
                        onChange={(e) => setDrawerData({ ...drawerData, rating: Number(e.target.value) })}
                      >
                        <option value={5}>5 Stars</option>
                        <option value={4}>4 Stars</option>
                        <option value={3}>3 Stars</option>
                      </select>
                    </div>
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Tour Taken</label>
                    <input
                      type="text"
                      className="adm-form-input"
                      placeholder="e.g. Golden Triangle Tour"
                      value={drawerData.trip || ''}
                      onChange={(e) => setDrawerData({ ...drawerData, trip: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Review Comment</label>
                    <textarea
                      rows={4}
                      required
                      className="adm-form-textarea"
                      value={drawerData.comment}
                      onChange={(e) => setDrawerData({ ...drawerData, comment: e.target.value })}
                    />
                  </div>

                  <div className="adm-form-group">
                    <label className="adm-form-label">Visibility Status</label>
                    <select
                      className="adm-form-select"
                      value={drawerData.is_active ? 1 : 0}
                      onChange={(e) => setDrawerData({ ...drawerData, is_active: Number(e.target.value) })}
                    >
                      <option value={1}>Public (Visible on site)</option>
                      <option value={0}>Hidden</option>
                    </select>
                  </div>
                </form>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="adm-drawer-footer">
              <button
                type="button"
                className="adm-btn-action"
                onClick={() => {
                  setDrawerType(null);
                  setDrawerData(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                form="drawer-form"
                disabled={isSubmitting}
                className="adm-btn-action adm-btn-primary"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          DELETE CONFIRMATION DIALOG (MODAL)
          ====================================================================== */}
      {deleteDialog && (
        <div
          className="adm-dialog-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteDialog(null);
          }}
        >
          <div className="adm-dialog-box">
            <div className="adm-dialog-icon danger">
              <FaTriangleExclamation />
            </div>
            <h3 className="adm-dialog-title">{deleteDialog.title}</h3>
            <p className="adm-dialog-desc">{deleteDialog.message}</p>
            <div className="adm-dialog-actions">
              <button
                type="button"
                className="adm-btn-action"
                onClick={() => setDeleteDialog(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn-action"
                style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff' }}
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Pop-up Interactive Preview Modal */}
      <TripLeadModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        popupSettings={previewModalSettings || popupSettings}
        onOpenEmiModal={() => showToast('In live view, this opens the No Cost EMI calculator.', 'info')}
      />

      {/* ======================================================================
          TOASTS CONTAINER
          ====================================================================== */}
      <div className="adm-toasts-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`adm-toast-item ${toast.type}`}>
            {toast.type === 'success' && <FaCircleCheck style={{ color: '#10b981' }} />}
            {toast.type === 'error' && <FaCircleExclamation style={{ color: '#ef4444' }} />}
            {toast.type === 'info' && <FaCircleCheck style={{ color: '#0284c7' }} />}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
