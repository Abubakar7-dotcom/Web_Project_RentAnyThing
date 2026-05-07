import { useState } from 'react';
import { X, Lock, CheckCircle, CreditCard as CreditCardIcon } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  amount: number;
  rentalDetails: {
    itemName: string;
    startDate: string;
    endDate: string;
  };
}

export function PaymentModal({ isOpen, onClose, onConfirm, amount, rentalDetails }: PaymentModalProps) {
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('US');
  const [zipCode, setZipCode] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (cleaned.startsWith('5')) return 'mastercard';
    if (cleaned.startsWith('3')) return 'amex';
    return 'generic';
  };

  const cardType = getCardType(cardNumber);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate payment processing
    setStep('processing');
    
    try {
      await onConfirm();
      setStep('success');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        resetForm();
      }, 2000);
    } catch (error) {
      setStep('payment');
      alert('Payment failed. Please try again.');
    }
  };

  const resetForm = () => {
    setStep('payment');
    setCardNumber('');
    setCardName('');
    setExpiryDate('');
    setCvv('');
    setEmail('');
    setCountry('US');
    setZipCode('');
    setIsFlipped(false);
  };

  const handleClose = () => {
    if (step !== 'processing') {
      onClose();
      resetForm();
    }
  };

  const CardBrandLogo = ({ type }: { type: string }) => {
    if (type === 'visa') {
      return (
        <div className="text-white font-bold text-xl tracking-wider">VISA</div>
      );
    }
    if (type === 'mastercard') {
      return (
        <div className="flex gap-[-8px]">
          <div className="w-8 h-8 rounded-full bg-red-500 opacity-80" />
          <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80 -ml-4" />
        </div>
      );
    }
    if (type === 'amex') {
      return (
        <div className="text-white font-bold text-lg">AMEX</div>
      );
    }
    return <CreditCardIcon className="w-8 h-8 text-white/60" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header - Stripe Style */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Secure payment</span>
          </div>
          {step !== 'processing' && (
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-lg hover:bg-muted transition-colors flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
            <p className="text-muted-foreground">Please wait while we process your payment securely.</p>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">Your rental has been confirmed.</p>
          </div>
        )}

        {/* Payment Form */}
        {step === 'payment' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Visual Credit Card */}
            <div className="perspective-1000">
              <div 
                className={`relative w-full h-52 transition-transform duration-600 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Front */}
                <div 
                  className="absolute inset-0 backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 shadow-2xl">
                    {/* Card Chip */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="w-12 h-10 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md" />
                      <CardBrandLogo type={cardType} />
                    </div>
                    
                    {/* Card Number */}
                    <div className="mb-6">
                      <div className="text-white text-2xl tracking-widest font-mono">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                    </div>
                    
                    {/* Card Name and Expiry */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-white/60 text-xs mb-1">CARDHOLDER NAME</div>
                        <div className="text-white text-sm font-medium tracking-wide">
                          {cardName || 'YOUR NAME'}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs mb-1">EXPIRES</div>
                        <div className="text-white text-sm font-medium tracking-wider">
                          {expiryDate || 'MM/YY'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Back */}
                <div 
                  className="absolute inset-0 backface-hidden rotate-y-180"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="w-full h-12 bg-black mt-6" />
                    <div className="px-6 mt-6">
                      <div className="flex justify-end">
                        <div className="bg-white px-4 py-2 rounded text-black font-mono text-lg">
                          {cvv || '•••'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details - Stripe Style */}
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              {/* Card Information */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Card information</label>
                <div className="border border-border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
                  <input
                    type="text"
                    placeholder="1234 1234 1234 1234"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    onFocus={() => setIsFlipped(false)}
                    className="w-full px-4 py-3 bg-background border-0 border-b border-border focus:outline-none text-foreground placeholder:text-muted-foreground"
                    required
                    maxLength={19}
                  />
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="MM / YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      onFocus={() => setIsFlipped(false)}
                      className="flex-1 px-4 py-3 bg-background border-0 border-r border-border focus:outline-none text-foreground placeholder:text-muted-foreground"
                      required
                      maxLength={7}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      className="flex-1 px-4 py-3 bg-background border-0 focus:outline-none text-foreground placeholder:text-muted-foreground"
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Cardholder name</label>
                <input
                  type="text"
                  placeholder="Full name on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  onFocus={() => setIsFlipped(false)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>

              {/* Country and ZIP */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Billing address</label>
                <div className="space-y-3">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                    required
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="IN">India</option>
                  </select>
                  <input
                    type="text"
                    placeholder="ZIP / Postal code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').substring(0, 10))}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-2 border border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Item</span>
                <span className="font-medium text-foreground">{rentalDetails.itemName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium text-foreground">
                  {new Date(rentalDetails.startDate).toLocaleDateString()} - {new Date(rentalDetails.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Payments are secure and encrypted</span>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-primary/30 font-semibold text-lg"
            >
              Pay ${amount.toFixed(2)}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
