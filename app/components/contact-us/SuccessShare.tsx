"use client";

export default function SuccessShare() {
  return (
    <div
      className="
          p-0 md:p-12.5
          w-full
        "
    >
      <h2 className="heading-2 text-center text-[var(--dark-blue-color)] font-bold mb-6">
        Thank You for Sharing Your Story
      </h2>

      <p className="subhead text-[var(--blue-color)] mb-7 max-w-3xl mx-auto !self-stretch !text-center">
        We appreciate you taking the time to tell us how the Arizona Media
        Institute informed your reporting. Your submission helps us highlight
        how credible data and expert context strengthen journalism across
        Arizona.
      </p>

      <p className="subhead text-[var(--blue-color)] mb-7 max-w-3xl mx-auto !self-stretch !text-center">
        Articles submitted through this form may be featured on our website or
        shared through our communications to spotlight the meaningful work of
        Arizona media professionals.
      </p>

      <p className="subhead text-[var(--blue-color)] max-w-3xl mx-auto !self-stretch !text-center ml-[10px]">
        Thank you for your voice and commitment to impactful storytelling.
      </p>
    </div>
  );
}
