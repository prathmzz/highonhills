"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleAlert,
  X,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  GraduationCap,
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ');

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  modalSize?: "sm" | "lg";
  onClose?: () => void; // new prop for close callback
};

// Add index signature to formData type
interface FormData {
  name: string;
  class: string;
  department: string;
  phone: string;
  email: string;
  amount: string;
  transactionID: string;
  [key: string]: string; // index signature for dynamic access
}

// Notification component
function Notification({ message, onClose, success }: { message: string; onClose: () => void; success: boolean }) {
  return (
    <div className={cn(
      "fixed inset-0 z-[10000] flex items-center justify-center bg-black/60",
      success ? "" : ""
    )}>
      <div className={cn(
        "rounded-xl p-8 shadow-lg text-center",
        success ? "bg-green-600 text-white" : "bg-red-600 text-white"
      )}>
        <p className="mb-4 text-lg font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 rounded bg-white text-black font-medium hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function Modal({ isOpen, setIsOpen, modalSize = "lg", onClose }: ModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    class: "",
    department: "",
    phone: "",
    email: "",
    amount: "",
    transactionID: "",
  });
  const [focusedField, setFocusedField] = useState("");
  const [notification, setNotification] = useState<{ message: string; success: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createRazorpayOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async (amount: number) => {
    try {
      setIsProcessingPayment(true);
      
      // Create Razorpay order
      const orderData = await createRazorpayOrder(amount);
      
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_QoFQ0QiJEK3jgC', // Your Razorpay key ID
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'High On Hills',
        description: 'Trip Registration Payment',
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResult.verified) {
              // Update form data with transaction ID
              setFormData(prev => ({
                ...prev,
                transactionID: response.razorpay_payment_id,
              }));
              
              setNotification({ 
                message: "Payment successful! Transaction ID: " + response.razorpay_payment_id, 
                success: true 
              });
            } else {
              setNotification({ 
                message: "Payment verification failed", 
                success: false 
              });
            }
          } catch (error) {
            setNotification({ 
              message: "Payment verification failed", 
              success: false 
            });
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setNotification({ 
        message: "Payment initialization failed", 
        success: false 
      });
      setIsProcessingPayment(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.class || !formData.department || !formData.phone || !formData.email || !formData.amount) {
      setNotification({ message: "Please fill all required fields", success: false });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setNotification({ message: "Please enter a valid amount", success: false });
      return;
    }

    // If no transaction ID, initiate payment
    if (!formData.transactionID) {
      await handlePayment(amount);
      return;
    }

    // If transaction ID exists, proceed with registration
    setIsSubmitting(true);
    const now = new Date();
    const date = now.toLocaleDateString("en-GB");
    const time = now.toLocaleTimeString("en-GB");
    const payload = { ...formData, date, time };
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setNotification({ message: "Registered successfully!", success: true });
        setFormData({
          name: "",
          class: "",
          department: "",
          phone: "",
          email: "",
          amount: "",
          transactionID: "",
        });
        setIsOpen(false);
      } else {
        setNotification({ message: "Registration failed, please contact xyz: 9324643221", success: false });
      }
    } catch (error) {
      setNotification({ message: "Registration failed, please contact xyz: 9324643221", success: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    { name: "name", placeholder: "Full Name", type: "text", icon: User },
    {
      name: "class",
      placeholder: "Class (e.g., TE IT-A)",
      type: "text",
      icon: GraduationCap,
    },
    {
      name: "department",
      placeholder: "Department",
      type: "text",
      icon: Building,
    },
    { name: "phone", placeholder: "Phone Number", type: "tel", icon: Phone },
    { name: "email", placeholder: "Email ID", type: "email", icon: Mail },
    { name: "amount", placeholder: "Payment Amount (₹)", type: "number", icon: CreditCard },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
          className="fixed inset-0 z-[9999] flex cursor-pointer items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
              },
            }}
            exit={{
              scale: 0.8,
              opacity: 0,
              y: 50,
              transition: { duration: 0.2 },
            }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full max-w-md cursor-default overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 shadow-2xl border border-slate-700/50",
              modalSize === "sm" ? "max-w-sm p-6" : undefined
            )}
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
            >
              <X size={20} />
            </motion.button>

            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

            <div className="relative flex flex-col gap-6">
              {/* Enhanced Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center text-center mb-2"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg border-4 border-white/20"
                >
                  <CircleAlert className="text-white" size={36} />
                </motion.div>
                <div className="flex flex-col items-center gap-2">
                  <h3
                    className={cn(
                      "font-extrabold text-white mb-1 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent drop-shadow-lg",
                      modalSize === "sm" ? "text-2xl" : "text-3xl"
                    )}
                  >
                    Trip Registration
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-pink-400 text-xs font-bold text-white shadow-md animate-pulse">
                    Early Bird Offer
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-2">
                  Fill in your details to join the adventure
                </p>
              </motion.div>

              {/* Form Fields */}
              <div className="space-y-4">
                {inputFields.map((field, index) => {
                  const Icon = field.icon;
                  const isFocused = focusedField === field.name;
                  const hasValue =
                    formData[field.name as keyof typeof formData] !== "";

                  return (
                    <motion.div
                      key={field.name}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="relative group"
                    >
                      <div
                        className={cn(
                          "relative flex items-center rounded-xl border transition-all duration-300",
                          isFocused
                            ? "border-blue-400 bg-slate-800/80 shadow-lg shadow-blue-500/20"
                            : "border-slate-600 bg-slate-800/50",
                          hasValue && !isFocused
                            ? "border-slate-500 bg-slate-800/70"
                            : ""
                        )}
                      >
                        <div
                          className={cn(
                            "absolute left-4 transition-colors duration-300",
                            isFocused
                              ? "text-blue-400"
                              : hasValue
                              ? "text-slate-300"
                              : "text-slate-500"
                          )}
                        >
                          <Icon size={18} />
                        </div>
                        <input
                          name={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          className="w-full bg-transparent pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500"
                          value={formData[field.name as keyof typeof formData]}
                          onChange={handleChange}
                          onFocus={() => setFocusedField(field.name)}
                          onBlur={() => setFocusedField("")}
                          required
                        />
                        {isFocused && (
                          <motion.div
                            layoutId="inputGlow"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Transaction ID Display */}
                {formData.transactionID && (
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + inputFields.length * 0.05 }}
                    className="relative group"
                  >
                    <div className="relative flex items-center rounded-xl border border-green-500 bg-green-500/10 transition-all duration-300">
                      <div className="absolute left-4 text-green-400">
                        <CreditCard size={18} />
                      </div>
                      <div className="w-full pl-12 pr-4 py-4 text-green-300">
                        Transaction ID: {formData.transactionID}
                      </div>
                      <div className="absolute right-4 text-green-400">
                        ✓ Paid
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 px-6 rounded-xl border border-slate-600 bg-slate-800/50 text-slate-300 font-medium hover:bg-slate-700/50 hover:border-slate-500 hover:text-white transition-all duration-200 backdrop-blur-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting || isProcessingPayment}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Registering..." : 
                     isProcessingPayment ? "Processing Payment..." :
                     formData.transactionID ? "Complete Registration" : "Pay & Register"}
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-xl" />
          </motion.div>
        </motion.div>
      )}
      {notification && (
        <Notification
          message={notification.message}
          success={notification.success}
          onClose={() => setNotification(null)}
        />
      )}
    </AnimatePresence>
  );
}
