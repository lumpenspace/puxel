import { useState } from "react";
import { Pagination } from "puxel";

export function WithEllipsis() {
  const [page, setPage] = useState(5);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

export function FewPages() {
  const [page, setPage] = useState(2);
  return <Pagination page={page} pageCount={3} onPageChange={setPage} />;
}
