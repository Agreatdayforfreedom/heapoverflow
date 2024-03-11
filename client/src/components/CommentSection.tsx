import { nanoid } from "@reduxjs/toolkit";
import { FormEvent, useEffect, useState, useTransition } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  deleteCommentThunk,
  editCommentThunk,
} from "../features/comment/commentsApi";
import { formatDate } from "../utils/formatDate";
import Button from "./Button";
import {
  Answer,
  Comment,
  Question as IQuestion,
} from "../interfaces/interfaces";
import { configAxios } from "../utils/configAxios";
import { useForm } from "../hooks/useForm";
import axios from "axios";
import { CommentStatus_enum } from "../features/comment/commentSlice";
import Blank from "./Blank";

enum Limit_enum {
  initial = 3,
  all = 999,
}

interface PropsComment {
  comment: Comment;
  setForm: (state: FormType) => void;
  setToggleComment: (state: boolean) => void;
}

interface PropsCS {
  from: IQuestion | Answer;
  type: "question" | "answer";
}

interface FormType {
  id?: string;
  content: string;
}

const CommentSection = ({ from, type }: PropsCS) => {
  const [sizeComment, setSizeComment] = useState<number>(0);
  const [showMore, setShowMore] = useState<number>(0);
  const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(Limit_enum.initial);
  const [toggleComment, setToggleComment] = useState<boolean>(false);
  const [commentFilled, setCommentFilled] = useState<Comment>({} as Comment);
  const [comments, setComments] = useState<Comment[]>([] as Comment[]);
  const { form, handleChange, setForm } = useForm<FormType>();
  const { user } = useAppSelector((state) => state.auth);
  const { token } = useAppSelector((state) => state.comments);
  const dispatch = useAppDispatch();
  const { comment, commentStatus } = useAppSelector((state) => state.comments);

  let [isPending, startTransition] = useTransition();

  const config = configAxios(token);

  useEffect(() => {
    setShowMoreLoading(true);
    const fetch = async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_BACKEND_URL}/comment/${from._id}?limit=${limit}`
      );
      setComments(data.query);
      setShowMore(data.commentsLength);
      setShowMoreLoading(false);
    };
    fetch();
  }, [limit]);

  useEffect(() => {
    if (comment) {
      setCommentFilled(comment);
    }
  }, [comment]);

  useEffect(() => {
    if (commentStatus === CommentStatus_enum.edited) {
      setComments((prev: any) => {
        if (commentFilled) {
          const newState = prev.map((x: any) =>
            x._id === commentFilled._id ? commentFilled : x
          );
          return newState;
        }
      });
    } else if (commentStatus === CommentStatus_enum.deleted) {
      setComments((prev: any) => {
        if (commentFilled) {
          const newState = prev.filter((x: any) => x._id !== commentFilled._id);
          return newState;
        }
      });
    }
  }, [commentFilled]);

  useEffect(() => {
    if ("content" in form) {
      setSizeComment(form.content.length);
    }
  }, [form]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.id) {
      const payload = {
        content: form.content,
      };
      dispatch(
        editCommentThunk({
          payload,
          id: form.id,
          config,
        })
      );
    } else {
      const payload = {
        content: form.content,
      };

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/new/${from._id}`,
        { content: payload.content },
        config
      );
      startTransition(() => {
        setComments((prev) => [data, ...prev]);
      });
    }
    setForm({ content: "" } as FormType);
    setToggleComment(false);
  };

  const handleShowMore = () => {
    setLimit(Limit_enum.all);
    setShowMore(0);
  };
  return (
    <>
      <div className="mt-5">
        {comments &&
          comments.map((comment: Comment) => (
            <CommentCard
              key={nanoid()}
              comment={comment}
              setForm={setForm}
              setToggleComment={setToggleComment}
            />
          ))}

        {toggleComment === false &&
          (!user ? (
            <Link to="/login" className="text-sm text-blue-500 p-3">
              Add a comment
            </Link>
          ) : (
            <button
              className="text-sm text-blue-500 p-3"
              onClick={() => setToggleComment((prev) => !prev)}
            >
              Add a comment
            </button>
          ))}

        {showMore > 3 &&
          limit === Limit_enum.initial &&
          (showMoreLoading ? (
            <span className="text-sm font-semibold text-orange-500">
              Loading...
            </span>
          ) : (
            <button
              className="text-sm text-blue-500 p-3"
              onClick={handleShowMore}
            >
              show - <b>{showMore - limit} </b>- more
            </button>
          ))}
      </div>
      {toggleComment && (
        <div className="mt-3">
          <form className="flex" onSubmit={handleSubmit}>
            <div className="w-full">
              <textarea
                name="content"
                id="content"
                placeholder="add a useful comment"
                value={form && form.content}
                onChange={handleChange}
                maxLength={255}
                className=" w-full bg-transparent p-2 border border-slate-300 placeholder:text-sm"
                autoFocus
              ></textarea>
              <span className="text-sm">{sizeComment} / 255</span>
            </div>
            <div className="mx-2">
              <Button
                name={form.id ? "Save edits" : "Add comment"}
                disabled={isPending}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

const CommentCard = ({ comment, setForm, setToggleComment }: PropsComment) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const config = configAxios(token);
  const editMode = () => {
    setForm({ id: comment._id, content: comment.content });
    setToggleComment(true);
  };

  const handleDelete = () => {
    dispatch(deleteCommentThunk({ id: comment._id, config }));
  };

  if (!comment || !user) return <Blank />;
  return (
    <div className="flex border-b border-gray-300 py-1 px-2 text-sm first-of-type:border-y hover-div:block">
      <p className="break-all">
        {comment.content}
        <span className="px-1">-</span>
        <span className="text-blue-500">{comment.owner?.username}</span>
        <span className="px-1 text-xs text-gray-500">
          {formatDate(comment.createdAt)}
        </span>
      </p>
      {comment.owner?._id === user._id && (
        <div className="hidden">
          <span>-</span>
          <button
            className="px-1 text-orange-600 hover:text-orange-700"
            onClick={editMode}
          >
            Edit
          </button>
          <button
            className="px-1 text-red-800 hover:text-red-900"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
