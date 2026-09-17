'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { InternationalPhoneSelector } from '@/components/common/InternationalPhoneSelector';
import { CountryItem } from '@/lib/countries';
import { CheckCircle, Upload, ShieldCheck, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

function RegisterForm() {
  const { lang, branding, t } = useAppSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedTier = searchParams.get('tier');

  const [tiers, setTiers] = useState<any[]>([]);
  const [selectedTierId, setSelectedTierId] = useState(preselectedTier || '');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Ethiopia');
  const [countryCode, setCountryCode] = useState('+251');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Telebirr');
  const [paymentReference, setPaymentReference] = useState('');

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);

  useEffect(() => {
    async function loadTiers() {
      try {
        const res = await fetch('/api/tiers');
        if (res.ok) {
          const data = await res.json();
          setTiers(data.tiers || []);
          if (!selectedTierId && data.tiers?.length > 0) {
            // Default to gold or first tier
            const gold = data.tiers.find((t: any) => t.name.toLowerCase() === 'gold');
            setSelectedTierId(gold ? gold.id : data.tiers[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load tiers:', err);
      }
    }
    loadTiers();
  }, [selectedTierId]);

  const selectedTier = tiers.find((t) => t.id === selectedTierId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('country', country);
      formData.append('countryCode', countryCode);
      formData.append('phoneNumber', phoneNumber);
      if (email) formData.append('email', email);
      formData.append('tierId', selectedTierId);
      formData.append('paymentMethod', paymentMethod);
      formData.append('paymentReference', paymentReference);

      if (photoFile) formData.append('photo', photoFile);
      if (receiptFile) formData.append('paymentReceipt', receiptFile);

      const res = await fetch('/api/members/register', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (lang === 'am' ? 'ምዝገባው አልተሳካም።' : 'Registration failed.'));
      }

      setSuccessData(data.member);
    } catch (err: any) {
      setError(err.message || (lang === 'am' ? 'በማመልከቻው ሂደት ስህተት ተፈጥሯል።' : 'An error occurred during submission.'));
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100">
          {lang === 'am' ? 'ምዝገባዎ በተሳካ ሁኔታ ገብቷል!' : 'Registration Submitted!'}
        </h2>
        <p className="mt-3 text-slate-300 text-sm">
          {lang === 'am' ? (
            <>
              እናመሰግናለን <span className="text-amber-400 font-bold">{successData.fullName}</span>። የአባልነት ማመልከቻዎ ደርሶናል፤ በአሁኑ ጊዜ <span className="font-semibold text-amber-300">በማረጋገጥ ላይ (Pending Verification)</span> ይገኛል።
            </>
          ) : (
            <>
              Thank you, <span className="text-amber-400 font-bold">{successData.fullName}</span>. Your membership application has been received and is currently <span className="font-semibold text-amber-300">Pending Verification</span>.
            </>
          )}
        </p>

        <div className="my-8 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{lang === 'am' ? 'የአባልነት መለያ (Code):' : 'Membership Code:'}</span>
            <span className="font-mono font-bold text-amber-400 text-base">{successData.membershipCode}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{lang === 'am' ? 'የአባልነት ደረጃ:' : 'Tier:'}</span>
            <span className="font-semibold text-slate-200">{successData.tierName}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{lang === 'am' ? 'ስልክ ቁጥር:' : 'Phone Number:'}</span>
            <span className="font-mono text-slate-300">{successData.normalizedPhone}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">{lang === 'am' ? 'ሁኔታ:' : 'Status:'}</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase">
              {successData.status === 'PENDING' && lang === 'am' ? 'በማረጋገጥ ላይ' : successData.status}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-8 leading-relaxed">
          {lang === 'am'
            ? 'አስተዳዳሪዎቻችን የክፍያ ደረሰኞችን ከ1 እስከ 12 ሰዓታት ውስጥ ያረጋግጣሉ። እንደጸደቀ ዲጂታል ካርድዎ ወዲያውኑ በይፋዊው የማረጋገጫ ገጽ ላይ ይገኛል።'
            : 'Our administrative staff verifies payment proofs within 1 to 12 hours. Once approved, your digital card badge will be immediately available on the public verification portal.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={() => router.push(`/search?q=${encodeURIComponent(successData.membershipCode)}`)}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all"
          >
            {lang === 'am' ? 'በፍለጋ ገጹ ሁኔታውን ይከታተሉ' : 'Check Status on Search Portal'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-6 py-3 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all"
          >
            {lang === 'am' ? 'ወደ ዋና ገጽ ይመለሱ' : 'Return to Homepage'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          {lang === 'am' ? 'ለአባልነት ይመዝገቡ' : 'Register for Membership'}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {lang === 'am'
            ? 'መረጃዎን ያስገቡና የክፍያ ደረሰኝ በማያያዝ ይፋዊውን የዲጂታል ካርድዎን ያግኙ።'
            : 'Enter your details and submit your payment proof to receive your official digital pass.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tier Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {lang === 'am' ? 'የአባልነት ደረጃ ይምረጡ' : 'Select Membership Tier'} <span className="text-amber-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tiers.map((t) => {
              const isSelected = selectedTierId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTierId(t.id)}
                  className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-slate-100 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{t.name}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.badgeColor || '#E5A93C' }}
                    />
                  </div>
                  <span className="font-mono text-xs font-semibold text-amber-400">
                    {t.priceEtb.toLocaleString()} ETB
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={lang === 'am' ? 'ለምሳሌ፡ አበበ ከበደ' : 'e.g. Abebe Kebede'}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* International Phone Selector */}
        <InternationalPhoneSelector
          countryCode={countryCode}
          phoneNumber={phoneNumber}
          onCountryChange={(c: CountryItem) => {
            setCountry(c.name);
            setCountryCode(c.dial_code);
          }}
          onPhoneChange={(p: string) => setPhoneNumber(p)}
        />

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {lang === 'am' ? 'የኢሜይል አድራሻ (አስገዳጅ አይደለም)' : 'Email Address (Optional)'}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Payment Account Instructions Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-slate-200">
          <div className="flex items-center gap-2.5 mb-2.5 text-amber-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              {lang === 'am' ? 'የክፍያ መመሪያ እና የባንክ ሂሳብ ቁጥሮች' : 'Payment Instructions & Bank / Telebirr Details'}
            </span>
          </div>
          <div className="text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-medium">
            {lang === 'am'
              ? (branding.paymentInstructionsAm || branding.paymentInstructions || 'እባክዎ የአባልነት ክፍያዎን በኢትዮጵያ ንግድ ባንክ (CBE)፡ 1000234567890 ወይም በቴሌብር (Telebirr)፡ 0911234567 ገቢ ያድርጉ። በመቀጠል የደረሰኙን ስክሪንሾት ከዚህ በታች ያያይዙ።')
              : (branding.paymentInstructions || 'Please deposit the membership fee to Commercial Bank of Ethiopia (CBE): 1000234567890 or Telebirr: 0911234567. Then upload your transfer receipt or screenshot below.')}
          </div>
        </div>

        {/* File Uploads: Profile Photo & Payment Receipt */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {lang === 'am' ? 'የአባል ፎቶ (ለካርዱ የሚሆን)' : 'Member Photo (For Badge)'}
            </label>
            <div className="relative border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/40 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 font-medium truncate">
                {photoFile
                  ? photoFile.name
                  : (lang === 'am' ? 'የቁም ፎቶ ይምረጡ (JPG, PNG)' : 'Upload portrait photo (JPG, PNG)')}
              </p>
            </div>
          </div>

          {/* Payment Receipt */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              {lang === 'am' ? 'የክፍያ ደረሰኝ / ስክሪንሾት' : 'Payment Receipt / Screenshot'} <span className="text-amber-400">*</span>
            </label>
            <div className="relative border-2 border-dashed border-amber-500/40 hover:border-amber-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-950/40 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-amber-300 font-medium truncate">
                {receiptFile
                  ? receiptFile.name
                  : (lang === 'am' ? 'የደረሰኝ ማረጋገጫ ይምረጡ (JPG, PNG, PDF)' : 'Upload receipt proof (JPG, PNG, PDF)')}
              </p>
            </div>
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{lang === 'am' ? 'ማመልከቻው እየገባ ነው...' : 'Submitting Application...'}</span>
            </>
          ) : (
            <>
              <span>
                {lang === 'am'
                  ? `ምዝገባውን ያጠናቅቁ ${selectedTier ? `(${selectedTier.priceEtb.toLocaleString()} ብር)` : ''}`
                  : `Complete Registration (${selectedTier ? `${selectedTier.priceEtb.toLocaleString()} ETB` : ''})`}
              </span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <NavigationHeader />
      <div className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center text-slate-400">Loading form...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
