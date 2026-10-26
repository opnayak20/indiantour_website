import React, { useState, useRef } from 'react';
import {
  FaBullhorn,
  FaCompass,
  FaEnvelope,
  FaFloppyDisk,
  FaGlobe,
  FaMapPin,
  FaPhone,
  FaRotateLeft,
  FaShieldHalved,
  FaSliders,
  FaWhatsapp,
  FaCircleCheck,
  FaImage,
  FaUpload,
  FaFileLines,
  FaPercent,
  FaUserTie,
  FaPlus,
  FaTrash
} from 'react-icons/fa6';
import { getCmsData, saveCmsData, resetCmsData } from '../data/cmsData';
import { API_BASE } from '../config/api';

// Helper Component: Image URL with Direct File Upload & Live Preview
function ImageUploadField({ label, value, onChange, placeholder, helperText, showToast }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = sessionStorage.getItem('admin_token') || localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      if (showToast) showToast('Uploading image to server...', 'info');

      const res = await fetch(`${API_BASE}/admin/upload_image.php`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const json = await res.json();
      if (res.ok && json.status && json.data?.url) {
        onChange(json.data.url);
        if (showToast) showToast('Image uploaded successfully!', 'success');
      } else {
        if (showToast) showToast(json.message || 'Image upload failed', 'error');
      }
    } catch {
      if (showToast) showToast('Failed to connect to image upload service', 'error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
        {label}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'https://...'}
          className="adm-input"
          style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#334155',
            fontSize: '12px',
            fontWeight: 600,
            cursor: isUploading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          <FaUpload size={11} />
          <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </div>
      {helperText && (
        <span style={{ display: 'block', fontSize: '11px', color: '#64748b', marginTop: '3px' }}>
          {helperText}
        </span>
      )}
      {value && (
        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={value}
            alt="Preview"
            style={{ height: '36px', width: 'auto', maxWidth: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f1f5f9' }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 600 }}>✓ Live Image Asset</span>
        </div>
      )}
    </div>
  );
}

export default function AdminCmsManager({ showToast }) {
  const [activeSubTab, setActiveSubTab] = useState('header'); // 'header' | 'homepage' | 'footer' | 'pages'

  // Header State
  const [headerData, setHeaderData] = useState(() => getCmsData('header'));
  // Homepage State
  const [homepageData, setHomepageData] = useState(() => getCmsData('homepage'));
  // Footer State
  const [footerData, setFooterData] = useState(() => getCmsData('footer'));
  // Dedicated Pages State
  const [pagesData, setPagesData] = useState(() => getCmsData('pages'));

  const [savingKey, setSavingKey] = useState(null);

  // Helper for saving
  const handleSave = async (key) => {
    setSavingKey(key);
    let dataToSave = null;
    if (key === 'header') dataToSave = headerData;
    if (key === 'homepage') dataToSave = homepageData;
    if (key === 'footer') dataToSave = footerData;
    if (key === 'pages') dataToSave = pagesData;

    if (dataToSave) {
      await saveCmsData(key, dataToSave);
      if (showToast) {
        showToast(`${key.toUpperCase()} content saved & published live!`, 'success');
      }
    }
    setTimeout(() => setSavingKey(null), 800);
  };

  // Helper for resetting
  const handleReset = (key) => {
    if (!window.confirm(`Are you sure you want to reset all ${key.toUpperCase()} settings to defaults?`)) return;
    const def = resetCmsData(key);
    if (key === 'header') setHeaderData(def);
    if (key === 'homepage') setHomepageData(def);
    if (key === 'footer') setFooterData(def);
    if (key === 'pages') setPagesData(def);
    if (showToast) {
      showToast(`${key.toUpperCase()} reset to original defaults.`, 'info');
    }
  };

  return (
    <div className="adm-cms-container" style={{ padding: '4px' }}>
      {/* Sub-navigation tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setActiveSubTab('header')}
          className={`adm-btn-action ${activeSubTab === 'header' ? 'is-active' : ''}`}
          style={{
            background: activeSubTab === 'header' ? '#ec1d24' : '#f8fafc',
            color: activeSubTab === 'header' ? '#fff' : '#334155',
            borderColor: activeSubTab === 'header' ? '#ec1d24' : '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <FaBullhorn />
          <span>Header & Navbar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('homepage')}
          className={`adm-btn-action ${activeSubTab === 'homepage' ? 'is-active' : ''}`}
          style={{
            background: activeSubTab === 'homepage' ? '#ec1d24' : '#f8fafc',
            color: activeSubTab === 'homepage' ? '#fff' : '#334155',
            borderColor: activeSubTab === 'homepage' ? '#ec1d24' : '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <FaCompass />
          <span>Hero & Homepage Banners</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('footer')}
          className={`adm-btn-action ${activeSubTab === 'footer' ? 'is-active' : ''}`}
          style={{
            background: activeSubTab === 'footer' ? '#ec1d24' : '#f8fafc',
            color: activeSubTab === 'footer' ? '#fff' : '#334155',
            borderColor: activeSubTab === 'footer' ? '#ec1d24' : '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <FaMapPin />
          <span>Footer, Addresses & Socials</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('pages')}
          className={`adm-btn-action ${activeSubTab === 'pages' ? 'is-active' : ''}`}
          style={{
            background: activeSubTab === 'pages' ? '#ec1d24' : '#f8fafc',
            color: activeSubTab === 'pages' ? '#fff' : '#334155',
            borderColor: activeSubTab === 'pages' ? '#ec1d24' : '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontWeight: 600,
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <FaFileLines />
          <span>Pages, Creator Trips & Modals</span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: HEADER & NAVBAR
          ========================================================================= */}
      {activeSubTab === 'header' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Card: Announcement Bar Settings */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaBullhorn style={{ color: '#ec1d24' }} />
                Announcement Top Bar
              </h3>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={headerData?.announcement?.enabled !== false}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    announcement: { ...prev.announcement, enabled: e.target.checked }
                  }))}
                />
                <span>Active</span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Primary Announcement Text
                </label>
                <input
                  type="text"
                  value={headerData?.announcement?.text || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    announcement: { ...prev.announcement, text: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Highlight Badge 1
                  </label>
                  <input
                    type="text"
                    value={headerData?.announcement?.highlight1 || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      announcement: { ...prev.announcement, highlight1: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Highlight Badge 2
                  </label>
                  <input
                    type="text"
                    value={headerData?.announcement?.highlight2 || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      announcement: { ...prev.announcement, highlight2: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Action Button Label
                </label>
                <input
                  type="text"
                  value={headerData?.announcement?.actionText || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    announcement: { ...prev.announcement, actionText: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Navbar & Branding */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaGlobe style={{ color: '#ec1d24' }} />
              Navbar & Brand Identity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Brand Display Name
                </label>
                <input
                  type="text"
                  value={headerData?.navbar?.brandName || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    navbar: { ...prev.navbar, brandName: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <ImageUploadField
                label="Brand Logo Image URL"
                value={headerData?.navbar?.logoUrl}
                onChange={(newUrl) => setHeaderData(prev => ({
                  ...prev,
                  navbar: { ...prev.navbar, logoUrl: newUrl }
                }))}
                placeholder="/indiatournewlogo.jpg"
                helperText="Upload PNG, JPG, SVG or WEBP logo file"
                showToast={showToast}
              />

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Support Contact Phone (Talk to Expert)
                </label>
                <input
                  type="text"
                  value={headerData?.navbar?.contactPhone || ''}
                  onChange={(e) => setHeaderData(prev => ({
                    ...prev,
                    navbar: { ...prev.navbar, contactPhone: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Tab 1 Label
                  </label>
                  <input
                    type="text"
                    value={headerData?.navbar?.packagesLabel || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      navbar: { ...prev.navbar, packagesLabel: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Tab 2 Label
                  </label>
                  <input
                    type="text"
                    value={headerData?.navbar?.groupTripsLabel || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      navbar: { ...prev.navbar, groupTripsLabel: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Tab 3 Label
                  </label>
                  <input
                    type="text"
                    value={headerData?.navbar?.creatorTripsLabel || ''}
                    onChange={(e) => setHeaderData(prev => ({
                      ...prev,
                      navbar: { ...prev.navbar, creatorTripsLabel: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => handleReset('header')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <FaRotateLeft />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('header')}
              disabled={savingKey === 'header'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#ec1d24',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(236,29,36,0.3)'
              }}
            >
              <FaFloppyDisk />
              <span>{savingKey === 'header' ? 'Saving...' : 'Save & Publish Header'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: HERO & HOMEPAGE BANNERS
          ========================================================================= */}
      {activeSubTab === 'homepage' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Card: Hero Carousel & Persona Headline */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaCompass style={{ color: '#ec1d24' }} />
              Hero Headline & Rotating Words
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Primary Headline Prefix
                </label>
                <input
                  type="text"
                  value={homepageData?.hero?.line1 || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, line1: e.target.value }
                  }))}
                  placeholder="Experiences for"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Rotating Audience Words (Comma separated)
                </label>
                <input
                  type="text"
                  value={Array.isArray(homepageData?.hero?.audienceWords) ? homepageData.hero.audienceWords.join(', ') : ''}
                  onChange={(e) => {
                    const words = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setHomepageData(prev => ({
                      ...prev,
                      hero: { ...prev.hero, audienceWords: words }
                    }));
                  }}
                  placeholder="Travellers, Adventurers, Explorers, Families, Couples, Solo Travelers"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
                <span style={{ fontSize: '11px', color: '#64748b' }}>Cycles dynamically beside the strike-through Tourist icon</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Search Bar Placeholder
                </label>
                <input
                  type="text"
                  value={homepageData?.search?.placeholder || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    search: { ...prev.search, placeholder: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Seasonal Sale Banner */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaPercent style={{ color: '#ec1d24' }} />
              Seasonal Promo Sale Banner
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Sale Badge Tag
                  </label>
                  <input
                    type="text"
                    value={homepageData?.saleBanner?.badge || ''}
                    onChange={(e) => setHomepageData(prev => ({
                      ...prev,
                      saleBanner: { ...prev.saleBanner, badge: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Coupon Code
                  </label>
                  <input
                    type="text"
                    value={homepageData?.saleBanner?.code || ''}
                    onChange={(e) => setHomepageData(prev => ({
                      ...prev,
                      saleBanner: { ...prev.saleBanner, code: e.target.value }
                    }))}
                    placeholder="WINTER2026"
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Banner Title
                </label>
                <input
                  type="text"
                  value={homepageData?.saleBanner?.title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    saleBanner: { ...prev.saleBanner, title: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Banner Subtitle / Discount Details
                </label>
                <input
                  type="text"
                  value={homepageData?.saleBanner?.subtitle || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    saleBanner: { ...prev.saleBanner, subtitle: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <ImageUploadField
                label="Background Banner Image URL"
                value={homepageData?.saleBanner?.image}
                onChange={(newUrl) => setHomepageData(prev => ({
                  ...prev,
                  saleBanner: { ...prev.saleBanner, image: newUrl }
                }))}
                placeholder="https://images.unsplash.com/..."
                helperText="High-res landscape photography"
                showToast={showToast}
              />
            </div>
          </div>

          {/* Card: Community Group Banner */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaImage style={{ color: '#ec1d24' }} />
              Community Mid-Page Banner
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <ImageUploadField
                label="Desktop Banner Graphic URL"
                value={homepageData?.groupBanner?.desktopImg}
                onChange={(newUrl) => setHomepageData(prev => ({
                  ...prev,
                  groupBanner: { ...prev.groupBanner, desktopImg: newUrl }
                }))}
                placeholder="https://..."
                helperText="Aspect ratio ~ 4:1 (Desktop viewport)"
                showToast={showToast}
              />

              <ImageUploadField
                label="Mobile Banner Graphic URL"
                value={homepageData?.groupBanner?.mobileImg}
                onChange={(newUrl) => setHomepageData(prev => ({
                  ...prev,
                  groupBanner: { ...prev.groupBanner, mobileImg: newUrl }
                }))}
                placeholder="https://..."
                helperText="Aspect ratio ~ 16:9 or 4:3 (Mobile screens)"
                showToast={showToast}
              />

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Banner Alt / Label
                </label>
                <input
                  type="text"
                  value={homepageData?.groupBanner?.title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    groupBanner: { ...prev.groupBanner, title: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Why Choose Us (Trust Pillars) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaShieldHalved style={{ color: '#ec1d24' }} />
              Why Travel With Us (Pillars)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Section Heading
                </label>
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.heading || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, heading: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Pillar 1 Title & Description
                </label>
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar1Title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar1Title: e.target.value }
                  }))}
                  placeholder="Pillar 1 Title"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar1Desc || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar1Desc: e.target.value }
                  }))}
                  placeholder="Pillar 1 Description"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Pillar 2 Title & Description
                </label>
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar2Title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar2Title: e.target.value }
                  }))}
                  placeholder="Pillar 2 Title"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar2Desc || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar2Desc: e.target.value }
                  }))}
                  placeholder="Pillar 2 Description"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Pillar 3 Title & Description
                </label>
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar3Title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar3Title: e.target.value }
                  }))}
                  placeholder="Pillar 3 Title"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar3Desc || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar3Desc: e.target.value }
                  }))}
                  placeholder="Pillar 3 Description"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Pillar 4 Title & Description
                </label>
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar4Title || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar4Title: e.target.value }
                  }))}
                  placeholder="Pillar 4 Title"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={homepageData?.whyChooseUs?.pillar4Desc || ''}
                  onChange={(e) => setHomepageData(prev => ({
                    ...prev,
                    whyChooseUs: { ...prev.whyChooseUs, pillar4Desc: e.target.value }
                  }))}
                  placeholder="Pillar 4 Description"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              {/* 4 Live Stats Strip */}
              <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                  Homepage Trust Metrics / Stats Strip
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat1Value || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat1Value: e.target.value }
                      }))}
                      placeholder="15,000+"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '2px' }}
                    />
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat1Label || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat1Label: e.target.value }
                      }))}
                      placeholder="Happy Explorers"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat2Value || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat2Value: e.target.value }
                      }))}
                      placeholder="4.9 / 5.0"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '2px' }}
                    />
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat2Label || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat2Label: e.target.value }
                      }))}
                      placeholder="Average Traveler Rating"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat3Value || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat3Value: e.target.value }
                      }))}
                      placeholder="250+"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '2px' }}
                    />
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat3Label || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat3Label: e.target.value }
                      }))}
                      placeholder="Curated Itineraries"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat4Value || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat4Value: e.target.value }
                      }))}
                      placeholder="98%"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', marginBottom: '2px' }}
                    />
                    <input
                      type="text"
                      value={homepageData?.whyChooseUs?.stat4Label || ''}
                      onChange={(e) => setHomepageData(prev => ({
                        ...prev,
                        whyChooseUs: { ...prev.whyChooseUs, stat4Label: e.target.value }
                      }))}
                      placeholder="Repeat & Referral Rate"
                      className="adm-input"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => handleReset('homepage')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <FaRotateLeft />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('homepage')}
              disabled={savingKey === 'homepage'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#ec1d24',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(236,29,36,0.3)'
              }}
            >
              <FaFloppyDisk />
              <span>{savingKey === 'homepage' ? 'Saving...' : 'Save & Publish Homepage'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: FOOTER, ADDRESSES, WHATSAPP & SOCIALS
          ========================================================================= */}
      {activeSubTab === 'footer' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Card: Floating Contact CTA Card (Above Footer) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaWhatsapp style={{ color: '#25d366' }} />
              Floating Contact CTA Card
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  CTA Heading
                </label>
                <input
                  type="text"
                  value={footerData?.contactCta?.heading || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contactCta: { ...prev.contactCta, heading: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Display Phone Number
                </label>
                <input
                  type="text"
                  value={footerData?.contactCta?.phone || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contactCta: { ...prev.contactCta, phone: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  WhatsApp Direct Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={footerData?.contactCta?.whatsapp || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contactCta: { ...prev.contactCta, whatsapp: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Default WhatsApp Message
                </label>
                <input
                  type="text"
                  value={footerData?.contactCta?.whatsappMessage || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    contactCta: { ...prev.contactCta, whatsappMessage: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Corporate Office Address (Fixed Exact Key Alignment) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaMapPin style={{ color: '#ec1d24' }} />
              Corporate Office Address
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Branch Heading
                </label>
                <input
                  type="text"
                  value={footerData?.corporateOffice?.heading || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    corporateOffice: { ...prev.corporateOffice, heading: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={footerData?.corporateOffice?.line1 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    corporateOffice: { ...prev.corporateOffice, line1: e.target.value }
                  }))}
                  placeholder="Shop No 7, Paras Apartment, Hospital Rd,"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Address Line 2 & Line 3
                </label>
                <input
                  type="text"
                  value={footerData?.corporateOffice?.line2 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    corporateOffice: { ...prev.corporateOffice, line2: e.target.value }
                  }))}
                  placeholder="opposite Ganatra Hospital, Lal Tekri,"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px' }}
                />
                <input
                  type="text"
                  value={footerData?.corporateOffice?.line3 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    corporateOffice: { ...prev.corporateOffice, line3: e.target.value }
                  }))}
                  placeholder="Bhuj, Gujarat 370001"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={footerData?.corporateOffice?.mapUrl || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    corporateOffice: { ...prev.corporateOffice, mapUrl: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Main Branch Address (Fixed Exact Key Alignment) */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaMapPin style={{ color: '#ec1d24' }} />
              Main Branch Address
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Branch Heading
                </label>
                <input
                  type="text"
                  value={footerData?.mainBranch?.heading || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    mainBranch: { ...prev.mainBranch, heading: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={footerData?.mainBranch?.line1 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    mainBranch: { ...prev.mainBranch, line1: e.target.value }
                  }))}
                  placeholder="W35P+M9P, Road, Alipur"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Address Line 2 & Line 3
                </label>
                <input
                  type="text"
                  value={footerData?.mainBranch?.line2 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    mainBranch: { ...prev.mainBranch, line2: e.target.value }
                  }))}
                  placeholder="Ibrahimpur Urf Ikk, Haridwar"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', marginBottom: '6px' }}
                />
                <input
                  type="text"
                  value={footerData?.mainBranch?.line3 || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    mainBranch: { ...prev.mainBranch, line3: e.target.value }
                  }))}
                  placeholder="Uttarakhand 249402"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={footerData?.mainBranch?.mapUrl || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    mainBranch: { ...prev.mainBranch, mapUrl: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Social Media & Newsletter */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaGlobe style={{ color: '#ec1d24' }} />
              Social Media & Copyright
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={footerData?.socialLinks?.instagram || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={footerData?.socialLinks?.youtube || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, youtube: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={footerData?.copyright?.text || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    copyright: { ...prev.copyright, text: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Tagline (e.g. Made with ❤️ in India)
                </label>
                <input
                  type="text"
                  value={footerData?.copyright?.tagline || ''}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev,
                    copyright: { ...prev.copyright, tagline: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => handleReset('footer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <FaRotateLeft />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('footer')}
              disabled={savingKey === 'footer'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#ec1d24',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(236,29,36,0.3)'
              }}
            >
              <FaFloppyDisk />
              <span>{savingKey === 'footer' ? 'Saving...' : 'Save & Publish Footer'}</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 4: PAGES, CREATOR TRIPS & MODALS
          ========================================================================= */}
      {activeSubTab === 'pages' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          
          {/* Card: Creator Trips Page Details */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaUserTie style={{ color: '#ec1d24' }} />
              Creator Trips Hero & Lead Story
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Creator Name
                </label>
                <input
                  type="text"
                  value={pagesData?.creatorPage?.creatorName || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    creatorPage: { ...prev.creatorPage, creatorName: e.target.value }
                  }))}
                  placeholder="Ananya Sharma"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Hero Expedition Title
                </label>
                <input
                  type="text"
                  value={pagesData?.creatorPage?.heroTitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    creatorPage: { ...prev.creatorPage, heroTitle: e.target.value }
                  }))}
                  placeholder="Experience Spiti Valley in Winter"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Subtitle / Sub-heading
                </label>
                <input
                  type="text"
                  value={pagesData?.creatorPage?.heroSubtitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    creatorPage: { ...prev.creatorPage, heroSubtitle: e.target.value }
                  }))}
                  placeholder="Travel like Ananya Sharma"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  About Itinerary Narrative
                </label>
                <textarea
                  rows={4}
                  value={pagesData?.creatorPage?.aboutText || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    creatorPage: { ...prev.creatorPage, aboutText: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Host CTA Section Heading
                </label>
                <input
                  type="text"
                  value={pagesData?.creatorPage?.hostHeading || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    creatorPage: { ...prev.creatorPage, hostHeading: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Group Trips & Tour Packages Headers */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaFileLines style={{ color: '#ec1d24' }} />
              Group Trips & Packages Page Headers
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Group Trips Page - Exclusive Banner Title
                </label>
                <input
                  type="text"
                  value={pagesData?.groupPage?.exclusiveTitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    groupPage: { ...prev.groupPage, exclusiveTitle: e.target.value }
                  }))}
                  placeholder="Creator-Led Group Expeditions"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Group Trips Page - Exclusive Banner Description
                </label>
                <textarea
                  rows={3}
                  value={pagesData?.groupPage?.exclusiveDesc || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    groupPage: { ...prev.groupPage, exclusiveDesc: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Group Trips Page - Badge Text
                </label>
                <input
                  type="text"
                  value={pagesData?.groupPage?.badgeText || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    groupPage: { ...prev.groupPage, badgeText: e.target.value }
                  }))}
                  placeholder="Exclusive Expeditions"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Tour Packages Page - Hero Title
                </label>
                <input
                  type="text"
                  value={pagesData?.packagesPage?.heroTitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    packagesPage: { ...prev.packagesPage, heroTitle: e.target.value }
                  }))}
                  placeholder="Handcrafted Tour Packages"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: No Cost EMI Modal Content */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaPercent style={{ color: '#ec1d24' }} />
              No Cost EMI Modal Content
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Modal Title
                </label>
                <input
                  type="text"
                  value={pagesData?.emiModal?.title || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, title: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Modal Subtitle
                </label>
                <input
                  type="text"
                  value={pagesData?.emiModal?.subtitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, subtitle: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Point 1 Title & Description
                </label>
                <input
                  type="text"
                  value={pagesData?.emiModal?.point1Title || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, point1Title: e.target.value }
                  }))}
                  placeholder="Up to 6 Months Zero Interest"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={pagesData?.emiModal?.point1Desc || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, point1Desc: e.target.value }
                  }))}
                  placeholder="No hidden charges..."
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Point 2 Title & Description
                </label>
                <input
                  type="text"
                  value={pagesData?.emiModal?.point2Title || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, point2Title: e.target.value }
                  }))}
                  placeholder="No Credit Card Needed"
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', marginBottom: '4px' }}
                />
                <input
                  type="text"
                  value={pagesData?.emiModal?.point2Desc || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, point2Desc: e.target.value }
                  }))}
                  placeholder="Eligible via UPI, debit card..."
                  className="adm-input"
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  WhatsApp Button Text
                </label>
                <input
                  type="text"
                  value={pagesData?.emiModal?.whatsappButtonText || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    emiModal: { ...prev.emiModal, whatsappButtonText: e.target.value }
                  }))}
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Card: About Us Page & Company Mission */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaCompass style={{ color: '#ec1d24' }} />
              About Us Page &amp; Company Mission
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Page Heading / Title
                </label>
                <input
                  type="text"
                  value={pagesData?.aboutUs?.title || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    aboutUs: { ...prev.aboutUs, title: e.target.value }
                  }))}
                  placeholder="About India Tourism Live Travels"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={pagesData?.aboutUs?.subtitle || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    aboutUs: { ...prev.aboutUs, subtitle: e.target.value }
                  }))}
                  placeholder="Crafting unforgettable adventures across India & beyond"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={pagesData?.aboutUs?.badge || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    aboutUs: { ...prev.aboutUs, badge: e.target.value }
                  }))}
                  placeholder="Our Story & Purpose"
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <ImageUploadField
                label="About Us Banner Image URL"
                value={pagesData?.aboutUs?.image}
                onChange={(newUrl) => setPagesData(prev => ({
                  ...prev,
                  aboutUs: { ...prev.aboutUs, image: newUrl }
                }))}
                placeholder="https://..."
                helperText="Upload or paste image URL for the About Us modal banner"
                showToast={showToast}
              />

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Company Journey / Story
                </label>
                <textarea
                  rows={3}
                  value={pagesData?.aboutUs?.story || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    aboutUs: { ...prev.aboutUs, story: e.target.value }
                  }))}
                  placeholder="Describe your company background and milestones..."
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Mission Statement
                </label>
                <textarea
                  rows={3}
                  value={pagesData?.aboutUs?.mission || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    aboutUs: { ...prev.aboutUs, mission: e.target.value }
                  }))}
                  placeholder="Describe your commitment to travelers and communities..."
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Terms & Conditions Policy */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaShieldHalved style={{ color: '#ec1d24' }} />
              Terms &amp; Conditions Policy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Policy Title
                  </label>
                  <input
                    type="text"
                    value={pagesData?.termsAndConditions?.title || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      termsAndConditions: { ...prev.termsAndConditions, title: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Last Updated
                  </label>
                  <input
                    type="text"
                    value={pagesData?.termsAndConditions?.lastUpdated || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      termsAndConditions: { ...prev.termsAndConditions, lastUpdated: e.target.value }
                    }))}
                    placeholder="October 2026"
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Policy Content / Clauses (One clause per line)
                </label>
                <textarea
                  rows={6}
                  value={pagesData?.termsAndConditions?.content || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    termsAndConditions: { ...prev.termsAndConditions, content: e.target.value }
                  }))}
                  placeholder="Enter policy terms and guidelines..."
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Privacy Policy */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaShieldHalved style={{ color: '#ec1d24' }} />
              Privacy Policy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Policy Title
                  </label>
                  <input
                    type="text"
                    value={pagesData?.privacyPolicy?.title || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      privacyPolicy: { ...prev.privacyPolicy, title: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Last Updated
                  </label>
                  <input
                    type="text"
                    value={pagesData?.privacyPolicy?.lastUpdated || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      privacyPolicy: { ...prev.privacyPolicy, lastUpdated: e.target.value }
                    }))}
                    placeholder="October 2026"
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Privacy Clauses / Content (One per line)
                </label>
                <textarea
                  rows={6}
                  value={pagesData?.privacyPolicy?.content || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    privacyPolicy: { ...prev.privacyPolicy, content: e.target.value }
                  }))}
                  placeholder="Enter privacy commitments..."
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Card: Cancellation & Refund Policy */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FaPercent style={{ color: '#ec1d24' }} />
              Cancellation &amp; Refund Policy
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Policy Title
                  </label>
                  <input
                    type="text"
                    value={pagesData?.cancellationPolicy?.title || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      cancellationPolicy: { ...prev.cancellationPolicy, title: e.target.value }
                    }))}
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                    Last Updated
                  </label>
                  <input
                    type="text"
                    value={pagesData?.cancellationPolicy?.lastUpdated || ''}
                    onChange={(e) => setPagesData(prev => ({
                      ...prev,
                      cancellationPolicy: { ...prev.cancellationPolicy, lastUpdated: e.target.value }
                    }))}
                    placeholder="October 2026"
                    className="adm-input"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Refund Rules / Clauses (One per line)
                </label>
                <textarea
                  rows={6}
                  value={pagesData?.cancellationPolicy?.content || ''}
                  onChange={(e) => setPagesData(prev => ({
                    ...prev,
                    cancellationPolicy: { ...prev.cancellationPolicy, content: e.target.value }
                  }))}
                  placeholder="Enter cancellation milestones and refund rules..."
                  className="adm-input"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={() => handleReset('pages')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <FaRotateLeft />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave('pages')}
              disabled={savingKey === 'pages'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '8px',
                border: 'none',
                background: '#ec1d24',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(236,29,36,0.3)'
              }}
            >
              <FaFloppyDisk />
              <span>{savingKey === 'pages' ? 'Saving...' : 'Save & Publish Pages'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
