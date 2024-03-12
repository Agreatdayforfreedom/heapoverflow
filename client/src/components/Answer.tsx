import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  acceptAnswerThunk,
  deleteAnswerThunk,
} from "../features/answer/answerApi";
import { Answer as IAnswer } from "../interfaces/interfaces";
import { configAxios } from "../utils/configAxios";
import AuthLink from "./AuthLink";
import CardUserInfo from "./CardUserInfo";
import CommentSection from "./CommentSection";
import { Spinner } from "./Spinner";
import Voting from "./Voting";

interface Props {
  answer: IAnswer;
}

const Answer = ({ answer }: Props) => {
  const { user, loading, token } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();
  const { question } = useAppSelector((state) => state.question);

  const config = configAxios(token);
  //cache the answer after creating it does not work
  const handleDelete = () => {
    dispatch(deleteAnswerThunk({ id: answer._id, config }));
  };
  return (
    <div className="flex w-full border-b border-slate-300 mt-5">
      <div className="flex flex-col">
        <Voting
          postId={answer._id && answer._id}
          ownerId={answer.owner._id}
          votes={{
            score: answer.score,
            total: answer.votesCount,
            vote: answer.vote,
          }}
        />
        {(question?.owner._id === user?._id || answer.accepted) && (
          <Accepted accepted={answer.accepted} id={answer._id} />
        )}
      </div>
      <div className="w-full px-4">
        <p className="break-all">{answer.content}</p>
        <div className="flex justify-between mt-4">
          <div className="flex">
            <p className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all">
              Share
            </p>
            <AuthLink
              to={`/answer/${answer._id}/edit`}
              name="Edit"
              className="text-sm text-slate-600 px-1 hover:cursor-pointer hover:text-slate-500 transition-all"
            />
            {user && user._id === answer.owner._id && (
              <button
                className="text-sm text-slate-600 flex items-start px-1 hover:cursor-pointer hover:text-slate-500 transition-all"
                onClick={handleDelete}
              >
                Delete
              </button>
            )}
          </div>
          <CardUserInfo user={answer.owner} from={answer} />
        </div>
        <CommentSection from={answer} type={"answer"} />
      </div>
    </div>
  );
};

const Accepted = ({ accepted, id }: { accepted: boolean; id: string }) => {
  const [isAccepted, setIsAccepted] = useState(accepted);
  const { token } = useAppSelector((state) => state.auth);

  const config = configAxios(token);

  const dispatch = useAppDispatch();
  const handleAccept = () => {
    setIsAccepted((prev) => !prev);

    dispatch(acceptAnswerThunk({ id, config }));
  };

  return (
    <div
      className={`check w-8 h-8 ${
        isAccepted ? "bg-[#3ab808]" : "bg-slate-400"
      }`}
    >
      <button className="w-8 h-8" onClick={handleAccept}></button>
    </div>
  );
};

export default Answer;
