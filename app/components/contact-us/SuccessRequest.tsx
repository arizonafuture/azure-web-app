"use client";

export default function SuccessRequest() {
  return (
    <div
      className="
        p-0 md:p-12.5
        w-full
      "
    >
      <h2 className="heading-2 text-center text-[var(--dark-blue-color)] font-bold mb-6">
        Thank You for Your Request
      </h2>

      <p className="subhead text-center text-[var(--blue-color)] max-w-3xl mx-auto !self-stretch !text-center">
        We have received your inquiry. A member of our team will review your
        request and respond as quickly as possible with the information or
        support you've asked for.
      </p>
    </div>
  );
}
