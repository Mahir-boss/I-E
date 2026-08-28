import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Globe2, 
  Calendar, 
  Clock, 
  MapPin, 
  Trophy, 
  ArrowLeft,
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  TrendingUp,
  Activity,
  ShoppingBag,
  Hotel,
  QrCode,
  X,
  Upload,
  Check,
  Lock,
  Unlock,
  AlertTriangle,
  Download,
  FileText,
  Loader2,
  ChevronDown
} from 'lucide-react';
import { submitInternalRegistration, submitExternalRegistration } from '../../utils/registrationService.js';

const googleFormUrls = {
  internal: 'https://docs.google.com/forms/d/e/1FAIpQLSfYwZjqwc2Gu6tMQKlcZYjE2tDpE1tcDfw551QR0xKHAgawXQ/viewform',
  external: 'https://docs.google.com/forms/d/e/1FAIpQLSd4T7qWH_VcFQNjXu9tZRZchlhhqVTYbB6I3prpw4ErnZS5JA/viewform'
};

export default function BoardroomBillionairesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTrack = searchParams.get('track'); // 'internal' | 'external' | null

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);
  const [qrLockWarning, setQrLockWarning] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    participantName: '',
    contactNo: '',
    emailId: '',
    academicYear: '',
    branch: 'CMPN',
    collegeName: ''
  });

  // Set Document Title
  useEffect(() => {
    document.title = "Boardroom Billionaires 2026 | ACE I&E Cell";
    return () => {
      document.title = "ACE I&E Cell";
    };
  }, []);

  // Dual Video Ref Loop
  const v1Ref = useRef(null);
  const v2Ref = useRef(null);
  const isFadingRef = useRef(false);

  // Smooth Dual Video Buffer Crossfade & Autoplay Recovery
  useEffect(() => {
    const v1 = v1Ref.current;
    const v2 = v2Ref.current;
    if (!v1 || !v2) return;

    let animationFrameId;
    let activeVideo = v1;
    let idleVideo = v2;

    const CROSSFADE_TIME = 1.35;
    const OFFSET_START_TIME = 0.45;

    const startPlayback = () => {
      v1.play().catch(() => {});
    };

    const checkCrossfade = () => {
      if (activeVideo && activeVideo.duration && !isNaN(activeVideo.duration)) {
        const timeRemaining = activeVideo.duration - activeVideo.currentTime;

        if (timeRemaining <= CROSSFADE_TIME && !isFadingRef.current) {
          isFadingRef.current = true;

          idleVideo.currentTime = OFFSET_START_TIME;
          idleVideo.play().catch(() => {});

          idleVideo.style.opacity = '0.85';
          activeVideo.style.opacity = '0';

          setTimeout(() => {
            const temp = activeVideo;
            activeVideo = idleVideo;
            idleVideo = temp;
            isFadingRef.current = false;
          }, 1200);
        }
      }
      animationFrameId = requestAnimationFrame(checkCrossfade);
    };

    startPlayback();
    animationFrameId = requestAnimationFrame(checkCrossfade);

    window.addEventListener('click', startPlayback, { once: true });
    window.addEventListener('touchstart', startPlayback, { once: true });
    window.addEventListener('scroll', startPlayback, { once: true });

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('touchstart', startPlayback);
      window.removeEventListener('scroll', startPlayback);
    };
  }, []);

  const handleTrackSelect = (track) => {
    setSearchParams({ track });
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setPaymentScreenshot(null);
    setPaymentScreenshotPreview(null);
    setQrLockWarning(false);
    if (track === 'internal') {
      setFormData(prev => ({ ...prev, collegeName: 'Atharva College of Engineering', branch: 'CMPN' }));
    } else {
      setFormData(prev => ({ ...prev, collegeName: '', branch: '' }));
    }

    setTimeout(() => {
      const el = document.getElementById('registration-form-box');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToSelection = () => {
    setSearchParams({});
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError(null);
    setPaymentScreenshot(null);
    setPaymentScreenshotPreview(null);
    setQrLockWarning(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentScreenshot(file);
      setQrLockWarning(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrClick = () => {
    if (selectedTrack === 'external' && !paymentScreenshot && !submitted) {
      setQrLockWarning(true);
      setTimeout(() => setQrLockWarning(false), 5000);

      const el = document.getElementById('payment-screenshot-box');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setShowQrModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (selectedTrack === 'external' && !paymentScreenshot) {
      setQrLockWarning(true);
      setTimeout(() => setQrLockWarning(false), 5000);
      const el = document.getElementById('payment-screenshot-box');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (selectedTrack === 'internal') {
      setIsSubmitting(true);
      try {
        await submitInternalRegistration(formData);
        setSubmitted(true);
      } catch (err) {
        console.error('Internal submission error:', err);
        setSubmitError(err.message || 'Failed to submit registration. Please try again or use the official form.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (selectedTrack === 'external') {
      setIsSubmitting(true);
      try {
        await submitExternalRegistration(formData, paymentScreenshot);
        setSubmitted(true);
      } catch (err) {
        console.error('External submission error:', err);
        setSubmitError(err.message || 'Failed to submit registration. Please try again or use the official form.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#140d08] text-[#1c120c] selection:bg-[#4a2e1b] selection:text-[#fcf8f0] overflow-x-hidden font-sans">
      
      {/* Fixed Dual Video Background at z-0 */}
      <div className="fixed inset-0 z-0 overflow-hidden bg-[#140d08] pointer-events-none">
        <video
          ref={v1Ref}
          playsInline
          muted
          autoPlay
          loop
          preload="auto"
          src="/assets/videos/boardroom_bg.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-85 contrast-115 brightness-90 transition-opacity duration-1000 cubic-bezier(0.4,0,0.2,1)"
        />
        <video
          ref={v2Ref}
          playsInline
          muted
          loop
          preload="auto"
          src="/assets/videos/boardroom_bg.mp4"
          className="absolute inset-0 h-full w-full object-cover opacity-0 contrast-115 brightness-90 transition-opacity duration-1000 cubic-bezier(0.4,0,0.2,1)"
        />
      </div>

      {/* Radial Vignette Overlay at z-1 */}
      <div className="fixed inset-0 z-1 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(20,13,8,0.75)_100%)] pointer-events-none" />

      {/* Page Content Container at z-10 */}
      <div className="relative z-10">

        {/* Top Organization Header */}
        <section className="pt-28 pb-4 px-4">
          <div className="max-w-4xl mx-auto text-center">
            
            {/* Executive Organization Header Strip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 px-6 py-2.5 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-[#fcf8f0] shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
            >
              <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-[#e5c06a]">
                Atharva College of Engineering
              </span>
              <span className="hidden sm:inline text-[#8c6d3b]">•</span>
              <span className="text-xs font-semibold tracking-wider text-[#d3caad]">
                Innovation & Entrepreneurship Cell (I&E Cell)
              </span>
            </motion.div>

            {/* Title Banner Box matching Brochure Graphic */}
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 relative inline-block"
            >
              <div className="px-8 py-4 sm:px-14 sm:py-6 rounded-lg border-4 border-[#3b2313] bg-[#4a2e1b] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative z-10">
                <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-[#fcf8f0] uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  BOARDROOM BILLIONAIRES
                </h1>
              </div>
              <div className="absolute -inset-1.5 rounded-lg border-2 border-[#8c6d3b] pointer-events-none" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 text-xl sm:text-2xl font-serif italic text-[#fcf8f0] font-bold tracking-wide drop-shadow-md"
            >
              "OWN THE BOARD. BUILD THE EMPIRE."
            </motion.p>

            {/* Executive Brochure Download Options */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 flex flex-wrap items-center justify-center gap-3"
            >
              {selectedTrack === 'internal' ? (
                <a
                  href="/assets/brochures/Boardroom_Billionaires_Internal_Brochure.pdf"
                  download="Boardroom_Billionaires_Internal_Brochure.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-xs font-bold text-[#e5c06a] uppercase tracking-wider hover:bg-[#4a2e1b] hover:border-[#e5c06a] transition-all shadow-lg"
                >
                  <Download className="size-4 text-[#e5c06a]" /> Download Internal Brochure (PDF)
                </a>
              ) : selectedTrack === 'external' ? (
                <a
                  href="/assets/brochures/Boardroom_Billionaires_External_Brochure.pdf"
                  download="Boardroom_Billionaires_External_Brochure.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-xs font-bold text-[#e5c06a] uppercase tracking-wider hover:bg-[#4a2e1b] hover:border-[#e5c06a] transition-all shadow-lg"
                >
                  <Download className="size-4 text-[#e5c06a]" /> Download External Brochure (PDF)
                </a>
              ) : (
                <>
                  <a
                    href="/assets/brochures/Boardroom_Billionaires_Internal_Brochure.pdf"
                    download="Boardroom_Billionaires_Internal_Brochure.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-xs font-bold text-[#e5c06a] uppercase tracking-wider hover:bg-[#4a2e1b] hover:border-[#e5c06a] transition-all shadow-md"
                  >
                    <Download className="size-4 text-[#e5c06a]" /> ACE Internal Brochure (PDF)
                  </a>
                  <a
                    href="/assets/brochures/Boardroom_Billionaires_External_Brochure.pdf"
                    download="Boardroom_Billionaires_External_Brochure.pdf"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-xs font-bold text-[#e5c06a] uppercase tracking-wider hover:bg-[#4a2e1b] hover:border-[#e5c06a] transition-all shadow-md"
                  >
                    <Download className="size-4 text-[#e5c06a]" /> External Delegates Brochure (PDF)
                  </a>
                </>
              )}
            </motion.div>
          </div>
        </section>

        {/* Navigation Header if Track Selected */}
        {selectedTrack && (
          <div className="max-w-5xl mx-auto px-4 mb-4">
            <button
              onClick={handleBackToSelection}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#3b2313] bg-[#4a2e1b] text-xs font-bold text-[#fcf8f0] uppercase tracking-widest hover:bg-[#3b2313] transition-colors shadow-md"
            >
              <ArrowLeft className="size-4 text-[#e5c06a]" /> Back to Category Selection
            </button>
          </div>
        )}

        {/* Upfront Category Selection Cards */}
        <section className="pt-4 pb-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-[#fcf8f0]">
                Select Participation Category
              </h2>
              <p className="text-xs text-[#d3caad] mt-1 font-medium">
                Choose your institution to open your registration portal
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Internal ACE Card */}
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTrackSelect('internal')}
                className={`cursor-pointer rounded-2xl border-4 p-7 text-[#fcf8f0] backdrop-blur-md transition-all duration-300 relative overflow-hidden group ${
                  selectedTrack === 'internal'
                    ? 'border-[#e5c06a] bg-[#3b2313] shadow-[0_20px_50px_rgba(229,192,106,0.4)]'
                    : 'border-[#3b2313] bg-[#4a2e1b]/95 hover:border-[#8c6d3b] hover:shadow-[0_20px_45px_rgba(59,35,19,0.8)]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-[#3b2313] border-2 border-[#8c6d3b] flex items-center justify-center text-[#e5c06a]">
                    <Building2 className="size-6" />
                  </div>
                  {selectedTrack === 'internal' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e5c06a] bg-[#3b2313] px-3 py-1 rounded-full border border-[#8c6d3b]">
                      <CheckCircle2 className="size-3.5" /> Active Portal
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-black text-[#fcf8f0] group-hover:text-[#e5c06a] transition-colors">
                  Atharva College of Engineering
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#d3caad]">
                  Exclusive track for internal ACE engineering students across all branches & academic years.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#8c6d3b]/40 pt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e5c06a]">ACE Student Track</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#fcf8f0] group-hover:translate-x-1 transition-transform">
                    {selectedTrack === 'internal' ? 'Form Opened ↓' : 'Enter Portal →'}
                  </span>
                </div>
              </motion.div>

              {/* External Delegate Card */}
              <motion.div
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTrackSelect('external')}
                className={`cursor-pointer rounded-2xl border-4 p-7 text-[#fcf8f0] backdrop-blur-md transition-all duration-300 relative overflow-hidden group ${
                  selectedTrack === 'external'
                    ? 'border-[#e5c06a] bg-[#3b2313] shadow-[0_20px_50px_rgba(229,192,106,0.4)]'
                    : 'border-[#3b2313] bg-[#4a2e1b]/95 hover:border-[#8c6d3b] hover:shadow-[0_20px_45px_rgba(59,35,19,0.8)]'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="size-12 rounded-xl bg-[#3b2313] border-2 border-[#8c6d3b] flex items-center justify-center text-[#e5c06a]">
                    <Globe2 className="size-6" />
                  </div>
                  {selectedTrack === 'external' && (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#e5c06a] bg-[#3b2313] px-3 py-1 rounded-full border border-[#8c6d3b]">
                      <CheckCircle2 className="size-3.5" /> Active Portal
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-black text-[#fcf8f0] group-hover:text-[#e5c06a] transition-colors">
                  Other Colleges & Institutions
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#d3caad]">
                  Open track for external student delegates, guest teams, and student entrepreneurs from outside institutions.
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-[#8c6d3b]/40 pt-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#e5c06a]">External Delegate Track</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#fcf8f0] group-hover:translate-x-1 transition-transform">
                    {selectedTrack === 'external' ? 'Form Opened ↓' : 'Enter Portal →'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Registration Form Box */}
        <AnimatePresence>
          {selectedTrack && (
            <motion.div
              id="registration-form-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="px-4 pb-12"
            >
              <div className="max-w-5xl mx-auto rounded-2xl border-4 border-[#3b2313] bg-[#4a2e1b]/95 p-8 sm:p-10 text-[#fcf8f0] shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#8c6d3b]/40">
                  <div>
                    <h3 className="font-display text-2xl font-black text-[#fcf8f0]">
                      {selectedTrack === 'internal' ? 'ACE Student Registration Form' : 'External Delegate Registration Form'}
                    </h3>
                    <p className="text-sm text-[#d3caad] mt-1">
                      {selectedTrack === 'internal'
                        ? 'Fill out your participant details to reserve your seat (Free / ₹0)'
                        : 'Fill out your delegate details & upload fee payment screenshot (Advance Fee: ₹49)'}
                    </p>
                  </div>

                  {/* Dynamic WhatsApp Group Button with Lock State */}
                  <button
                    onClick={handleQrClick}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                      selectedTrack === 'external' && !paymentScreenshot && !submitted
                        ? 'border-[#e5c06a]/70 bg-[#2c190e] text-[#e5c06a] hover:bg-[#3b2313] hover:border-[#e5c06a]'
                        : 'border-[#8c6d3b] bg-[#3b2313] text-[#e5c06a] hover:bg-[#2c190e]'
                    }`}
                  >
                    {selectedTrack === 'external' && !paymentScreenshot && !submitted ? (
                      <>
                        <Lock className="size-4 text-[#e5c06a]" /> WhatsApp QR (Locked)
                      </>
                    ) : (
                      <>
                        <QrCode className="size-4 text-[#e5c06a]" /> WhatsApp Group QR
                      </>
                    )}
                  </button>
                </div>

                {/* Animated Warning Toast if user clicks locked WhatsApp QR before uploading screenshot */}
                <AnimatePresence>
                  {qrLockWarning && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl border-2 border-[#e5c06a] bg-[#3b2313] text-[#fcf8f0] flex items-start gap-3 shadow-xl"
                    >
                      <AlertTriangle className="size-5 text-[#e5c06a] shrink-0 mt-0.5 animate-bounce" />
                      <div className="text-xs">
                        <span className="font-bold text-[#e5c06a] uppercase tracking-wider block mb-0.5">
                          🔒 Payment Screenshot Required
                        </span>
                        Please upload your ₹49 payment screenshot below to unlock the External Delegates WhatsApp Group!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submission Error Banner */}
                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 rounded-xl border-2 border-red-500/80 bg-[#3b1919] text-[#fcf8f0] flex items-start gap-3 shadow-xl"
                    >
                      <AlertTriangle className="size-5 text-red-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-bold text-red-400 uppercase tracking-wider block mb-0.5">
                          Submission Error
                        </span>
                        {submitError}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Name of Participant */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          Name of the Participant *
                        </label>
                        <input
                          type="text"
                          name="participantName"
                          required
                          disabled={isSubmitting}
                          value={formData.participantName}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          className="w-full px-4 py-3 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] placeholder:text-[#d3caad]/50 focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>

                      {/* Contact Number */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          Contact No (WhatsApp) *
                        </label>
                        <input
                          type="tel"
                          name="contactNo"
                          required
                          disabled={isSubmitting}
                          value={formData.contactNo}
                          onChange={handleInputChange}
                          placeholder="+91 9876543210"
                          className="w-full px-4 py-3 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] placeholder:text-[#d3caad]/50 focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Email ID */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          Email ID *
                        </label>
                        <input
                          type="email"
                          name="emailId"
                          required
                          disabled={isSubmitting}
                          value={formData.emailId}
                          onChange={handleInputChange}
                          placeholder="participant@college.edu"
                          className="w-full px-4 py-3 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] placeholder:text-[#d3caad]/50 focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50"
                        />
                      </div>

                      {/* Academic Year */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          Academic Year *
                        </label>
                        <div className="relative">
                          <select
                            name="academicYear"
                            required
                            disabled={isSubmitting}
                            value={formData.academicYear}
                            onChange={handleInputChange}
                            className="w-full appearance-none px-4 py-3 pr-10 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            <option value="" disabled>Select Academic Year</option>
                            <option value="FE">First Year (FE)</option>
                            <option value="SE">Second Year (SE)</option>
                            <option value="TE">Third Year (TE)</option>
                            <option value="BE">Final Year (BE)</option>
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#e5c06a]" />
                        </div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Branch Selection */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          Branch *
                        </label>
                        {selectedTrack === 'internal' ? (
                          <div className="relative">
                            <select
                              name="branch"
                              disabled={isSubmitting}
                              value={formData.branch}
                              onChange={handleInputChange}
                              className="w-full appearance-none px-4 py-3 pr-10 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <option value="CMPN">Computer Engineering (CMPN)</option>
                              <option value="INFT">Information Technology (INFT)</option>
                              <option value="ECS">Electronics & Computer Science (ECS)</option>
                              <option value="EXTC">Electronics & Telecommunication (EXTC)</option>
                              <option value="ELEC">Electrical Engineering (ELEC)</option>
                              <option value="Other">Other</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#e5c06a]" />
                          </div>
                        ) : (
                          <input
                            type="text"
                            name="branch"
                            required
                            disabled={isSubmitting}
                            value={formData.branch}
                            onChange={handleInputChange}
                            placeholder="e.g. Mechanical, CS, AI&DS"
                            className="w-full px-4 py-3 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] placeholder:text-[#d3caad]/50 focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50"
                          />
                        )}
                      </div>

                      {/* College Name */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2">
                          College / Institution Name *
                        </label>
                        {selectedTrack === 'internal' ? (
                          <div className="relative">
                            <select
                              name="collegeName"
                              disabled={isSubmitting}
                              value={formData.collegeName}
                              onChange={handleInputChange}
                              className="w-full appearance-none px-4 py-3 pr-10 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <option value="Atharva College of Engineering">Atharva College of Engineering</option>
                              <option value="Hotel Management">Hotel Management</option>
                              <option value="Management Studies">Management Studies</option>
                              <option value="Atharva University">Atharva University</option>
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-[#e5c06a]" />
                          </div>
                        ) : (
                          <input
                            type="text"
                            name="collegeName"
                            required
                            disabled={isSubmitting}
                            value={formData.collegeName}
                            onChange={handleInputChange}
                            placeholder="College / Institution Name"
                            className="w-full px-4 py-3 rounded-lg bg-[#3b2313] border-2 border-[#8c6d3b] text-[#fcf8f0] placeholder:text-[#d3caad]/50 focus:border-[#e5c06a] focus:outline-none transition-colors disabled:opacity-50"
                          />
                        )}
                      </div>
                    </div>

                    {/* External Track Payment & Screenshot Section */}
                    {selectedTrack === 'external' && (
                      <div className="rounded-xl border-2 border-[#8c6d3b] bg-[#3b2313] p-6 space-y-6">
                        <div className="flex flex-col sm:row items-center justify-between gap-4 pb-4 border-b border-[#8c6d3b]/40">
                          <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#e5c06a]">Payment Gateway</span>
                            <h4 className="font-display text-lg font-black text-[#fcf8f0] mt-0.5">Advance Registration Fee: ₹49</h4>
                            <p className="text-xs text-[#d3caad] mt-1">UPI ID: <span className="font-mono text-[#e5c06a] font-bold">prathamsunilshinde@oksbi</span></p>
                          </div>

                          {/* Clickable UPI Payment QR Image */}
                          <div 
                            onClick={() => setShowPaymentModal(true)}
                            className="w-36 h-44 bg-white p-2 rounded-xl border-2 border-[#8c6d3b] shrink-0 shadow-lg cursor-pointer hover:border-[#e5c06a] hover:scale-105 transition-all group relative overflow-hidden"
                            title="Click to launch UPI app or expand QR Code"
                          >
                            <img
                              src="/assets/qr/upi_payment_qr.png"
                              alt="UPI Payment QR Code"
                              className="w-full h-full object-contain rounded-lg"
                            />
                            <div className="absolute inset-0 bg-[#140d08]/70 flex flex-col items-center justify-center p-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#e5c06a] bg-[#3b2313] px-2 py-1 rounded border border-[#8c6d3b]">
                                Click to Pay / Expand 🔍
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* File Upload for Payment Screenshot */}
                        <div id="payment-screenshot-box">
                          <label className="block text-xs font-bold uppercase tracking-wider text-[#d3caad] mb-2 flex items-center justify-between">
                            <span>Upload Payment Screenshot *</span>
                            {paymentScreenshot ? (
                              <span className="text-[#e5c06a] font-bold flex items-center gap-1">
                                <Unlock className="size-3.5" /> Group Unlocked
                              </span>
                            ) : (
                              <span className="text-[#e5c06a]/80 font-semibold flex items-center gap-1">
                                <Lock className="size-3.5" /> Unlocks WhatsApp Group
                              </span>
                            )}
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              required
                              onChange={handleFileChange}
                              className="hidden"
                              id="payment-screenshot-input"
                            />
                            <label
                              htmlFor="payment-screenshot-input"
                              className={`flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#2c190e] border-2 border-dashed text-xs text-[#d3caad] cursor-pointer transition-all ${
                                qrLockWarning
                                  ? 'border-[#e5c06a] ring-4 ring-[#e5c06a]/40 shadow-lg'
                                  : 'border-[#8c6d3b] hover:border-[#e5c06a]'
                              }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                {paymentScreenshot ? (
                                  <>
                                    <Check className="size-4 text-[#e5c06a] shrink-0" />
                                    <span className="truncate text-[#fcf8f0] font-medium">{paymentScreenshot.name}</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="size-4 text-[#e5c06a] shrink-0" />
                                    <span>Choose Payment Screenshot (PNG/JPG)</span>
                                  </>
                                )}
                              </span>
                              <span className="px-2.5 py-1 rounded bg-[#3b2313] text-[10px] font-bold uppercase text-[#e5c06a] shrink-0">Browse</span>
                            </label>
                          </div>

                          {/* Screenshot Thumbnail Preview */}
                          {paymentScreenshotPreview && (
                            <div className="mt-3 flex items-center gap-3 p-2 rounded-lg bg-[#2c190e] border border-[#8c6d3b]/40">
                              <img src={paymentScreenshotPreview} alt="Screenshot Preview" className="size-12 object-cover rounded border border-[#8c6d3b]" />
                              <div className="text-[11px] text-[#d3caad] truncate">
                                <div className="font-bold text-[#fcf8f0] truncate">{paymentScreenshot?.name}</div>
                                <div className="text-[#e5c06a] font-semibold">✓ WhatsApp Group Unlocked</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-[#3b2313] border-2 border-[#8c6d3b] text-[#e5c06a] font-black text-sm uppercase tracking-widest hover:bg-[#2c190e] hover:border-[#e5c06a] transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin text-[#e5c06a]" />
                          <span>Recording in Google Sheet...</span>
                        </>
                      ) : (
                        <span>Complete Registration</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-8 space-y-4">
                    <div className="size-16 bg-[#3b2313] border-2 border-[#e5c06a] rounded-full flex items-center justify-center text-[#e5c06a] mx-auto">
                      <CheckCircle2 className="size-8 animate-bounce" />
                    </div>
                    <h4 className="font-display text-2xl font-black text-[#fcf8f0]">Registration Submitted!</h4>
                    <p className="text-sm text-[#d3caad] max-w-md mx-auto">
                      {selectedTrack === 'internal'
                        ? 'Your registration has been successfully recorded in the official ACE participant spreadsheet.'
                        : 'Your participant details have been recorded. Please join the official WhatsApp group below.'}
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <a
                        href={googleFormUrls[selectedTrack]}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-3 rounded-lg bg-[#e5c06a] text-[#1c120c] font-bold text-xs uppercase tracking-wider hover:bg-[#fcf8f0] transition-colors"
                      >
                        Open Official Verification Form →
                      </a>
                      <button
                        onClick={handleQrClick}
                        className="px-6 py-3 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-[#fcf8f0] font-bold text-xs uppercase tracking-wider hover:border-[#e5c06a] transition-colors"
                      >
                        Join WhatsApp Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Event Experience Overview Section */}
        <section className="pb-16 pt-4 px-4">
          <div className="max-w-5xl mx-auto space-y-16">

            {/* Event Meta Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-center shadow-lg text-[#fcf8f0]">
                <Calendar className="size-6 text-[#e5c06a] mx-auto mb-2" />
                <div className="text-xs uppercase font-bold text-[#d3caad]">Dates</div>
                <div className="text-sm font-black text-[#fcf8f0] mt-1">30th Sept & 1st Oct</div>
              </div>
              <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-center shadow-lg text-[#fcf8f0]">
                <Clock className="size-6 text-[#e5c06a] mx-auto mb-2" />
                <div className="text-xs uppercase font-bold text-[#d3caad]">Timing</div>
                <div className="text-sm font-black text-[#fcf8f0] mt-1">11:00 AM – 4:00 PM</div>
              </div>
              <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-center shadow-lg text-[#fcf8f0]">
                <MapPin className="size-6 text-[#e5c06a] mx-auto mb-2" />
                <div className="text-xs uppercase font-bold text-[#d3caad]">Venue</div>
                <div className="text-sm font-black text-[#fcf8f0] mt-1">ACE Auditorium</div>
              </div>
              <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-center shadow-lg text-[#fcf8f0]">
                <Trophy className="size-6 text-[#e5c06a] mx-auto mb-2" />
                <div className="text-xs uppercase font-bold text-[#d3caad]">Prize Pool</div>
                <div className="text-sm font-black text-[#e5c06a] mt-1">₹10,000</div>
              </div>
            </div>

            {/* 4 Simulation Rounds */}
            <div>
              <h3 className="font-display text-2xl font-black text-[#fcf8f0] mb-6 flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#e5c06a]" />
                THE 4 SIMULATION ROUNDS
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-6 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs font-bold text-[#e5c06a] uppercase tracking-wider mb-2">Round 01</div>
                  <h4 className="text-lg font-bold text-[#fcf8f0]">The Auction Floor</h4>
                  <p className="text-xs text-[#d3caad] mt-2 leading-relaxed">
                    Live bidding war. Teams use limited virtual capital to buy core assets (Lead Developer, AWS Credits, FDA Consultant).
                  </p>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-6 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs font-bold text-[#e5c06a] uppercase tracking-wider mb-2">Round 02</div>
                  <h4 className="text-lg font-bold text-[#fcf8f0]">Market Mayhem</h4>
                  <p className="text-xs text-[#d3caad] mt-2 leading-relaxed">
                    Free-roaming networking round. Open hidden task envelopes and negotiate B2B integrations with other floor startups.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-6 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs font-bold text-[#e5c06a] uppercase tracking-wider mb-2">Round 03</div>
                  <h4 className="text-lg font-bold text-[#fcf8f0]">Fortune & Fallout</h4>
                  <p className="text-xs text-[#d3caad] mt-2 leading-relaxed">
                    Unpredictable market events and crisis management. Present quick strategies to survive sudden industry shocks.
                  </p>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-6 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs font-bold text-[#e5c06a] uppercase tracking-wider mb-2">Finale</div>
                  <h4 className="text-lg font-bold text-[#fcf8f0]">The Revival Blueprint</h4>
                  <p className="text-xs text-[#d3caad] mt-2 leading-relaxed">
                    Top startups pitch complete rebranding and revival campaigns for famously failed or struggling products.
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Industry Sectors */}
            <div>
              <h3 className="font-display text-2xl font-black text-[#fcf8f0] mb-6 flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#e5c06a]" />
                THE FOUR SECTORS
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] flex items-start gap-4 shadow-lg">
                  <TrendingUp className="size-6 text-[#e5c06a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#fcf8f0] text-base">Fintech</h4>
                    <p className="text-xs text-[#d3caad] mt-1">Digital payments, banking, automated investments, & DeFi.</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] flex items-start gap-4 shadow-lg">
                  <Activity className="size-6 text-[#e5c06a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#fcf8f0] text-base">Healthtech</h4>
                    <p className="text-xs text-[#d3caad] mt-1">Telemedicine, AI diagnostics, & patient accessibility.</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] flex items-start gap-4 shadow-lg">
                  <ShoppingBag className="size-6 text-[#e5c06a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#fcf8f0] text-base">E-Commerce</h4>
                    <p className="text-xs text-[#d3caad] mt-1">Digital storefronts, logistics, & predictive consumer analytics.</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] flex items-start gap-4 shadow-lg">
                  <Hotel className="size-6 text-[#e5c06a] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#fcf8f0] text-base">Hospitality</h4>
                    <p className="text-xs text-[#d3caad] mt-1">Travel systems, lodging, property management, & automation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h3 className="font-display text-2xl font-black text-[#fcf8f0] mb-6 flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#e5c06a]" />
                EVENT COORDINATORS & CONTACTS
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs uppercase font-bold text-[#e5c06a]">Overall Coordinator</div>
                  <h4 className="font-bold text-[#fcf8f0] text-lg mt-1">Mahendra Patel</h4>
                  <a href="tel:+917977160930" className="inline-flex items-center gap-1.5 text-xs text-[#d3caad] hover:text-[#e5c06a] mt-2 transition-colors">
                    <Phone className="size-3.5" /> +91 79771 60930
                  </a>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs uppercase font-bold text-[#e5c06a]">Overall Coordinator</div>
                  <h4 className="font-bold text-[#fcf8f0] text-lg mt-1">Aarya Jagatia</h4>
                  <a href="tel:+918591855499" className="inline-flex items-center gap-1.5 text-xs text-[#d3caad] hover:text-[#e5c06a] mt-2 transition-colors">
                    <Phone className="size-3.5" /> +91 85918 55499
                  </a>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs uppercase font-bold text-[#e5c06a]">External Liaison</div>
                  <h4 className="font-bold text-[#fcf8f0] text-lg mt-1">Subham Sahoo</h4>
                  <a href="tel:+918169027410" className="inline-flex items-center gap-1.5 text-xs text-[#d3caad] hover:text-[#e5c06a] mt-2 transition-colors">
                    <Phone className="size-3.5" /> +91 81690 27410
                  </a>
                </div>
                <div className="rounded-xl border-2 border-[#3b2313] bg-[#4a2e1b]/95 p-5 text-[#fcf8f0] shadow-lg">
                  <div className="text-xs uppercase font-bold text-[#e5c06a]">Internal Liaison</div>
                  <h4 className="font-bold text-[#fcf8f0] text-lg mt-1">Kehkasha Sayed</h4>
                  <a href="tel:+917666387409" className="inline-flex items-center gap-1.5 text-xs text-[#d3caad] hover:text-[#e5c06a] mt-2 transition-colors">
                    <Phone className="size-3.5" /> +91 76663 87409
                  </a>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* WhatsApp QR Modal (Dynamic based on selectedTrack) */}
        <AnimatePresence>
          {showQrModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140d08]/85 backdrop-blur-md"
            >
              <div className="relative w-full max-w-sm rounded-2xl border-4 border-[#3b2313] bg-[#4a2e1b] p-6 text-center text-[#fcf8f0] shadow-2xl">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 text-[#d3caad] hover:text-[#fcf8f0]"
                >
                  <X className="size-5" />
                </button>
                <h4 className="font-display text-xl font-black text-[#fcf8f0] mb-1">
                  {selectedTrack === 'external' ? 'External Delegates Group' : 'Internal Delegates Group'}
                </h4>
                <p className="text-xs text-[#d3caad] mb-4">
                  {selectedTrack === 'external'
                    ? 'Scan or tap to join the official External Delegates WhatsApp group'
                    : 'Scan or tap to join the official ACE Internal Delegates WhatsApp group'}
                </p>
                <div className="w-full max-w-[270px] aspect-[7/8] bg-[#111b21] rounded-2xl mx-auto shadow-2xl flex items-center justify-center border-2 border-[#8c6d3b] overflow-hidden p-1">
                  <img
                    src={selectedTrack === 'external' ? '/assets/qr/external_whatsapp_qr.png' : '/assets/qr/internal_whatsapp_qr.png'}
                    alt="WhatsApp Group QR Code"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="mt-6 w-full py-2.5 rounded-lg bg-[#e5c06a] text-[#1c120c] font-bold text-xs uppercase tracking-wider hover:bg-[#fcf8f0] transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPI Payment Enlarged Modal */}
        <AnimatePresence>
          {showPaymentModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140d08]/85 backdrop-blur-md overflow-y-auto"
            >
              <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-2xl border-4 border-[#3b2313] bg-[#4a2e1b] p-6 text-center text-[#fcf8f0] shadow-2xl my-auto">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="absolute top-4 right-4 text-[#d3caad] hover:text-[#fcf8f0]"
                >
                  <X className="size-5" />
                </button>
                <div className="text-xs font-bold uppercase tracking-widest text-[#e5c06a] mb-1">
                  UPI Payment Gateway
                </div>
                <h4 className="font-display text-2xl font-black text-[#fcf8f0]">
                  Advance Fee: ₹49
                </h4>
                <p className="text-xs text-[#d3caad] mt-1 mb-4">
                  Scan with GPay, PhonePe, Paytm or tap below to open UPI App
                </p>

                {/* Enlarged QR Image */}
                <div className="w-full max-w-[280px] bg-white p-2 rounded-2xl mx-auto shadow-2xl flex items-center justify-center border-2 border-[#8c6d3b] overflow-hidden">
                  <img
                    src="/assets/qr/upi_payment_qr.png"
                    alt="Enlarged UPI Payment QR Code"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>

                <div className="mt-4 p-2.5 rounded-lg bg-[#3b2313] border border-[#8c6d3b] flex items-center justify-between gap-2">
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold text-[#d3caad]">Payee UPI ID</div>
                    <div className="text-xs font-mono font-bold text-[#e5c06a] select-all">
                      prathamsunilshinde@oksbi
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("prathamsunilshinde@oksbi");
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded bg-[#4a2e1b] border border-[#8c6d3b] text-[10px] font-bold text-[#e5c06a] uppercase hover:bg-[#8c6d3b] hover:text-[#1c120c] transition-colors shrink-0"
                  >
                    {copiedUpi ? "✓ Copied" : "Copy ID"}
                  </button>
                </div>

                <div className="mt-5 space-y-2">
                  {/* Mobile Only: Direct UPI App Launch Button */}
                  <a
                    href="upi://pay?pa=prathamsunilshinde@oksbi&pn=Pratham%20Shinde&am=49&cu=INR&tn=Boardroom%20Billionaires%20Registration"
                    className="sm:hidden block w-full py-3 rounded-lg bg-[#e5c06a] text-[#1c120c] font-black text-xs uppercase tracking-wider hover:bg-[#fcf8f0] transition-colors shadow-lg"
                  >
                    Open UPI App to Pay ₹49 →
                  </a>

                  {/* Desktop Only: Scan QR Guidance */}
                  <div className="hidden sm:block p-2.5 rounded-lg bg-[#3b2313] border border-[#8c6d3b]/50 text-center">
                    <p className="text-[11px] text-[#d3caad]">
                      Scan the QR code above with <span className="text-[#e5c06a] font-bold">GPay / PhonePe / Paytm</span> on your mobile device to complete payment.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="w-full py-2.5 rounded-lg border-2 border-[#8c6d3b] bg-[#3b2313] text-[#fcf8f0] font-bold text-xs uppercase tracking-wider hover:border-[#e5c06a] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
