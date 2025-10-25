"use client"
import { useState, useEffect } from "react";

interface PaginationProps {
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  totalPages: number;
  total: number;
  limit: number;
}

export const Pagination = ({ page, setPage, totalPages, total, limit }: PaginationProps) => {
  const [maxButtons, setMaxButtons] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      setMaxButtons(window.innerWidth < 640 ? 3 : 5);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (totalPages <= 1) return null;

  return (
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
        <p className="text-sm text-base-content/70">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
          {total}
        </p>

        <div className="join">
          <button
              className="join-item btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p: number) => p - 1)}
          >
            Previous
          </button>

          {Array.from({ length: Math.min(maxButtons, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= maxButtons) {
              pageNum = i + 1;
            } else if (page <= Math.floor(maxButtons / 2) + 1) {
              pageNum = i + 1;
            } else if (page >= totalPages - Math.floor(maxButtons / 2)) {
              pageNum = totalPages - maxButtons + 1 + i;
            } else {
              pageNum = page - Math.floor(maxButtons / 2) + i;
            }

            return (
                <button
                    key={pageNum}
                    className={`join-item btn btn-sm ${page === pageNum ? 'btn-active' : ''}`}
                    onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
            );
          })}

          <button
              className="join-item btn btn-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p: number) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
  );
};