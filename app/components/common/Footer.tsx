"use client";

import { useState, FormEvent } from "react";
import {
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";
import InputWithButton from "./InputWithButton";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer
      className="text-white w-full flex flex-col items-center"
      style={{
        background:
          "linear-gradient(0deg, #18254E, #18254E), linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
        minHeight: "auto",
      }}
    >
      {/* Main Footer Content */}
      <div className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 lg:px-[135px] pt-10 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-[30px] border-b border-gray-400 pb-8 md:pb-10">
          {/* Left Column - Logos and Affiliation */}
          <div className="flex flex-col md:col-span-4">
            {/* Two Logos Side by Side */}
            <div className="flex items-center gap-4 mb-4">
              {/* Center for the Future of Arizona Logo */}
              <div className="flex items-center">
                <div className="flex flex-col items-center">
                  {/* Logo Icon */}
                  <img
                    src="/logoWhite.png"
                    alt="Center for the Future of Arizona"
                    className="h-12 sm:h-16 md:h-[82px] w-auto mb-2"
                  />
                </div>
              </div>
            </div>

            {/* Affiliation Text */}
            <p className="text-sm text-white mb-2">
              From Center for the Future of Arizona
            </p>

            {/* Website Link */}
            <a
              href="https://arizonafuture.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline text-sm hover:text-gray-300 transition-colors"
            >
              arizonafuture.org
            </a>
          </div>

          {/* Middle Column - Useful Links */}
          <div className="flex flex-col md:col-span-3">
            <h3 className="text-base sm:text-lg font-bold mb-3 md:mb-4">
              Useful Links
            </h3>
            <ul className="grid grid-cols-2 md:flex md:flex-col gap-2 md:gap-3 text-sm">
              <li>
                <a
                  href="/accessibility"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Accessibility
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms-conditions"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Newsletter & Social Media */}
          <div className="flex flex-col md:col-span-5">
            <h3 className="text-base sm:text-lg font-bold mb-3 md:mb-4">
              Media Institute Newsletter
            </h3>

            {/* Newsletter Signup */}
            <form onSubmit={handleSubmit} className="mb-4 md:mb-6">
              <InputWithButton
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value as string)}
                placeholder="Email Address"
                buttonText="Subscribe"
              />
            </form>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 md:gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="X (Twitter)"
              >
                <FaXTwitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="text-center w-full py-6 md:py-10 px-4 sm:px-6 md:px-8 lg:px-[135px]">
        <p className="text-xs sm:text-sm text-white">
          ©2025 Center for the Future of Arizona. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
