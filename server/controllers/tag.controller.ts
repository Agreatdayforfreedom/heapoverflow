import { Request, Response } from "express";
import HttpException from "../exceptions/http.exception";
import TagModel from "../models/Tag.model";

export const getTags = async (
  request: Request<{}, {}, {}, { skip: string; limit: string }>,
  response: Response
) => {
  try {
    const { skip, limit } = request.query;

    let tags: any = TagModel.find();
    const tagsCount = await tags.clone().countDocuments();

    if (skip) {
      tags = tags.skip(parseInt(skip, 10));
    }

    tags = await tags.limit(limit).populate("totalQuestions");

    return response.json({ tagsCount, tags });
  } catch (error) {
    return HttpException("Internal Server Error", 500, response);
  }
};

export const getTag = async (request: Request, response: Response) => {
  try {
    const { tag } = request.params;

    const tagFound = await TagModel.findOne({ name: tag });
    if (!tagFound) return HttpException("There was a problem", 400, response);
    return response.json(tagFound);
  } catch (error) {
    return HttpException("Internal Server Error", 500, response);
  }
};

export const editTag = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;

    if (!request.body.infoTag) {
      return HttpException("The information is required", 400, response);
    }

    const tagFound = await TagModel.findOne({ _id: id });
    if (!tagFound) return HttpException("There was a problem", 400, response);

    tagFound.infoTag = request.body.infoTag;

    await tagFound.save();
    return response.send(204);
  } catch (error) {
    return HttpException("Internal Server Error", 500, response);
  }
};
