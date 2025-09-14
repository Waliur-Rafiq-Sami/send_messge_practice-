// "use client";
const messages = [
  {
    title: "Message from FriendA",
    content: "Hey, are we still on for tonight?",
    received: "3 minutes ago",
  },
  {
    title: "Message from ClientB",
    content: "Following up on the project proposal.",
    received: "1 hour ago",
  },
  {
    title: "Message from FamilyC",
    content: "Happy birthday! 🎉 Hope you have a great day!",
    received: "5 hours ago",
  },
  {
    title: "Message from CoworkerD",
    content: "Can you share the meeting notes from yesterday?",
    received: "10 hours ago",
  },
  {
    title: "Message from ServiceE",
    content: "Your order has been shipped.",
    received: "12 hours ago",
  },
  {
    title: "Message from AcquaintanceF",
    content: "It was great running into you earlier.",
    received: "1 day ago",
  },
  {
    title: "Message from ClassmateG",
    content: "Did you finish the homework for Professor Smith's class?",
    received: "2 days ago",
  },
  {
    title: "Message from UnknownH",
    content: "Hi, I'm interested in the item you posted for sale.",
    received: "3 days ago",
  },
  {
    title: "Message from MentorI",
    content: "Just wanted to check in and see how you're doing with the new role.",
    received: "4 days ago",
  },
  {
    title: "Message from NeighborJ",
    content: "Can I borrow your lawnmower this weekend?",
    received: "5 days ago",
  },
  {
    title: "Message from VendorK",
    content: "We have a special offer for you.",
    received: "1 week ago",
  },
  {
    title: "Message from DoctorL",
    content: "Reminder: Your annual check-up is scheduled for next Tuesday.",
    received: "1 week ago",
  },
  {
    title: "Message from TeacherM",
    content: "Your student has been doing great in class.",
    received: "2 weeks ago",
  },
  {
    title: "Message from BankN",
    content: "Fraud alert: A suspicious transaction was detected on your account.",
    received: "2 weeks ago",
  },
  {
    title: "Message from GymO",
    content: "Don't forget to come to our new cardio class!",
    received: "3 weeks ago",
  },
  {
    title: "Message from RelativeP",
    content: "Thinking of you. We should catch up soon.",
    received: "1 month ago",
  },
  {
    title: "Message from HobbyistQ",
    content: "Check out this new tutorial I found on building model rockets.",
    received: "1 month ago",
  },
  {
    title: "Message from ColleagueR",
    content: "Hope you're having a good vacation.",
    received: "2 months ago",
  },
  {
    title: "Message from OrganizerS",
    content: "The event schedule has been updated.",
    received: "3 months ago",
  },
  {
    title: "Message from OldFriendT",
    content: "Long time no see! Found an old photo of us and it made me smile.",
    received: "6 months ago",
  },
];

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <main className="flex flex-col items-center justify-center px-4 md:px-24 p-12 max-w-5xl w-full">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Welcome to My TODO Website
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3 text-lg">
            Here are some of your recent messages ✨
          </p>
        </section>

        <Carousel className="w-full max-w-3xl">
          <CarouselContent>
            {messages.map((message, idx) => (
              <CarouselItem key={idx} className="p-8 mb-10">
                <Card className="shadow-lg rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-2xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                      {message.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-200 mb-2">{message.content}</p>
                    <p className="text-sm text-gray-400 dark:text-gray-400 italic">
                      {message.received}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-[-2rem] hidden md:flex" />
          <CarouselNext className="right-[-2rem] hidden md:flex" />
        </Carousel>
      </main>
    </div>
  );
}
