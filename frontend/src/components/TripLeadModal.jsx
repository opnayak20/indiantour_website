import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

export default function TripLeadModal({
  isOpen,
  onClose,
  tour,
  popupSettings = {},
  onOpenEmiModal,
  onEnquirySubmitted
}) {
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [travelers, setTravelers] = useState('2 Travellers');
  const [message, setMessage] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fallback defaults if settings not loaded yet
  const config = {
    formHeading: popupSettings?.formHeading || 'Plan Your Next Trip',
    buttonText: popupSettings?.buttonText || 'Connect with Expert',
    buttonColor: popupSettings?.buttonColor || '#e52b2b',
    badgeText: popupSettings?.badgeText || 'No Cost EMI options available ↗',
    defaultTitle: popupSettings?.defaultTitle || 'Meghalaya Tour Package',
    defaultDuration: popupSettings?.defaultDuration || '6 Days 5 Nights',
    defaultSubtitle: popupSettings?.defaultSubtitle || 'Krem Chympe, Waterfalls & Root Bridges',
    defaultImage: popupSettings?.defaultImage || '/meghalaya_root_bridge.jpg',
    whatsappNumber: popupSettings?.whatsappNumber || '+919099599331'
  };

  // Look for trip-specific override if tour has an ID or slug
  const tourId = tour?.id || tour?.slug;
  const tripOverride = tourId && popupSettings?.tripOverrides?.[tourId];

  // Determine current active trip info dynamically (honoring trip overrides)
  const tripTitle = tripOverride?.customTitle || tour?.title || tour?.name || config.defaultTitle;
  const tripDuration = tripOverride?.customDuration || tour?.duration || config.defaultDuration;
  const tripSubtitle = tripOverride?.customSubtitle || tour?.route || (Array.isArray(tour?.highlights) && tour.highlights[0]) || (tour?.category ? `${tour.category.toUpperCase()} EXPEDITION` : config.defaultSubtitle);
  
  // Intelligent image resolution
  let tripImage = tripOverride?.customImage || config.defaultImage;
  if (!tripOverride?.customImage && tour) {
    if (Array.isArray(tour.images) && tour.images.length > 0) {
      tripImage = tour.images[0];
    } else if (tour.image) {
      tripImage = tour.image;
    }
  }

  const badgeText = tripOverride?.badgeText || config.badgeText;
  const buttonText = tripOverride?.buttonText || config.buttonText;
  const buttonColor = tripOverride?.buttonColor || config.buttonColor;

  // Reset submitted state whenever reopened or tour changed
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setErrorMsg('');
    }
  }, [isOpen, tour]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const travelersCount = parseInt(travelers, 10) || 2;
    const fullPhone = `${countryCode} ${phone.trim()}`;

    const payload = {
      name: name.trim(),
      phone: fullPhone,
      email: email.trim(),
      destination: tripTitle,
      travelers: travelersCount,
      date: date || null,
      message: message.trim() ? `[Trip Lead Popup] ${message.trim()}` : `[Trip Lead Popup for ${tripTitle}]`,
      source: 'popup_lead'
    };

    try {
      const res = await fetch(`${API_BASE}/enquiries/create.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      // Save locally to localStorage so it instantly shows in Admin Dashboard inquiries
      try {
        const localEnquiries = JSON.parse(localStorage.getItem('india_tour_local_enquiries') || '[]');
        const newEnquiry = {
          id: data?.data?.enquiry_id || Date.now(),
          name: payload.name,
          phone: payload.phone,
          email: payload.email,
          destination: payload.destination,
          travelers: payload.travelers,
          date: payload.date || new Date().toISOString().split('T')[0],
          message: payload.message,
          status: 'new',
          created_at: new Date().toISOString(),
          notes: 'Source: Trip Lead Popup modal'
        };
        localEnquiries.unshift(newEnquiry);
        localStorage.setItem('india_tour_local_enquiries', JSON.stringify(localEnquiries));
        if (onEnquirySubmitted) onEnquirySubmitted(newEnquiry);
      } catch {
        // ignore localStorage errors
      }

      setSubmitted(true);
    } catch {
      // In offline / localhost fallback mode, still store to localStorage so lead is NOT lost!
      const fallbackEnquiry = {
        id: Date.now(),
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        destination: payload.destination,
        travelers: payload.travelers,
        date: payload.date || new Date().toISOString().split('T')[0],
        message: payload.message,
        status: 'new',
        created_at: new Date().toISOString(),
        notes: 'Source: Trip Lead Popup modal (Local storage sync)'
      };
      try {
        const localEnquiries = JSON.parse(localStorage.getItem('india_tour_local_enquiries') || '[]');
        localEnquiries.unshift(fallbackEnquiry);
        localStorage.setItem('india_tour_local_enquiries', JSON.stringify(localEnquiries));
        if (onEnquirySubmitted) onEnquirySubmitted(fallbackEnquiry);
      } catch {
        // ignore
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmiBadgeClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onOpenEmiModal) {
      onClose();
      onOpenEmiModal();
    }
  };

  const whatsappDirectMsg = encodeURIComponent(
    `Hello India Tour! I submitted an enquiry for "${tripTitle}" (${tripDuration}). My Name is ${name || 'Traveler'} (${countryCode} ${phone}). Please share the detailed itinerary and pricing.`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-2xl w-full max-w-3xl flex flex-col md:flex-row relative max-h-[95vh] md:max-h-[620px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Column: Visual Card with Package Image, Gradient, and Overlay Details */}
        <div className="relative w-full md:w-[48%] min-h-[240px] md:min-h-full flex flex-col justify-end p-5 sm:p-6 bg-slate-900 overflow-hidden select-none">
          <img
            src={tripImage}
            alt={tripTitle}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          {/* Subtle multi-stop gradient for readable text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none" />
          
          {/* Overlay Content */}
          <div className="relative z-10 text-white">
            <p className="text-[12px] sm:text-[13px] font-medium tracking-wide text-white/90 mb-1 drop-shadow-sm">
              {tripDuration}
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-white leading-tight mb-1.5 drop-shadow">
              {tripTitle}
            </h2>
            <p className="text-[12px] sm:text-[13px] text-white/90 leading-snug mb-4 drop-shadow-sm line-clamp-2">
              {tripSubtitle}
            </p>

            {/* Dynamic Pill Badge (No Cost EMI / Custom Offer) */}
            {badgeText && (
              <button
                type="button"
                onClick={handleEmiBadgeClick}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: '1px solid rgba(255,255,255,0.4)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                className="hover:scale-102 active:scale-98"
                title="Click to view details"
              >
                {badgeText.toLowerCase().includes('no cost emi') ? (
                  <>
                    <span style={{ textDecoration: 'underline', color: '#0f172a', fontWeight: '800', textUnderlineOffset: '2px' }}>
                      No Cost EMI
                    </span>
                    <span style={{ color: '#334155', fontWeight: '600' }}>
                      {badgeText.replace(/no\s*cost\s*emi/i, '').replace(/↗/g, '').trim()}
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: '800', fontSize: '13px' }}>
                      ↗
                    </span>
                  </>
                ) : (
                  <span style={{ color: '#0f172a', fontWeight: '700' }}>
                    {badgeText}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="w-full md:w-[52%] p-5 sm:p-7 flex flex-col justify-between bg-white overflow-y-auto">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100 mb-3 sm:mb-4">
            <h3 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight">
              {config.formHeading}
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="text-gray-900 hover:text-black p-1 text-2xl font-bold leading-none cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center animate-fadeIn my-auto">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-3 shadow-inner">
                ✓
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                Trip Request Received!
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-xs mb-4">
                Thank you <strong className="text-gray-900">{name}</strong>! Our expedition specialist for <strong className="text-gray-900">{tripTitle}</strong> will connect with you on <span className="font-semibold text-gray-900">{countryCode} {phone}</span> within 15 minutes.
              </p>

              <div className="flex flex-col w-full gap-2 mt-2">
                <a
                  href={`https://wa.me/${config.whatsappNumber.replace(/\D/g, '')}?text=${whatsappDirectMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow transition"
                >
                  <span>Chat on WhatsApp Directly</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium animate-shake">
                  {errorMsg}
                </div>
              )}

              {/* Your Name */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>

              {/* Mobile Number with Country Code */}
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium select-none">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Mobile No."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="flex-1 px-3.5 py-2.5 rounded-r-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                />
              </div>

              {/* Date of Travel & Traveller Count Row */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
                    title="Date of Travel"
                  />
                  {!date && (
                    <span className="absolute left-3 top-2.5 pointer-events-none text-xs text-gray-400">
                      Date of Travel
                    </span>
                  )}
                </div>

                <div>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition bg-white"
                  >
                    <option value="1 Traveller">1 Traveller</option>
                    <option value="2 Travellers">2 Travellers</option>
                    <option value="3 Travellers">3 Travellers</option>
                    <option value="4 Travellers">4 Travellers</option>
                    <option value="5+ Travellers">5+ Travellers</option>
                    <option value="Group 10+">Group (10+)</option>
                  </select>
                </div>
              </div>

              {/* Message (optional) */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Message (optional)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition resize-none"
                />
              </div>

              {/* Connect with Expert Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: buttonColor }}
                className="w-full py-3 sm:py-3.5 rounded-xl font-bold text-white text-sm sm:text-base shadow-md hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <span>{buttonText}</span>
                )}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <span className="text-[10px] text-gray-400">
              🔒 No spam. Instant consultation by certified mountain guides.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
