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
import { Tag } from "../interfaces/interfaces";

const Tagged = () => {
  const params = useParams();

  const { tag, loading } = useAppSelector((state) => state.tag);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (params.tag) {
      dispatch(getTagThunk({ tag: params.tag }));
    }
  }, [params.tag]);

  // console.log(loading);
  if (!tag || loading) return <Spinner />;
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
      </div>
      <TaggedSection tag={tag} />
    </div>
  );
};

const TaggedSection = ({ tag }: { tag: Tag }) => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  const dispatch = useAppDispatch();

  const { questions, loading, total } = useAppSelector(
    (state) => state.question
  );

  useEffect(() => {
    dispatch(
      getQuestionsByTagThunk({
        id: tag._id,
        limit,
        skip,
      })
    );
  }, [skip, limit]);

  useEffect(() => {
    console.log(currentQueryParameters.get("skip"), "<<<");
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
      dispatch(
        getQuestionsByTagThunk({
          id: tag._id,
          limit,
          skip,
        })
      );
    }
  }, [currentQueryParameters]);

  if (loading) return <Spinner />;
  return (
    <section>
      <p className="text-lg text-slate-600 p-4">{total} questions</p>

      {questions.map((question) => (
        <QuestionCard key={nanoid()} question={question} />
      ))}
      <div className="p-4">
        <Pagination items={total} limit={limit} skip={skip} />
      </div>
    </section>
  );
};

export default Tagged;
