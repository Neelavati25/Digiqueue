"use client"

import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { AdminHeader } from "../../components/admin-header"
import { ArrowLeft, Users, Play, Pause, SkipForward, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { collection, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Adjust this path to your firebase config

export default function LiveQueuePage() {
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [currentTime, setCurrentTime] = useState(new Date())
  const { toast } = useToast()
  const [queueData, setQueueData] = useState([]);

  useEffect(() => {
    const bookingsRef = collection(db, "bookings");

    const unsubscribe = onSnapshot(bookingsRef, async (snapshot) => {
      const allBookings = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userRef = doc(db, "users", data.userId || "");
          let name = "Guest";

          try {
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              name = userData.name || "Unknown";
            }
          } catch (error) {
            console.error("Failed to fetch user name:", error);
          }

          return {
            id: docSnap.id,
            ...data,
            name,
          };
        })
      );

      const now = new Date();

      const grouped = allBookings.reduce((acc, booking) => {
        const { service, status, date, time } = booking;

        if (status === "completed") return acc;

        if (!acc[service]) acc[service] = [];

        const bookingTime = new Date(`${date}T${time}`);
        const waitMins = Math.round((bookingTime.getTime() - now.getTime()) / 60000);

        acc[service].push({
          ...booking,
          waitLabel: waitMins <= 0 ? "Now" : `${waitMins} mins`,
          queueTime: bookingTime,
        });

        return acc;
      }, {} as Record<string, any[]>);

      const queues = Object.entries(grouped).map(([service, bookings]) => {
        const sorted = bookings
          .sort((a, b) => a.queueTime - b.queueTime)
          .map((b, i) => ({
            ...b,
            position: i + 1,
          }));

        return {
          service,
          queue: sorted,
        };
      });

      setQueueData(queues);
    });

    return () => unsubscribe();
  }, []);

  const markAsCompleted = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, "bookings", bookingId), {
        status: "completed",
      });
      console.log("Marked as completed.");
    } catch (error) {
      console.error("Failed to mark completed:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
      case "closed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredQueues =
    selectedLocation === "all" ? queueData : queueData.filter((queue) => queue.service === selectedLocation)

  const handleNextCustomer = (queueId: string) => {
    // Implement the logic to call the next customer
  };

  const handlePauseQueue = (queueId: string) => {
    // Implement the logic to pause the queue
  };

  const handleResumeQueue = (queueId: string) => {
    // Implement the logic to resume the queue
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AdminHeader />

      {/* PROMINENT Live Queue Background */}
      <div className="absolute inset-0">
        {/* Large Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-emerald-400/15 to-teal-400/20" />

        {/* Floating Queue Icons */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-8 h-8 bg-gradient-to-br from-green-400/40 to-emerald-400/40 rounded-full animate-float shadow-lg flex items-center justify-center"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Users className="w-4 h-4 text-white" />
            </div>
          ))}
        </div>
      </div>

      <main className="container py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="icon" aria-label="Back to Dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Live Queue Management</h1>
                <p className="text-muted-foreground">Monitor and control real-time queues across all locations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current Time</div>
                <div className="text-lg font-semibold">{currentTime.toLocaleTimeString()}</div>
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {queueData.map((queue) => (
                    <SelectItem key={queue.service} value={queue.service}>
                      {queue.service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Queue Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQueues.map((queue) => (
              <Card key={queue.service} className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{queue.service}</CardTitle>
                    {getStatusBadge(queue.status)}
                  </div>
                  <CardDescription>
                    Currently serving #{queue.queue[0]?.position || 0} • {queue.queue.length} in queue
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Queue Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{queue.queue.length}</div>
                      <div className="text-xs text-muted-foreground">Total in Queue</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{queue.queue[0]?.waitLabel || "N/A"}</div>
                      <div className="text-xs text-muted-foreground">Est. Wait Time</div>
                    </div>
                  </div>

                  {/* Current Queue */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Next in Queue</h4>
                    {queue.queue.slice(0, 3).map((customer) => (
                      <div
                        key={customer.position}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {customer.position}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{customer.position}. {customer.name || "Guest"}</div>
                            <div className="text-xs text-muted-foreground">ID: {customer.id}</div>
                            <div className="text-xs text-muted-foreground italic">Slot Time: {customer.time}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-muted-foreground">{customer.waitLabel}</div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsCompleted(customer.id)}
                            className="text-green-600 hover:bg-green-100"
                          >
                            ✅
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Queue Controls */}
                  <div className="flex space-x-2 pt-2">
                    {queue.status === "active" ? (
                      <>
                        <Button onClick={() => handleNextCustomer(queue.service)} className="flex-1" size="sm" aria-label="Call Next Customer">
                          <SkipForward className="h-3 w-3 mr-1" />
                          Next
                        </Button>
                        <Button onClick={() => handlePauseQueue(queue.service)} variant="outline" size="sm" aria-label="Pause Queue">
                          <Pause className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleResumeQueue(queue.service)} className="flex-1" size="sm" aria-label="Resume Queue">
                        <Play className="h-3 w-3 mr-1" />
                        Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Queue Alerts */}
          <Card className="mt-8 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Queue Alerts</CardTitle>
              <CardDescription>Important notifications and system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-yellow-50/80 border border-yellow-200 rounded-lg backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">High Wait Time Alert</p>
                  <p className="text-xs text-yellow-700">
                    City General Hospital queue exceeding 30 minutes average wait time
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50/80 border border-green-200 rounded-lg backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Queue Running Smoothly</p>
                  <p className="text-xs text-green-700">
                    Shri Ram Temple maintaining optimal flow with 15-minute average wait
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
