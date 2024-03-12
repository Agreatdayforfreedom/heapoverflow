import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Spinner } from "../components/Spinner";
import { getUserThunk } from "../features/user/userApi";
import { MdCake } from "react-icons/md";
import { User } from "../interfaces/interfaces";
import { FiMessageSquare } from "react-icons/fi";
import { formatDate } from "../utils/formatDate";
import { Question } from "../interfaces/interfaces";
import { getRelatedQuestionsThunk } from "../features/question/questionApi";
import { getRelatedAnswersThunk } from "../features/answer/answerApi";
import { nanoid } from "@reduxjs/toolkit";
import moment from "moment";

interface Post {
  _id: string;
  title?: string;
  content: string;
  owner: User;
  votes?: number;
  question?: Question;
  createdAt: Date;
}

const UserProfile = () => {
  const params = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit, setLimit] = useState(5);
  const dispatch = useAppDispatch();
  const { userInfo, loading } = useAppSelector((state) => state.user);
  const { questions, loading: loadingQuestion } = useAppSelector(
    (state) => state.question
  );
  const { answers, loading: loadingAnswer } = useAppSelector(
    (state) => state.answers
  );
  useEffect(() => {
    dispatch(getUserThunk({ id: params.id }));
  }, []);

  useEffect(() => {
    dispatch(getRelatedQuestionsThunk({ id: params.id, limit }));
    dispatch(getRelatedAnswersThunk({ id: params.id, limit }));
  }, [limit]);

  useEffect(() => {
    if (questions && answers) {
      const sorted = [...questions, ...answers].sort(
        (a, b) => b.votes! - a.votes!
      );
      setPosts([...sorted]);
    }
  }, [questions, answers]);

  if (loading || !userInfo || loadingAnswer || loadingQuestion)
    return <Spinner />;
  return (
    <section className="p-6">
      <div>
        <div className="flex items-center">
          <img
            src={userInfo.avatar}
            alt={userInfo.username}
            className="rounded"
          />
          <div className="px-3">
            <h1 className="text-2xl font-semibold text-slate-700">
              {userInfo.username}
            </h1>
            <div className="flex my-1">
              <MdCake className="text-slate-700" />
              <span className="text-sm px-1 text-slate-700">
                Member for{" "}
                {moment(userInfo.createdAt).add(3, "days").calendar()}
              </span>
            </div>
          </div>
        </div>
        <div className="inline-block px-3 py-1.5 mt-4 rounded-[1000px] bg-orange-400">
          <span className="text-sm">Profile</span>
        </div>
      </div>
      <div className="flex justify-end mt-5">
        <div className="w-full md:w-3/4">
          <div className="flex flex-col items-start px-2">
            <span className="text-lg">Top posts</span>
            <button
              className="text-blue-500 text-sm"
              onClick={() => setLimit(0)}
            >
              Show all posts
            </button>
          </div>
          <div className="border border-slate-400 rounded">
            {posts.map((post) => (
              <PostCard key={nanoid()} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  return (
    <div className="flex items-center p-2 border-b last:border-none border-slate-400">
      <IconPost type={"title" in post ? "Q" : "A"} />
      <div className="mx-2 px-4 py-1 rounded border">{post.votes}</div>
      <Link
        to={`/questions/${post.question ? post.question._id : post._id}`}
        className="text-blue-500 hover:text-blue-600"
      >
        {post.question ? post.question.title : post.title}
      </Link>
    </div>
  );
};

const IconPost = ({ type }: { type: string }) => {
  return (
    <div className="relative">
      <span className="absolute left-2 top-0.5 text-xs font-semibold text-slate-600">
        {type}
      </span>
      <FiMessageSquare size={24} className="text-slate-600" />
    </div>
  );
};

export default UserProfile;
