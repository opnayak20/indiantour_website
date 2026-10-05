import React, { useRef, useState } from 'react';
import { reviews } from '../data/websiteData';

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="bg-white shadow-md hover:shadow-2xl rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between border border-gray-100"
      style={{ width: '260px', height: '375px' }}
    >
      {/* Experience Image */}
      <div className="w-full h-[165px] overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          loading="lazy"
          src={review.travelPhoto}
          alt={`${review.name} - ${review.trip}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Review Content */}
      <div className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Star Rating */}
          <div className="flex gap-1 text-amber-400 text-xs mb-1.5">
            {[...Array(review.stars)].map((_, i) => (
              <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Feedback Quote */}
          <p className={`text-xs text-gray-700 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
            "{review.comment}"
          </p>
          {review.comment.length > 90 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] text-primary hover:underline font-semibold mt-1 cursor-pointer"
            >
              {expanded ? 'Show less' : 'Read more...'}
            </button>
          )}
        </div>

        {/* Reviewer Details */}
        <div className="flex items-center gap-2.5 pt-2 border-t border-gray-100 mt-2">
          <img
            loading="lazy"
            src={review.avatar}
            alt={review.name}
            className="w-9 h-9 rounded-full object-cover border border-gray-200"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-gray-900 truncate">
              {review.name}
            </h4>
            <p className="text-[11px] text-gray-500 truncate">
              {review.trip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewsSection({ onViewAllReviews }) {
  const scrollRef = useRef(null);

  return (
    <section className="md:py-10 py-6 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header with View All */}
        <div className="pb-4 productSansBold flex flex-row justify-between items-center">
          <div>
            <h2 className="md:text-2xl text-xl ProductSans font-bold text-gray-900">
              Reviews
            </h2>
            <p className="text-xs text-gray-500">
              Loved by 25,000+ travelers across India
            </p>
          </div>
          
          <button
            onClick={onViewAllReviews}
            className="flex-shrink-0 text-sm md:text-base flex items-center gap-1 text-primary hover:text-red-700 font-semibold cursor-pointer group"
          >
            <span>View All</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable Reviews Cards */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-5 py-3 w-full scroll-smooth"
        >
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>

      </div>
    </section>
  );
}
