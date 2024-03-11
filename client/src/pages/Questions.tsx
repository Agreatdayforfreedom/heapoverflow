import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Blank from "../components/Blank";
import Pagination from "../components/Pagination";
import QuestionCard from "../components/QuestionCard";
import { getQuestionsThunk } from "../features/question/questionApi";
import { clearState } from "../features/question/questionSlice";
import { Question } from "../interfaces/interfaces";
import { Spinner } from "../components/Spinner";

const Questions = () => {
  return (
    <div className="mt-5 w-full flex flex-col">
      <div className="flex justify-between mt-2 mb-1 mx-5 ">
        <h1 className="text-3xl text-slate-700">All questions</h1>
        <Link to="/questions/ask" className="button primary">
          Ask Question
        </Link>
      </div>
      <QuestionsSection />
    </div>
  );
};

const QuestionsSection = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(40);

  const { questions, total, loading } = useAppSelector(
    (state) => state.question
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearState());
    dispatch(getQuestionsThunk({ limit, skip }));
  }, [skip, limit]);

  useEffect(() => {
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
    }
  }, [currentQueryParameters]);

  if (loading) return <Spinner />;

  return (
    <section>
      <span className="block my-3 text-slate-600 mx-5">{total} questions</span>
      {questions.map((q: Question) => (
        <QuestionCard key={nanoid()} question={q} />
      ))}

      <div className=" border-t border-slate-400 h-20 p-5">
        <Pagination items={total} limit={limit} skip={skip} />
      </div>
    </section>
  );
};

export default Questions;
