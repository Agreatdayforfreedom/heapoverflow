import { nanoid } from "@reduxjs/toolkit";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  createAnswerThunk,
  getAnswersThunk,
} from "../features/answer/answerApi";
import { setQuestionId } from "../features/answer/answerSlice";
import { useForm } from "../hooks/useForm";
import { configAxios } from "../utils/configAxios";
import Answer from "./Answer";
import Blank from "./Blank";
import Button from "./Button";
import { Spinner } from "./Spinner";
import Pagination from "./Pagination";

const Answers = () => {
  const [currentQueryParameters, setSearchParams] = useSearchParams();

  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);

  const { answers, total, loading } = useAppSelector((state) => state.answers);
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      dispatch(getAnswersThunk({ id: params.id, limit, skip }));
    }
  }, [limit, skip]);

  useEffect(() => {
    if (currentQueryParameters.get("skip")) {
      setSkip(parseInt(currentQueryParameters.get("skip")!, 10));
    }
  }, [currentQueryParameters]);

  if (loading) return <Spinner size="2rem" />;
  return (
    <div>
      {total > 0 && (
        <h1 className="font-semibold text-xl">
          <span>{total} </span>
          {total === 1 ? "Answer" : "Answers"}
        </h1>
      )}
      {answers.map((answer) => (
        <Answer key={nanoid()} answer={answer} />
      ))}
      <div className="mt-5">
        <Pagination items={total} limit={limit} skip={skip} />
      </div>
      <PostAnswer />
    </div>
  );
};

const PostAnswer = () => {
  const [fill, setFill] = useState(true);

  const { user, token } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.answers);
  const dispatch = useAppDispatch();

  const params = useParams();
  const navigate = useNavigate();
  const { handleChange, form, reset } = useForm<{ content: string }>();

  const config = configAxios(token);

  useEffect(() => {
    if ("content" in form && form.content.trim() !== "") {
      setFill(true);
    } else {
      setFill(false);
    }
  }, [form]);

  useEffect(() => {
    dispatch(setQuestionId(params.id));
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    const payload = form;
    if (params.id) {
      dispatch(createAnswerThunk({ id: params.id, payload, config }));
      reset({ content: "" });
    }
  };

  return (
    <div className="p-2 mt-5">
      <h2 className=" text-lg">Your Answer</h2>
      <form className="mt-5" onSubmit={handleSubmit}>
        <textarea
          name="content"
          id="content"
          onChange={handleChange}
          value={form.content}
          className="w-full mb-4 bg-transparent rounded border p-2 border-slate-400"
        ></textarea>
        <Button name={"Post your answer"} disabled={!fill || loading} />
      </form>
    </div>
  );
};

export default Answers;
