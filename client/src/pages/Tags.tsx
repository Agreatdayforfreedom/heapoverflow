import { nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Pagination from "../components/Pagination";
import Tag from "../components/Tag";
import { getTagsThunk } from "../features/tag/tagApi";
import { clearState } from "../features/tag/tagSlice";
import { Tag as ITag } from "../interfaces/interfaces";

interface Props {
  tag: ITag;
}
const Tags = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  const [skip, setSkip] = useState<number>(0);

  const dispatch = useAppDispatch();
  const { total, tags, loading } = useAppSelector((state) => state.tag);
  useEffect(() => {
    const fetch = async () => {
      dispatch(clearState());
      dispatch(getTagsThunk({ skip }));
    };
    fetch();
  }, []);

  useEffect(() => {
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
    }
  }, [currentQueryParameters]);

  if (loading) return <></>;
  return (
    <>
      <div className="p-5 ">
        <h1 className="text-2xl font-semibold mb-2 text-slate-700">Tags</h1>
        <p className="max-w-xl text-slate-700">
          A tag is a keyword or label that categorizes your question with other,
          similar questions. Using the right tags makes it easier for others to
          find and answer your question.
        </p>
      </div>
      <section>
        <div className="grid xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-1 m-3">
          {tags.map((tag) => (
            <TagCard key={nanoid()} tag={tag} />
          ))}
        </div>
        <div className="p-4">
          <Pagination items={total} limit={50} skip={skip} />
        </div>
      </section>
    </>
  );
};

const TagCard = ({ tag }: Props) => {
  return (
    <div className="border border-slate-300 rounded-sm p-3 flex flex-col justify-between">
      <div className="flex">
        <Tag tag={tag} className="m-0 mb-1" />
      </div>
      <p className="inline-block px-2 text-slate-600 text-sm break-all text-ellipsis line-clamp-3">
        {tag.infoTag}
      </p>
      <span className="px-2 text-slate-600 text-sm mt-3 block">
        {tag.totalQuestions} questions
      </span>
    </div>
  );
};

export default Tags;
