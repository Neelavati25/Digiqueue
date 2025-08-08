"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { DashboardHeader } from "../../components/dashboard-header";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Bell,
  TrendingUp,
} from "lucide-react";
import { auth, db } from "../../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import { differenceInMinutes, parse, isAfter } from "date-fns";

export default function DashboardPage() {
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data() as { name: string; email: string });
      } else {
        setUserData(null);
      }
    });

    const bookingsQuery = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("date", "asc"),
      orderBy("time", "asc")
    );

    const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
      const now = new Date();
      const bookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const upcoming = bookings
        .map((booking) => {
          let bookingDateTime: Date;

          try {
            let baseDate = booking.date?.toDate ? booking.date.toDate() : new Date(booking.date);
            let parsedTime = booking.time
              ? parse(booking.time, "hh:mm a", new Date())
              : new Date();

            baseDate.setHours(parsedTime.getHours(), parsedTime.getMinutes(), 0, 0);
            bookingDateTime = baseDate;
          } catch (err) {
            console.warn("Error parsing booking:", booking, err);
            return null;
          }

          return {
            ...booking,
            bookingDateTime,
          };
        })
        .filter((booking) => booking && isAfter(booking.bookingDateTime, now))
        .sort((a, b) => a.bookingDateTime - b.bookingDateTime);

      setUpcomingBookings(upcoming);
      setTotalBookings(bookings.length);
    });

    const activityQuery = query(
      collection(db, "recentActivity"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeActivity = onSnapshot(activityQuery, (snapshot) => {
      const activity = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecentActivity(activity);
    });

    return () => {
      unsubscribeUser();
      unsubscribeBookings();
      unsubscribeActivity();
    };
  }, [user]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      upcomingBookings.forEach((booking) => {
        const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
        const minutesUntilBooking = differenceInMinutes(bookingDateTime, now);
        if (minutesUntilBooking === 15) {
          showNotification(`Reminder: Your ${booking.service} is in 15 minutes!`);
        }
      });
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [upcomingBookings]);

  const showNotification = (message: string) => {
    if (Notification.permission === "granted") {
      new Notification(message);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(message);
        }
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DashboardHeader />

      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/15 via-blue-400/10 to-purple-400/15" />
        <div className="absolute inset-0">
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-gradient-to-br from-primary/40 to-purple-400/40 rounded-full animate-float shadow-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Centered Main Content */}
      <main className="flex justify-center px-4 md:px-0 py-10 min-h-screen items-start relative z-10">
        <div className="w-full max-w-7xl space-y-8">
          {/* Welcome Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {userData ? `${getGreeting()}, ${userData.name}! 👋` : "Welcome back! 👋"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Here's what's happening with your bookings today.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: "Active Bookings",
                value: upcomingBookings.length,
                icon: <Calendar className="h-8 w-8 text-primary" />,
              },
              {
                label: "Time Saved",
                value: "3.5h",
                icon: <Clock className="h-8 w-8 text-green-600" />,
              },
              {
                label: "Total Bookings",
                value: totalBookings,
                icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
              },
              {
                label: "Notifications",
                value: 3,
                icon: <Bell className="h-8 w-8 text-orange-600" />,
              },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  {stat.icon}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Bookings */}
            <div className="lg:col-span-2">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Bookings</CardTitle>
                    <CardDescription>Your scheduled appointments and visits</CardDescription>
                  </div>
                  <Link to="/book-slot">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Book Slot
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBookings.length > 0 ? (
                    upcomingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{booking.service}</h4>
                            <p className="text-sm text-muted-foreground">{booking.location}</p>
                            <p className="text-sm text-muted-foreground">
                              {booking.date} at {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="mb-2">
                            Position #{booking.queuePosition}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            ~{booking.estimatedWait}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No upcoming bookings</p>
                      <Link to="/book-slot">
                        <Button className="mt-4">Book Your First Slot</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions + Recent Activity */}
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/book-slot">
                    <Button className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Book New Slot
                    </Button>
                  </Link>
                  <Link to="/my-bookings">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Bookings
                    </Button>
                  </Link>
                  <Link to="/notifications">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="h-5 w-5 rounded-full bg-gray-200" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.service}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
