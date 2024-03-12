import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { voteThunk } from "../features/vote/voteApi";
import { Vote } from "../interfaces/interfaces";
import { configAxios } from "../utils/configAxios";
import ArrowDown from "./ArrowDown";
import ArrowUp from "./ArrowUp";
import Blank from "./Blank";
import { Spinner } from "./Spinner";

//todo: limit answers
//todo: pagination tags does not work

export enum VoteType_enum {
  upvote = 1,
  downvote = -1,
  unvote = 0,
}

interface Props {
  postId: string;
  ownerId: string;
  votes: Votes;
}

interface Votes {
  total: number;
  score: number;
  vote?: Vote;
}

const Voting = ({ postId, ownerId, votes }: Props) => {
  const [voteType, setVoteType] = useState<number>(
    votes.vote?.vote as VoteType_enum
  );
  // const [votes, setVotes] = useState<Votes>({} as Votes);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [initialScore, setInitialScore] = useState<number>(votes.score);
  const [loadingVotes, setLoadingVotes] = useState(true);

  const { user, token, loading } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const config = configAxios(token);

  // useEffect(() => {
  //   console.log("fetching");
  //   const fetch = async () => {
  //     const { data } = await axios(
  //       `${import.meta.env.VITE_BACKEND_URL}/vote/${postId}`
  //     );
  //     if (data) {
  //       const votedType = data.votes.filter(
  //         (v: Vote) => v.voter === user?._id
  //       )[0];
  //       if (votedType) setVoteType(votedType.vote);
  //       setInitialScore(data.score);
  //       setVotes(data);
  //       setLoadingVotes(false);
  //     }
  //   };
  //   fetch();
  // }, []);
  const sendVote = (type: VoteType_enum, position?: VoteType_enum) => {
    if (!user) {
      return navigate("/login");
    }
    if (user._id === ownerId) {
      return alert("you cannot vote your own post");
    }
    if (type === VoteType_enum.downvote && user.reputation < 125) {
      return alert("you should at least 125 of reputation");
    }
    if (type === VoteType_enum.upvote && user.reputation < 25) {
      return alert("you should at least 25 of reputation");
    }
    setVoteType(type);
    setInitialScore((prev) => {
      if (voteType) prev += type;
      if (type === VoteType_enum.downvote) {
        return (prev += VoteType_enum.downvote);
      } else if (type === VoteType_enum.upvote) {
        return (prev += VoteType_enum.upvote);
      } else {
        if (position) return (prev += position);
      }
      return (prev += 0);
    });
    dispatch(voteThunk({ postId, config, type, position }));
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 2000);
  };

  if (loading) return <Spinner size="2rem" />;
  return (
    <div className="flex flex-col justify-start items-center text-[#aab0b4]">
      <ArrowUp
        setVoteType={setVoteType}
        voteType={voteType}
        disabled={disabled}
        sendVote={sendVote}
      />
      <span className="text-2xl block text-slate-600">{initialScore}</span>
      <ArrowDown
        setVoteType={setVoteType}
        voteType={voteType}
        disabled={disabled}
        sendVote={sendVote}
      />
    </div>
  );
};

export default Voting;
