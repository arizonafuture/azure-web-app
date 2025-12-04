"use client";
import { FiArrowRight } from "react-icons/fi";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const handlePrevious = () => {
    onPageChange(Math.max(1, currentPage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  };

  // ⭐ FIXED BLOCK LOGIC (5 pages per block)
  const blockSize = 5;

  // Calculate block number (0-based)
  const blockIndex = Math.floor((currentPage - 1) / blockSize);

  // Calculate start & end of block
  const startPage = blockIndex * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);
  // Generate page numbers in this block
  const pagesToShow = [];
  for (let i = startPage; i <= endPage; i++) {
    pagesToShow.push(i);
  }
  return (
    <div
      className={`flex items-center justify-center md:justify-start gap-4 md:gap-2 ${className}`}
    >
      {/* PREVIOUS BUTTON */}
      <button
        className={`p-2  transition-colors ${
          currentPage === 1 ? "text-gray-400" : "text-white hover:text-white"
        }`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <FiArrowRight className="transform rotate-180 text-xl" />
      </button>

      {/* PAGE BUTTONS (BLOCK OF 5) */}
      {pagesToShow.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-[18px] py-[14px] rounded-lg heading-6 !font-[Verdana] transition-all ${
            currentPage === page
              ? "bg-light-orange text-black font-bold"
              : "bg-white text-dark-blue-color hover:bg-gray-200"
          }`}
          aria-label={`Go to page ${page}`}
        >
          {page}
        </button>
      ))}

      {/* NEXT BUTTON */}
      <button
        className={`p-2 transition-colors ${
          currentPage === totalPages
            ? "text-gray-400"
            : "text-white hover:text-white"
        }`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <FiArrowRight className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
