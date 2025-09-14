import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },

      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    // 1. Filter: only documents with this userId
    // 2. Flatten the "messages" array into individual documents
    // 3. Sort messages by createdAt in descending order
    // 4. Group back by user _id and reconstruct the messages array

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 401 }
      );
    }
    // console.log("user ", user[0].messages);

    return Response.json(
      {
        success: true,
        messages: user[0].messages, //****messages
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error occur get messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Something wrong to get message",
      },
      { status: 500 }
    );
  }
}

// aggregate->
// aggregate() is a MongoDB method used to process data and return computed results.
// It allows you to run multiple stages of operations on a collection, like filtering, grouping, sorting, reshaping documents, etc.
// Think of it as a pipeline: documents enter the pipeline, go through each stage, and a transformed output comes out.
