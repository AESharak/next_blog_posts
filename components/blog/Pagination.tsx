"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();

  // Generate page numbers
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === 1}
      >
        <Link
          href={{
            pathname,
            query: { page: currentPage > 1 ? currentPage - 1 : 1 },
          }}
          aria-label="Previous page"
        >
          <Icons.arrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      {startPage > 1 && (
        <>
          <Button variant={currentPage === 1 ? "default" : "outline"} asChild>
            <Link href={{ pathname, query: { page: 1 } }}>1</Link>
          </Button>
          {startPage > 2 && (
            <Button variant="outline" disabled>
              ...
            </Button>
          )}
        </>
      )}

      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === currentPage ? "default" : "outline"}
          asChild
        >
          <Link href={{ pathname, query: { page: pageNumber } }}>
            {pageNumber}
          </Link>
        </Button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <Button variant="outline" disabled>
              ...
            </Button>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            asChild
          >
            <Link href={{ pathname, query: { page: totalPages } }}>
              {totalPages}
            </Link>
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link
          href={{
            pathname,
            query: {
              page: currentPage < totalPages ? currentPage + 1 : totalPages,
            },
          }}
          aria-label="Next page"
        >
          <Icons.arrowLeft className="h-4 w-4 rotate-180" />
        </Link>
      </Button>
    </div>
  );
}
