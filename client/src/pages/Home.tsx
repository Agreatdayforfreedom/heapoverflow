import { nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import QuestionCard from "../components/QuestionCard";
import { getQuestionsThunk } from "../features/question/questionApi";
import { clearState } from "../features/question/questionSlice";
import { Question } from "../interfaces/interfaces";
import { Spinner } from "../components/Spinner";

const Home = () => {
  return (
    <div className="mt-5 w-full flex flex-col">
      <div className="flex justify-between mt-2 mb-5">
        <h1 className=" mx-5 text-3xl text-slate-700">Top Quesions</h1>
        <Link to="/questions/ask" className="button primary">
          Ask Question
        </Link>
      </div>
      <QuestionsSection />
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
    </div>
  );
};

const QuestionsSection = () => {
  const { questions, loading } = useAppSelector((state) => state.question);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearState());
    dispatch(getQuestionsThunk({ limit: 20 }));
  }, []);

  useEffect(() => {
    console.log({ questions });
  }, [questions]);

  if (loading || !questions) return <Spinner />;
  return (
    <section>
      {questions.map((q: Question) => (
        <QuestionCard key={nanoid()} question={q} />
      ))}
    </section>
  );
};

export default Home;
