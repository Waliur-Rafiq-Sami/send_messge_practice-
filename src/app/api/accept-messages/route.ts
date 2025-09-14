import { getServerSession } from "next-auth"; //Unlike useSession (which is client-side), this is used in server code, like API routes
import { authOptions } from "../auth/[...nextauth]/options"; //It contains all the settings for authentication in your app

import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true } // what is this, why i use it
      // What { new: true } means in Mongoose
      // findByIdAndUpdate is a Mongoose function to update a document by its _id.
      // By default, findByIdAndUpdate returns the old document (before the update).

      // Why we use it->
      // To get the latest updated document immediately
      // Useful if you want to send it back to the client or use it in further logic.
      // Avoid making another database query
      // Otherwise, you’d have to call findById again to get the updated document.
    );

    if (!updateUser) {
      return NextResponse.json(
        { success: false, message: "Failed to update user status" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        isAcceptingMessages: updateUser.isAcceptingMessage, // ✅ match frontend
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status: ", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status" },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json({ success: false, message: "Not Authenticated" }, { status: 401 });
  }

  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get user status: ", error);
    return NextResponse.json({ success: false, message: "Error getting status" }, { status: 500 });
  }
}
