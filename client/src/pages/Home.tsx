import { nanoid } from "@reduxjs/toolkit";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import QuestionCard from "../components/QuestionCard";
import { Spinner } from "../components/Spinner";
import Tag from "../components/Tag";
import { getQuestionsThunk } from "../features/question/questionApi";
import { clearState } from "../features/question/questionSlice";
import { Question, Tag as ITag } from "../interfaces/interfaces";

const Home = () => {
  const { questions, loading } = useAppSelector((state) => state.question);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearState());

    dispatch(getQuestionsThunk({ limit: 20 }));
  }, []);

  if (loading) return <></>;
  return (
    <section className="mt-5 w-full flex flex-col">
      <div className="flex justify-between mt-2 mb-5">
        <h1 className=" mx-5 text-3xl text-slate-700">Top Quesions</h1>
        <Link to="/questions/ask" className="button primary">
          Ask Question
        </Link>
      </div>
      {questions.map((q: Question) => (
        <QuestionCard key={nanoid()} question={q} />
      ))}
      <h2 className="text-lg p-5 text-slate-700">
        Looking for more? Browse
        <Link to="/questions" className="text-blue-500 hover:text-blue-600 ">
          {" "}
          the complete list of questions
        </Link>
        , or
        <Link to="/tags" className="text-blue-500 hover:text-blue-600 ">
          {" "}
          popular tags.
        </Link>
      </h2>
    </section>
  );
};

export default Home;
