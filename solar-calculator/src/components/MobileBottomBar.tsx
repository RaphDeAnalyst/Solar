"use client";

import Link from "next/link";
import { Calculator, MessageCircle, Phone, WhatsApp } from "lucide-react";

export default function MobileBottomBar() {
  const whatsappNumber = "2348123456789"; // Replace with actual WhatsApp business number
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 md:hidden z-50">
      <div className="flex justify-around items-center">
        {/* Call Button */}
        <a
          href="tel:+2348123456789"
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-green-600 transition-colors"
        >
          <Phone className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in solar solutions for my home`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-green-600 transition-colors"
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>

        {/* Calculator Button */}
        <Link
          href="/calculator"
          className="flex flex-col items-center py-2 px-3 bg-green-600 text-white rounded-lg mx-2"
        >
          <Calculator className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Calculator</span>
        </Link>

        {/* Chat Button */}
        <Link
          href="/chat"
          className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-green-600 transition-colors"
        >
          <MessageCircle className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Chat</span>
        </Link>
      </div>
    </div>
  );
}