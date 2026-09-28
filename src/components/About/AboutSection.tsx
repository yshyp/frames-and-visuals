import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Youtube,
  Mail,
  MapPin,
} from 'lucide-react';
import { PhotographerProfile, Photo } from '../../types/portfolio';
import { getStoredPhotographer } from '../../utils/photographerStore';

interface AboutSectionProps {
  photographer?: PhotographerProfile;
  onUpdatePhotographer?: (updated: PhotographerProfile) => void;
  availablePhotos?: Photo[];
  onEnterPortfolio: () => void;
  onNavigateToAdmin?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  photographer: initialPhotographer,
  onEnterPortfolio,
}) => {
  const [profile, setProfile] = useState<PhotographerProfile>(() => {
    return initialPhotographer || getStoredPhotographer();
  });

  // Keep state in sync if prop changes
  useEffect(() => {
    if (initialPhotographer) {
      setProfile(initialPhotographer);
    }
  }, [initialPhotographer]);

  const [imgError, setImgError] = useState(false);

  // Portrait image source with fallback
  const portraitSrc = imgError
    ? '/images/photographer-vaisakh.jpg'
    : (profile.portrait || '/images/photographer-vaisakh.jpg');

  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#0B0B0B] text-[#F5F2EA] border-t border-[#1F1E1C]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#A89F91] mb-2 font-sans">
            Behind the Lens
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif tracking-[0.14em] uppercase text-[#F5F2EA] font-light">
            ABOUT THE PHOTOGRAPHER
          </h2>
          <div className="w-12 h-[1px] bg-[#D4AF37]/50 mt-4" />
        </div>

        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photographer Portrait Picture */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative p-3 bg-[#141312] border border-[#262421] shadow-2xl max-w-sm w-full group">
              {/* Picture Container */}
              <div className="relative overflow-hidden aspect-[3/4] bg-black/40">
                <img
                  src={portraitSrc}
                  alt={profile.name}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover transition-all duration-700 contrast-105 group-hover:scale-102"
                />
              </div>

              {/* Plaque / Title under portrait */}
              <div className="pt-4 pb-1 text-center">
                <p className="text-xs font-serif uppercase tracking-[0.2em] text-[#E8DCC4]">
                  {profile.name}
                </p>
                <p className="text-[10px] text-[#736E66] uppercase tracking-widest mt-1">
                  Founder · {profile.brand}
                </p>
              </div>
            </div>
          </div>

          {/* Biography & Philosophy */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8A37A] mb-4 font-mono">
              <MapPin className="w-3.5 h-3.5" />
              <span>Based in {profile.location}</span>
            </div>

            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl font-serif text-[#F5F2EA] tracking-wide">
                {profile.name}
              </h3>
            </div>

            <p className="text-sm italic font-serif text-[#D4AF37]/90 mb-6 tracking-wide">
              "{profile.tagline}"
            </p>

            <div className="space-y-4 text-sm sm:text-base text-[#B0A89C] font-sans font-light leading-relaxed mb-8">
              {profile.bio.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {/* Social Presence */}
            <div className="flex items-center gap-5">
              <a
                href={profile.socials.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors"
                title="Follow on Instagram"
              >
                <Instagram className="w-4 h-4 text-[#C4BCAB]" />
                <span>@{profile.socials.instagram}</span>
              </a>

              <a
                href={profile.socials.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors"
                title="Watch on YouTube"
              >
                <Youtube className="w-4 h-4 text-[#C4BCAB]" />
                <span>YouTube</span>
              </a>

              <a
                href={`mailto:${profile.socials.email}`}
                className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#A8A8A8] hover:text-[#F5F2EA] transition-colors"
                title="Email directly"
              >
                <Mail className="w-4 h-4 text-[#C4BCAB]" />
                <span>Email</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterPortfolio}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-[#0B0B0B] bg-[#E8DCC4] hover:bg-[#F5EFE3] rounded-none transition-colors cursor-pointer"
              >
                View The Monograph
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
