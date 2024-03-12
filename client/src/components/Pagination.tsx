import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface Props {
  items: number;
  limit: number;
  skip: number;
  currentPage?: number;
}

const Pagination = ({ items, limit, skip }: Props) => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const [pages, setPages] = useState<number>(Math.ceil(items / limit));
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    if (typeof skip === "number") {
      setSearchParams(currentQueryParameters);
    }
  }, [skip]);

  useEffect(() => {
    const page = currentQueryParameters.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [currentQueryParameters]);

  const handleClick = (i: number) => {
    currentQueryParameters.set("page", ((limit / limit) * i).toString());

    currentQueryParameters.set(
      "skip",
      (limit * ((limit / limit) * i) - limit).toString()
    );

    setSearchParams(currentQueryParameters);
  };
  if (pages === 0) return null;
  return (
    <div className="flex">
      {pages &&
        [...Array(pages)].map((_, i) => (
          <button
            key={nanoid()}
            className={`${
              currentPage === i + 1 &&
              "bg-orange-500 hover:!opacity-100 border-orange-500"
            } border mx-1 border-slate-500 rounded w-7 h-7 flex items-center justify-center text-sm hover:opacity-60 transition-colors`}
            onClick={() => handleClick(i + 1)}
          >
            {i + 1}
          </button>
        ))}
    </div>
  );
};

export default Pagination;
