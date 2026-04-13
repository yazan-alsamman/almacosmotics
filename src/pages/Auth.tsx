import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

type Step = 'info' | 'otp' | 'verified';

const Auth = () => {
  const [step, setStep] = useState<Step>('info');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const redirectTo = searchParams.get('redirect') || '/products';
  const memberGate = searchParams.get('reason') === 'member' || redirectTo.startsWith('/checkout');

  const handleSendOTP = () => {
    if (!name || !phone) return;
    setStep('otp');
    setCountdown(60);
  };

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleOTPChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
    if (newOtp.every((d) => d !== '')) {
      setTimeout(() => setStep('verified'), 800);
    }
  }, [otp]);

  const pageVariants = {
    enter: { opacity: 0, x: 30 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-primary/20 blur-3xl top-20 -left-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="w-full max-w-sm relative z-10">
        {memberGate && step !== 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-primary/40 bg-primary/15 px-4 py-3 flex gap-3 items-start"
          >
            <Sparkles className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
            <div>
              <p className="font-serif text-sm leading-snug">Member Exclusive</p>
              <p className="text-xs font-sans text-muted-foreground mt-1 leading-relaxed">
                Alma checkout is reserved for verified members. Sign in with OTP to unlock delivery and your order history.
              </p>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="font-serif text-primary-foreground font-bold tracking-wider">AC</span>
          </div>
          <h1 className="font-serif text-2xl">Welcome to Alma</h1>
        </div>

        <AnimatePresence mode="wait">
          {step === 'info' && (
            <motion.div key="info" variants={pageVariants} initial="enter" animate="center" exit="exit" className="space-y-4">
              <div>
                <label className="text-xs font-sans text-muted-foreground mb-1.5 block">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border bg-background font-sans text-sm focus:outline-none focus:border-foreground/30 transition-colors"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-xs font-sans text-muted-foreground mb-1.5 block">Phone Number</label>
                <div className="flex items-center gap-2 p-3.5 rounded-xl border border-border bg-background">
                  <span className="text-sm font-sans text-muted-foreground">+963</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 font-sans text-sm bg-transparent focus:outline-none"
                    placeholder="9XX XXX XXX"
                  />
                </div>
              </div>
              <button
                onClick={handleSendOTP}
                disabled={!name || !phone}
                className="w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-widest uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                Continue <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 'otp' && (
            <motion.div key="otp" variants={pageVariants} initial="enter" animate="center" exit="exit" className="space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)] mx-auto mb-3 flex items-center justify-center">
                  <Phone size={20} className="text-background" />
                </div>
                <p className="text-sm font-sans text-muted-foreground">We sent a code via WhatsApp to</p>
                <p className="font-sans text-sm font-medium mt-1">+963 {phone}</p>
              </div>

              <div className="flex justify-center gap-2.5">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    onChange={(e) => handleOTPChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    maxLength={1}
                    className="w-11 h-13 rounded-lg border border-border bg-background text-center font-serif text-lg focus:outline-none focus:border-foreground/40 transition-colors"
                  />
                ))}
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-xs font-sans text-muted-foreground">
                    Resend code in <span className="text-foreground font-medium">{countdown}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCountdown(60)}
                    className="text-xs font-sans underline hover:opacity-70 transition-opacity"
                  >
                    Resend code
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {step === 'verified' && (
            <motion.div key="verified" variants={pageVariants} initial="enter" animate="center" exit="exit" className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-foreground mx-auto flex items-center justify-center"
              >
                <Check size={28} className="text-background" />
              </motion.div>
              <div>
                <h2 className="font-serif text-xl">Welcome, {name}</h2>
                <p className="text-sm font-sans text-muted-foreground mt-2">Your account is verified</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  login({
                    id: 'member-1',
                    name,
                    phone: `+963${phone.replace(/\s/g, '')}`,
                    isVerified: true,
                  });
                  navigate(redirectTo.startsWith('/') ? redirectTo : '/products', { replace: true });
                }}
                className="w-full py-3.5 bg-foreground text-background rounded-xl font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity"
              >
                {memberGate ? 'Continue to checkout' : 'Start Shopping'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
