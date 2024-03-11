import { Request, Response } from "express";
import { Types } from "mongoose";
import HttpException from "../exceptions/http.exception";
import AnswerModel from "../models/Answer.model";
import QuestionModel from "../models/Question.model";
import UserModel from "../models/User.model";
import VotesModel, { VoteType_enum } from "../models/Votes.model";

export const getVotes = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const votes = await VotesModel.find({ voteTo: id });

    const score = votes.reduce((pv, cv) => pv + cv.vote, 0);
    const total = votes.length;
    response.json({ total, score, votes });
  } catch (error) {
    return HttpException("Internal server error", 500, response);
  }
};

export const voting = async (request: Request, response: Response) => {
  try {
    const { id, vote } = request.params;
    let objectId = new Types.ObjectId(id);
    await query(objectId, request, response, parseInt(vote, 10));
  } catch (error) {
    return HttpException("Internal server error", 500, response);
  }
};

async function query(
  postId: Types.ObjectId,
  request: Request,
  response: Response,
  vote: number
) {
  const { position } = request.body;

  const userReputation = await UserModel.findOne({ _id: request.user._id });
  const postA = await AnswerModel.findOne({ _id: postId });
  const postQ = await QuestionModel.findOne({ _id: postId });

  let post = postA || postQ;

  if (!userReputation || !post)
    return HttpException("Something is wrong!", 400, response);

  const ownerPost = await UserModel.findOne({ _id: post.owner });

  if (!ownerPost) return HttpException("Something is wrong!", 400, response);
  const alreadyVoted = await VotesModel.findOne({
    voter: request.user._id,
    voteTo: post._id,
  });

  if (ownerPost._id.equals(request.user._id)) {
    return HttpException("You cannot vote your own post", 401, response);
  }

  if (vote === VoteType_enum.downvote && userReputation.reputation < 125) {
    return HttpException("You need at least 125 reputation", 401, response);
  } else if (vote === VoteType_enum.upvote && userReputation.reputation < 25) {
    return HttpException("You need at least 25 reputation", 401, response);
  }

  //check if it are voted and therefore rest or sum reputation

  // is there vote? then delete it;
  //if not, continue
  //if vote is type 0 delete it and return
  await VotesModel.deleteOne({
    voteTo: postId,
    voter: request.user._id,
  });
  if (vote === VoteType_enum.unvote) {
    //request.body.position is the inverse
    const posCorrected = position * -1;

    if (posCorrected === VoteType_enum.downvote) {
      ownerPost.reputation = ownerPost.reputation += 2;
    } else if (posCorrected === VoteType_enum.upvote) {
      ownerPost.reputation = ownerPost.reputation -= 10;
    }
    await ownerPost.save();

    return HttpException("ok", 200, response);
  }
  const newVote = new VotesModel();

  newVote.voter = request.user._id;
  newVote.voteTo = postId;
  newVote.vote = vote;

  if (alreadyVoted && !position) {
    if (alreadyVoted.vote === VoteType_enum.downvote) {
      ownerPost.reputation = ownerPost.reputation += 2;
    } else if (alreadyVoted.vote === VoteType_enum.upvote) {
      ownerPost.reputation = ownerPost.reputation -= 10;
    }
  }

  if (vote === VoteType_enum.downvote) {
    //request.body.position is the inverse
    ownerPost.reputation = ownerPost.reputation -= 2;
  } else if (vote === VoteType_enum.upvote) {
    ownerPost.reputation = ownerPost.reputation += 10;
  }

  const [voted, _] = await Promise.all([
    await newVote.save(),
    await ownerPost.save(),
  ]);
  return response.json(voted);
}
