import { nanoid } from "@reduxjs/toolkit";
import React from "react";
import { Link } from "react-router-dom";
import { Question, Tag as ITag } from "../interfaces/interfaces";
import { formatDate } from "../utils/formatDate";
import Tag from "./Tag";
import moment from "moment";

interface Props {
  question: Question;
}

const QuestionCard = ({ question }: Props) => {
  console.log(question);
  return (
    <div className="flex flex-col md:flex-row w-full py-2 border-t last:!border-y border-slate-400">
      <div className="flex flex-row items-center md:flex-col md:items-end w-28">
        <p className="flex text-sm text-slate-900 py-1 mx-1">
          <span className="px-1">{question.votes}</span> votes
        </p>
        <div
          className={`${
            question.answerAccepted && "bg-green-700 !text-white p-0.5"
          } ${
            question.answers! > 0 &&
            "border-green-700 border rounded text-green-700 px-0.5"
          } flex text-sm text-slate-600 items-center`}
        >
          {question.answerAccepted! > 0 && (
            <span className="check w-4 h-4 translate-y-[2px] bg-slate-200 mx-1"></span>
          )}
          <span className="pr-1">{question.answers}</span>
          {question.answers! > 1 ? <span> answers</span> : <span>answer</span>}
        </div>
        <p className="flex text-sm text-slate-600 py-1">
          <span className="px-1">0</span> views
        </p>
      </div>
      <div className="w-full">
        <div className="flex">
          <div className="ml-4">
            <Link
              to={`/questions/${question._id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              {question.title}
            </Link>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row w-full">
          <div className="flex px-3 w-full ">
            {question.tags.map((tag: ITag) => (
              <Tag key={nanoid()} tag={tag} />
            ))}
          </div>

          <div className="flex items-end justify-end">
            <img
              src={question.owner.avatar}
              alt={question.owner.username}
              className="w-4 h-4 rounded"
            ></img>
            <Link
              to={`/users/${question.owner._id}`}
              className="mx-1 text-xs text-sky-700"
            >
              {question.owner.username}
            </Link>
            <p className="font-semibold text-xs">{question.owner.reputation}</p>
            <p className="mx-1 text-xs text-gray-500 whitespace-nowrap">
              {moment(question.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
