import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import QuestionForm from "../components/QuestionForm";
import { getQuestionThunk } from "../features/question/questionApi";
import { Spinner } from "../components/Spinner";

const EditQuestion = () => {
  const params = useParams();

  const { question, loading } = useAppSelector((state) => state.question);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (params.id && !question) {
      dispatch(getQuestionThunk(params.id));
    }
  }, []);

  if (!user) return <Navigate to="/" />;
  if (loading || !question) return <Spinner />;
  const defaultValues = {
    title: question.title,
    content: question.content,
    tagsString: question.tags.map((x) => x.name).join(" "),
  };
  return (
    <div>
      <QuestionForm defaultValues={defaultValues} id={params.id} />
    </div>
  );
};

export default EditQuestion;
