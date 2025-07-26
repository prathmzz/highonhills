import FaqSection from "@/components/animata/accordian/faq";

export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Frequently Asked Questions</h1>
      <FaqSection
        data={[
          {
            id: 1,
            question: "What all is included in the trip?",
            answer: "The package includes travel (train + bus), accommodation, breakfast & dinner, sightseeing, DJ night, bonfire, games, and entry passes to key locations.",
            icon: "🎒",
            iconPosition: "left",
          },
          {
            id: 2,
            question: "How do I register and make the payment?",
            answer: "Click on the Register page, fill the form, and proceed to online payment via Razorpay or UPI. Your seat is confirmed only after successful payment.",
            icon: "💳",
            iconPosition: "right",
          },
          {
            id: 3,
            question: "What is the refund policy?",
            answer: "Full refund if cancelled within 48 hours of payment. After that, partial refunds apply depending on how close it is to departure.",
            icon: "💰",
            iconPosition: "left",
          },
          {
            id: 4,
            question: "Can students outside VESIT join the trip?",
            answer: "This trip is primarily for VESIT BE students. Outsiders may be allowed if they are friends of participants and approved by organizers.",
            icon: "🧑‍🤝‍🧑",
            iconPosition: "right",
          },
          {
            id: 5,
            question: "What should I carry for the trip?",
            answer: "Warm clothes, valid ID card, travel snacks, emergency meds, a power bank, and a camera or phone for memories!",
            icon: "🎒",
            iconPosition: "left",
          },
        ]}
      />
    </main>
  );
}
