import { nanoid } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import AuthLink from "../components/AuthLink";
import Pagination from "../components/Pagination";
import QuestionCard from "../components/QuestionCard";
import { Spinner } from "../components/Spinner";
import { getQuestionsByTagThunk } from "../features/question/questionApi";
import { getTagThunk } from "../features/tag/tagApi";

const Tagged = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const [limit, setLimit] = useState(15);
  const [skip, setSkip] = useState(0);

  const params = useParams();

  const { tag, loading: loadingTag } = useAppSelector((state) => state.tag);
  const { questions, loading, total } = useAppSelector(
    (state) => state.question
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (tag) dispatch(getQuestionsByTagThunk({ id: tag._id, limit, skip }));
  }, [tag]);

  useEffect(() => {
    if (params.tag) {
      setTimeout(() => {
        dispatch(getTagThunk({ tag: params.tag }));
      }, 100);
    }
  }, [limit, skip, params.tag]);

  useEffect(() => {
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
    }
  }, [currentQueryParameters]);
  if (!tag || loadingTag || loading) return <Spinner />;
  return (
    <div>
      <div>
        <h1 className="p-4 text-2xl font-semibold text-slate-700">
          Questions tagged [{tag.name}]
        </h1>
        <p className="text-sm px-4 pb-4 break-all">{tag.infoTag}</p>
        <div className="text-end mx-3">
          <AuthLink
            name="Improve tag info"
            to={`/edit-tag/${tag.name}`}
            className="text-blue-500 text-sm"
          />
        </div>
        <p className="text-lg text-slate-600 p-4">{total} questions</p>
      </div>

      <section>
        {questions.map((question) => (
          <QuestionCard key={nanoid()} question={question} />
        ))}
        <div className="p-4">
          <Pagination items={total} limit={limit} skip={skip} />
        </div>
      </section>
    </div>
  );
};

export default Tagged;
