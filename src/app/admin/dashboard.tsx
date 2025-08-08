"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { AdminHeader } from "../../components/admin-header";
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { auth, db } from "../../firebase/firebase";
import { doc, collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<{
    name: string;
    organization: string;
    email: string;
  } | null>(null);

  const [bookings, setBookings] = useState<any[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalBookings: 0,
    activeQueues: 0,
    completedToday: 0,
    avgWaitTime: "0 mins",
  });

  // Fetch admin data in real-time
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const adminRef = doc(db, "admins", currentUser.uid);
    const unsubscribe = onSnapshot(adminRef, (docSnap) => {
      if (docSnap.exists()) {
        setAdminData(docSnap.data() as {
          name: string;
          organization: string;
          email: string;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch bookings in real-time
  useEffect(() => {
    const bookingsRef = collection(db, "bookings");
    const unsubscribeBookings = onSnapshot(bookingsRef, (snapshot) => {
      const bookingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
      calculateStats(bookingsData);
    });

    return () => unsubscribeBookings();
  }, []);

  // Calculate stats
  const calculateStats = (bookingsData: any[]) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const totalBookings = bookingsData.length;
    const activeQueues = bookingsData.filter((b) => b.status === "active").length;
    const completedToday = bookingsData.filter(
      (b) => b.status === "completed" && b.date === today
    ).length;

    const totalWaitTime = bookingsData.reduce((acc, b) => acc + (b.waitTime || 0), 0);
    const avgWaitTime = totalBookings > 0
      ? Math.round(totalWaitTime / totalBookings)
      : 0;

    setTodayStats({
      totalBookings,
      activeQueues,
      completedToday,
      avgWaitTime: `${avgWaitTime} mins`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
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
      <AdminHeader />

      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-indigo-400/15 to-pink-400/20" />
      </div>

      <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
  <main className="w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              {adminData && (
                <div className="flex items-center space-x-2 mt-2">
                  <p className="text-lg">
                    {getGreeting()},{" "}
                    <span className="font-semibold text-primary">{adminData.name}</span>
                  </p>
                  <Badge variant="outline">{adminData.organization}</Badge>
                </div>
              )}
            </div>
            <div className="text-right">
              {adminData && (
                <p className="text-sm text-muted-foreground">
                  Logged in as: <span className="font-medium">{adminData.email}</span>
                </p>
              )}
            </div>
          </div>
          <p className="text-muted-foreground mt-2">
            Overview of today's bookings and queue management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{todayStats.totalBookings}</p>
                  <p className="text-xs text-green-600">+12% from yesterday</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Queues</p>
                  <p className="text-2xl font-bold">{todayStats.activeQueues}</p>
                  <p className="text-xs text-blue-600">Across all locations</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">{todayStats.completedToday}</p>
                  <p className="text-xs text-green-600">57% completion rate</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{todayStats.avgWaitTime}</p>
                  <p className="text-xs text-orange-600">-3 mins from avg</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest customer bookings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{booking.customer}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">{booking.service}</p>
                      <p className="text-xs text-muted-foreground">{booking.location}</p>
                      <p className="text-xs text-muted-foreground">{booking.time}</p>
                    </div>
                    {booking.queuePosition && (
                      <div className="text-right">
                        <p className="text-sm font-medium">#{booking.queuePosition}</p>
                        <p className="text-xs text-muted-foreground">in queue</p>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50/80 border border-yellow-200 rounded-lg backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Queue Volume</p>
                  <p className="text-xs text-yellow-700">Temple visits are experiencing longer wait times</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50/80 border border-blue-200 rounded-lg backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">System Update</p>
                  <p className="text-xs text-blue-700">Queue management system updated successfully</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      </div>
    </div>
  );
}
