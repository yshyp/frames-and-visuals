import React, { useState } from 'react';
import { Mail, Instagram, Youtube, Send, CheckCircle2 } from 'lucide-react';
import { PHOTOGRAPHER_INFO } from '../../data/photos';

interface ContactSectionProps {
  onNavigateToAdmin?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onNavigateToAdmin }) => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.email || !formState.message) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section className="relative w-full py-28 px-6 md:px-12 bg-[#080808] text-[#F5F2EA] border-t border-[#1C1B19]">
      <div className="max-w-3xl mx-auto text-center">
        {/* Header */}
        <span className="text-xs uppercase tracking-[0.35em] text-[#A89F91] mb-3 block font-sans">
          Inquiries & Commissions
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif tracking-[0.16em] uppercase text-[#F5F2EA] font-light mb-4">
          LET'S CREATE A STORY
        </h2>
        <div className="w-12 h-[1px] bg-[#D4AF37]/50 mx-auto mb-6" />

        <p className="text-base sm:text-lg text-[#A8A297] font-sans font-light max-w-xl mx-auto leading-relaxed mb-10">
          Have a project, collaboration or photography opportunity in mind?
        </p>

        {/* Buttons requested in brief */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href={`mailto:${PHOTOGRAPHER_INFO.socials.email}?subject=Photography%20Inquiry%20-%20FramesandVisualsbyYsh`}
            className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-sans font-medium text-[#0B0B0B] bg-[#E8DCC4] hover:bg-[#F5EFE3] transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>GET IN TOUCH</span>
          </a>

          <a
            href={PHOTOGRAPHER_INFO.socials.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-[0.22em] font-sans text-[#E8DCC4] border border-[#3A3630] hover:border-[#E8DCC4] transition-colors cursor-pointer"
          >
            <Instagram className="w-4 h-4" />
            <span>INSTAGRAM</span>
          </a>

          <a
            href={PHOTOGRAPHER_INFO.socials.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 text-xs uppercase tracking-[0.22em] font-sans text-[#E8DCC4] border border-[#3A3630] hover:border-[#E8DCC4] transition-colors cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>YOUTUBE</span>
          </a>
        </div>

        {/* Minimal Direct Contact Form */}
        <div className="max-w-xl mx-auto bg-[#100F0E] p-8 border border-[#22211f] text-left shadow-xl">
          <h3 className="text-xs uppercase tracking-[0.25em] text-[#C4B291] mb-6 font-mono">
            SEND DIRECT DISPATCH
          </h3>

          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-[#A8E6CF]" />
              <p className="font-serif italic text-lg text-[#F5F2EA]">
                Message dispatched to Vaisakh.
              </p>
              <p className="text-xs text-[#888]">Thank you for reaching out.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#736E66] mb-1.5 font-sans">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="e.g. Elena Vance"
                  className="w-full bg-[#181716] border border-[#2b2926] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C4B291] transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#736E66] mb-1.5 font-sans">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full bg-[#181716] border border-[#2b2926] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C4B291] transition-colors font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#736E66] mb-1.5 font-sans">
                  Opportunity / Project Vision
                </label>
                <textarea
                  rows={4}
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Tell me about the story, assignment, exhibition, or print inquiry..."
                  className="w-full bg-[#181716] border border-[#2b2926] text-[#F5F2EA] px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C4B291] transition-colors font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-[0.2em] font-sans font-medium text-[#0B0B0B] bg-[#E8DCC4] hover:bg-[#F5EFE3] transition-colors cursor-pointer mt-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Dispatch</span>
              </button>
            </form>
          )}
        </div>

        {/* Quiet Footer — 100% clean for external visitors */}
        <div className="mt-20 pt-8 border-t border-[#1C1B19] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#635E56] font-mono tracking-widest gap-3 select-none">
          <span>
            {onNavigateToAdmin ? (
              <span
                onClick={onNavigateToAdmin}
                className="cursor-default"
                title=""
              >
                ©
              </span>
            ) : (
              '©'
            )}{' '}
            {new Date().getFullYear()} FRAMESANDVISUALSBYYSH · VAISAKH Y P
          </span>
          <span>KERALA, INDIA</span>
        </div>
      </div>
    </section>
  );
};
