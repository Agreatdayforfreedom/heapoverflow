import React from "react";
import { Link } from "react-router-dom";
import { Answer, Question, User } from "../interfaces/interfaces";
import { formatDate } from "../utils/formatDate";
import moment from "moment";

interface Props {
  user: User;
  from?: Question | Answer | "";
  date?: boolean;
  image?: string;
}

const CardUserInfo = ({ user, from = "", date = true, image }: Props) => {
  return (
    <div
      className={`w-48 ${
        from && "title" in from && "bg-blue-200 px-2 py-1 rounded"
      }`}
    >
      {date && from && (
        <p className="text-xs text-slate-600">
          {moment(from.createdAt).add(3, "days").calendar()}
        </p>
      )}
      <div className="flex ">
        <img
          src={user.avatar}
          className={`${image && image} w-8 h-8 rounded mt-1`}
          alt={`${user.username} avatar`}
        />
        <div className="px-2 flex flex-col">
          <Link
            to={`/users/${user._id}`}
            className="text-blue-500 align-top w-fit text-sm"
          >
            {user.username}
          </Link>
          <span className="text-sm font-bold text-slate-600">
            {user.reputation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardUserInfo;
