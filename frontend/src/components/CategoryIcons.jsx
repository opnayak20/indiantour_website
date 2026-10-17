import React from 'react';

export const CategoryIcon = ({ slug, className = "w-7 h-7" }) => {
  const props = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: className
  };

  switch (slug) {
    case 'ladakh':
      return (
        <svg {...props}>
          <path d="M6 42l10-14 6 7 M38 42l-8-11-5 6" />
          <path d="M12 42h24v-3H12z M15 39h18v-3H15z" />
          <path d="M17 36c0-5 3.5-9 7-9s7 4 7 9z" />
          <path d="M22 27h4v-3h-4z" />
          <path d="M24 24V10" />
          <path d="M21 20h6 M22 17h4 M22.5 14h3" />
          <circle cx="24" cy="8" r="2" />
          <path d="M22 6c0 1.5 1 2.5 2 2.5s2-1 2-2.5" />
        </svg>
      );

    case 'meghalaya':
      return (
        <svg {...props}>
          <path d="M6 42V18c2 2 5 2 7 0v24 M42 42V18c-2 2-5 2-7 0v24" />
          <path d="M11 21c7 3 19 3 26 0 M12 25c6 4 18 4 24 0" />
          <path d="M20 25v17 M24 24v18 M28 25v17" />
          <path d="M17 42c2-1 4-1 6 0s4 1 6 0 M21 39c1-.5 2-.5 3 0" />
          <path d="M8 12c3-1 6-1 9 0 M31 12c3-1 6-1 9 0" />
        </svg>
      );

    case 'vietnam':
      return (
        <svg {...props}>
          <path d="M7 23c11-5 23-5 34 0 M8 27c10-4 22-4 32 0" />
          <path d="M15 21v4 M21 20v4 M27 20v4 M33 21v4" />
          <path d="M13 38c1-4 3-8 6-11 M12 32c3-2 6-2 8 0 M17 42c2-5 4-9 8-11" />
          <path d="M35 38c-1-4-3-8-6-11 M36 32c-3-2-6-2-8 0 M31 42c-2-5-4-9-8-11" />
          <path d="M9 42c2-1 4-1 6 0 M29 42c3-1 6-1 9 0" />
        </svg>
      );

    case 'bali':
      return (
        <svg {...props}>
          <path d="M14 22l10-12 10 12" />
          <path d="M19 42H9V37h3v-6H9v-6h4v-6h-3V11l9 11v20z" />
          <path d="M29 42h10V37h-3v-6h3v-6h-4v-6h3V11l-9 11v20z" />
          <path d="M19 42h10" />
          <path d="M24 10V6 M21 7c3-1 3-1 6 0" />
        </svg>
      );

    case 'spiti-valley':
      return (
        <svg {...props}>
          <path d="M6 42l15-9 12 3 9-5" />
          <path d="M18 33h14v-6H18z M21 27h9v-5H21z M23 22h5v-4H23z" />
          <path d="M25 18v-4 M25 14l3-2-3-2" />
          <path d="M8 28l9-12 7 9 M31 22l6-9 5 8" />
          <path d="M7 16c2-1 4-1 6 0" />
        </svg>
      );

    case 'maldives':
      return (
        <svg {...props}>
          <path d="M15 40v-8 M21 40v-8 M27 40v-8 M33 40v-8" />
          <path d="M11 32h26" />
          <path d="M14 32V24l10-8 10 8v8z" />
          <path d="M20 27h8" />
          <path d="M5 41c3 1 6 1 9 0s6-1 9 0 6 1 9 0 6-1 9 0" />
          <path d="M36 32c1-7 4-13 7-16 M40 14c-3-3-6-2-8 0 M43 16c2-4 0-7-3-7 M44 18c3-1 5-4 4-7" />
        </svg>
      );

    case 'thailand':
      return (
        <svg {...props}>
          <path d="M8 32l16-12 16 12 M12 26l12-9 12 9 M16 20l8-6 8 6" />
          <path d="M8 32c-2-2-2-4 0-5 M40 32c2-2 2-4 0-5 M12 26c-2-2-2-4 0-4 M36 26c2-2 2-4 0-4" />
          <path d="M24 14V6 M23 7h2 M22 10h4" />
          <path d="M14 42h20 M17 42V32 M31 42V32 M21 42v-5a3 3 0 016 0v5" />
        </svg>
      );

    case 'north-east':
      return (
        <svg {...props}>
          <path d="M28 26c-3-5-6-8-12-8h-6l10 8z M16 18c-3-4-3-8 4-9 6 0 9 4 11 9" />
          <circle cx="16" cy="20" r="1.5" />
          <path d="M6 42h36" />
          <path d="M8 42l10-10 8 7 14-12" />
          <path d="M12 42V30 M36 42V28" />
        </svg>
      );

    case 'kashmir':
      return (
        <svg {...props}>
          <path d="M8 20l9-10 8 9 9-11 8 12" />
          <path d="M14 24h18l-3-7H17z" />
          <path d="M17 24v5 M29 24v5 M21 24v5 M25 24v5" />
          <path d="M6 31c6 3 24 3 32-2l4-4-10 1H10z" />
          <path d="M9 38c3 1 6 1 9 0s6-1 9 0 6 1 9 0 M14 42c3 1 6 1 9 0s6-1 9 0" />
        </svg>
      );

    case 'manali':
      return (
        <svg {...props}>
          <path d="M6 40l14-22 8 11 14-17 4 28z M17 23l3 5 4-3 M36 21l3 4 3-2" />
          <path d="M11 40v-4 M11 36l3-3h-2l2-3-2 1z" />
          <circle cx="28" cy="7" r="3" />
          <path d="M28 2V4 M28 10V12 M23 7h2 M31 7h2" />
          <path d="M6 40h36" />
        </svg>
      );

    case 'goa':
      return (
        <svg {...props}>
          <path d="M12 40c2-10 6-18 12-22 M14 40c2-9 5-17 10-21" />
          <path d="M24 18c-5-4-9-2-12 0 M24 18c-3-6-7-8-12-6 M24 18c5-6 10-5 13-2 M24 18c5-2 9 0 11 4 M24 18c-1-7 2-10 6-11" />
          <path d="M18 42c3 1 6 1 9 0s6-1 9 0 M25 38c2 .8 4 .8 6 0" />
          <circle cx="35" cy="12" r="3.5" />
        </svg>
      );

    case 'malaysia':
      return (
        <svg {...props}>
          <path d="M14 42V18h2v-4h2V10h1V6l1-2 1 2v4h1v4h2v4h2v24" />
          <path d="M27 42V18h2v-4h2V10h1V6l1-2 1 2v4h1v4h2v4h2v24" />
          <path d="M23 26h6 M23 29h6" />
          <path d="M10 42h30" />
          <path d="M20 4V1 M31 4V1" />
        </svg>
      );

    case 'georgia':
      return (
        <svg {...props}>
          <path d="M6 40l14-20 7 9 15-17 M17 24l3 4 3-3" />
          <path d="M17 40V30l7-5 7 5v10z" />
          <path d="M21 25V20l3-4 3 4v5z" />
          <path d="M24 16V12 M22 14h4" />
          <path d="M33 40V28l3-3 3 3v12z M36 25v-2 M35 24h2" />
          <path d="M6 40h36" />
        </svg>
      );

    case 'jaisalmer':
      return (
        <svg {...props}>
          <path d="M28 20c2-2 3-5 5-4s1 3-1 4" />
          <path d="M28 20c-3 4-2 7 0 10" />
          <path d="M28 30c2-4 6-4 8-1s4 0 5 3" />
          <path d="M28 32v8 M31 32v8 M36 31v9 M39 31v9" />
          <path d="M6 42c8-4 16-2 24-1s12-3 14-1 M6 38c7-3 15-1 22 0" />
          <circle cx="14" cy="13" r="3.5" />
        </svg>
      );

    case 'kerala':
      return (
        <svg {...props}>
          <path d="M10 32c4-7 20-7 24 0" />
          <path d="M8 32c4 4 24 4 28 0l2-2H6z" />
          <path d="M16 28h12 M20 28v4 M24 28v4" />
          <path d="M6 39c4 1 8 1 12 0s8-1 12 0 8 1 12 0" />
          <path d="M38 32c-1-8 2-15 4-18 M38 14c-4-2-7-1-9 2 M39 13c-1-4 2-7 6-6 M41 14c4-2 6 0 7 4" />
        </svg>
      );

    case 'andaman':
      return (
        <svg {...props}>
          <circle cx="22" cy="19" r="3" />
          <path d="M19 22l-6 5 4 4-5 6" />
          <path d="M17 18l-5 4" />
          <path d="M12 37l-4 3 5-1z M16 35l-3 4 4-2z" />
          <path d="M8 12c3 1 6 1 9 0s6-1 9 0 6 1 9 0" />
          <circle cx="28" cy="13" r="1.5" />
          <circle cx="32" cy="9" r="1" />
        </svg>
      );

    case 'dubai':
      return (
        <svg {...props}>
          <path d="M14 42V16c6 3 10 9 10 18v8z M14 16h6 M14 22h8 M14 28h9" />
          <path d="M12 42c0-14 3-24 9-28" />
          <path d="M30 42V20h2V14h1V8h.5V4h.5V1h.5v3h.5v4h1v6h2v6h2v22" />
          <path d="M8 42h34" />
        </svg>
      );

    case 'almaty':
      return (
        <svg {...props}>
          <path d="M6 42l15-24 8 11 13-17 4 30z M18 21l3 4 4-3 M35 22l3 4 3-2" />
          <path d="M8 14l32 8" />
          <path d="M22 17l1 4h6l1-4z M23 21h6v6h-6z M25 23h2" />
          <path d="M10 42v-4 M10 38l3-3h-2l2-3-2 1z" />
        </svg>
      );

    case 'rajasthan':
      return (
        <svg {...props}>
          <path d="M10 42V20l14-10 14 10v22z" />
          <path d="M15 36a2 2 0 014 0v3h-4z M22 36a2 2 0 014 0v3h-4z M29 36a2 2 0 014 0v3h-4z" />
          <path d="M18 28a2 2 0 014 0v3h-4z M26 28a2 2 0 014 0v3h-4z" />
          <path d="M22 18a2 2 0 014 0v3h-4z" />
          <path d="M24 10V6 M23 7h2 M12 20V17 M36 20V17" />
          <path d="M21 42v-4a3 3 0 016 0v4" />
        </svg>
      );

    case 'uttarakhand':
      return (
        <svg {...props}>
          <path d="M6 42l12-16 6 8 M42 42l-12-16-6 8" />
          <path d="M24 6v36" />
          <path d="M24 18c-5 0-8-4-8-9 0 4 2 8 8 9" />
          <path d="M24 18c5 0 8-4 8-9 0 4-2 8-8 9" />
          <path d="M21 24h6l-6 6h6z" />
        </svg>
      );

    case 'uttar-pradesh':
      return (
        <svg {...props}>
          <path d="M14 36V18l5-8 5 8v18z M19 10V6 M18 7h2" />
          <path d="M17 36v-6a2 2 0 014 0v6" />
          <path d="M8 42h32 M10 39h28 M12 36h24" />
          <path d="M30 38c2 2 6 2 8 0z M34 37c0-2-2-4-2-6 2 2 3 4 2 6" />
        </svg>
      );

    default:
      return (
        <svg {...props}>
          <circle cx="24" cy="24" r="18" />
          <path d="M24 14v10l7 4" />
        </svg>
      );
  }
};

export default CategoryIcon;
