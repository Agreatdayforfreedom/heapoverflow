import { VoteType_enum } from "../components/Voting";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  reputation: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  votes?: number;
  answers?: number;
  answerAccepted?: number;
  tags: Array<Tag>;
  comments: Array<Comment>;
  owner: User; //user
  createdAt: Date;
  updatedAt: Date;
  score: number;
  votesCount: number;
  vote: Vote;
}

export interface Answer {
  _id: string;
  content: string;
  question: Question;
  comments: Array<Comment>;
  votes?: number;
  owner: User;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
  score: number;
  votesCount: number;
  vote: Vote;
}

export interface Comment {
  _id: string;
  content: string;
  owner: User;
  post: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Config {
  headers: {
    "Content-Type": string;
    Authorization: string;
  };
}

export interface Tag {
  _id: string;
  name: string;
  infoTag: string;
  totalQuestions?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  _id: string;
  voter: string;
  votedTo: string;
  vote: Exclude<VoteType_enum, VoteType_enum.unvote>;
}
