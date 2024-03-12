import { nanoid } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import Answers from "../components/Answers";
import AuthLink from "../components/AuthLink";
import CardUserInfo from "../components/CardUserInfo";
import CommentSection from "../components/CommentSection";
import { Spinner } from "../components/Spinner";
import Tag from "../components/Tag";
import Voting from "../components/Voting";
import {
  getQuestionThunk,
  removeQuestionThunk,
} from "../features/question/questionApi";
import { clearState } from "../features/question/questionSlice";
import { Tag as ITag } from "../interfaces/interfaces";
import { configAxios } from "../utils/configAxios";
import { formatDate } from "../utils/formatDate";

const Question = () => {
  const { question, loading, token } = useAppSelector(
    (state) => state.question
  );
  const { user, loading: loadingAuth } = useAppSelector((state) => state.auth);

  const config = configAxios(token);

  const dispatch = useAppDispatch();
  const params = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(clearState());
    if (params.id) {
      dispatch(getQuestionThunk({ id: params.id, userId: user?._id || "" }));
    }
  }, [user]);

  const handleRemove = () => {
    if (params.id) {
      dispatch(removeQuestionThunk({ id: params.id, config }));
      if (!loading) {
        navigate(`/`);
      }
    }
  };
  if (loading || !question || loadingAuth) return <Spinner />;
  return (
    <section className="p-4 w-full">
      {/* header */}
      <div className="border-b border-slate-300 px-2 pb-4">
        <h1 className="text-2xl text-gray-700">{question.title}</h1>
        <div className="flex pt-1">
          <p className="text-sm text-slate-600 px-2">
            Asked{" "}
            <span className="text-slate-800">
              {formatDate(question.createdAt)}
            </span>
          </p>
          <p className="text-sm text-slate-600 px-2">
            Modified{" "}
            <span className="text-slate-800">
              {formatDate(question.updatedAt)}
            </span>
          </p>
          <p className="text-sm text-slate-700 px-2">
            Viewed <span className="text-black">23</span>
          </p>
        </div>
      </div>
      <div className="flex w-full">
        <Voting
          postId={question._id}
          ownerId={question.owner._id}
          votes={{
            score: question.score,
            total: question.votesCount,
            vote: question.vote || undefined,
          }}
        />
        <div className="w-full p-4">
          <p className="break-all">{question.content}</p>
          <div className="flex my-5">
            {question &&
              question.tags.map((tag: ITag) => (
                <Tag key={nanoid()} tag={tag} />
              ))}
          </div>
          <div className="flex justify-between">
            <div className="flex">
              <p className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all">
                Share
              </p>
              <AuthLink
                to={`/questions/${question._id}/edit`}
                name="Edit"
                className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all"
              />
              {question.owner._id.toString() === user?._id ? (
                <button
                  onClick={handleRemove}
                  className="text-sm flex items-start text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all"
                >
                  Delete
                </button>
              ) : (
                <p className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all">
                  Follow
                </p>
              )}
              <p className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all">
                Flag
              </p>
            </div>
            <CardUserInfo user={question.owner} from={question} />
          </div>
          <CommentSection from={question} type="question" />
        </div>
      </div>
      <Answers />
    </section>
  );
};

export default Question;
