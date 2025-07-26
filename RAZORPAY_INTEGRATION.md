# Razorpay Integration for High On Hills

This document explains the Razorpay payment integration implemented in the trip registration form.

## Features

1. **Automatic Payment Processing**: When users fill the form and click "Pay & Register", Razorpay payment gateway opens
2. **Dynamic Amount**: The payment amount is taken from the user's input in the form
3. **Auto Transaction ID**: After successful payment, the transaction ID is automatically populated
4. **Payment Verification**: Server-side verification of payment signature for security
5. **Two-Step Registration**: 
   - Step 1: Fill form and make payment
   - Step 2: Complete registration with verified payment

## API Endpoints

### 1. Create Order (`/api/create-order`)
- **Method**: POST
- **Purpose**: Creates a Razorpay order with the specified amount
- **Request Body**: `{ amount: number, currency?: string }`
- **Response**: `{ orderId: string, amount: number, currency: string }`

### 2. Verify Payment (`/api/verify-payment`)
- **Method**: POST
- **Purpose**: Verifies the payment signature from Razorpay
- **Request Body**: `{ razorpay_order_id: string, razorpay_payment_id: string, razorpay_signature: string }`
- **Response**: `{ verified: boolean, orderId: string, paymentId: string }`

## Environment Variables

Create a `.env` file in the root directory with:

```
RAZORPAY_KEY_ID=rzp_test_QoFQ0QiJEK3jgC
RAZORPAY_KEY_SECRET=Uqp8KF8Ydmq8BFdcDzpBnkTb
```

## How It Works

1. **User fills the form** with their details and payment amount
2. **Clicks "Pay & Register"** button
3. **System validates** all required fields
4. **Creates Razorpay order** via `/api/create-order`
5. **Opens Razorpay modal** with payment options
6. **User completes payment** through Razorpay
7. **Payment is verified** via `/api/verify-payment`
8. **Transaction ID is auto-populated** in the form
9. **User clicks "Complete Registration"** to submit the form
10. **Registration is saved** with payment verification

## Security Features

- **Server-side order creation**: Orders are created on the server, not client-side
- **Payment signature verification**: All payments are verified using Razorpay's signature
- **Environment variables**: Sensitive keys are stored in environment variables
- **Input validation**: All form inputs are validated before processing

## Testing

For testing, use Razorpay's test mode with these test card details:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## Dependencies

- `razorpay`: Official Razorpay Node.js SDK
- `framer-motion`: For animations
- `lucide-react`: For icons

## File Structure

```
app/
├── api/
│   ├── create-order/
│   │   └── route.ts
│   ├── verify-payment/
│   │   └── route.ts
│   └── register/
│       └── route.ts
components/
└── animata/
    └── overlay/
        └── modal.tsx (updated with Razorpay integration)
``` 