"use client"

import { Link } from 'react-router-dom'; // Corrected import
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { DashboardHeader } from "../../components/dashboard-header"
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { useToast } from "../../hooks/use-toast"

const bookings = {
  upcoming: [
    {
      id: 1,
      service: "Temple Visit",
      location: "Shri Ram Temple",
      date: "Today",
      time: "2:30 PM",
      status: "confirmed",
      queuePosition: 3,
      estimatedWait: "15 mins",
      bookingId: "TMP001",
    },
    {
      id: 2,
      service: "Hospital Appointment",
      location: "City General Hospital",
      date: "Tomorrow",
      time: "10:00 AM",
      status: "confirmed",
      queuePosition: 1,
      estimatedWait: "5 mins",
      bookingId: "HSP002",
    },
    {
      id: 3,
      service: "Salon Service",
      location: "Style Studio",
      date: "Dec 28, 2024",
      time: "3:00 PM",
      status: "pending",
      queuePosition: null,
      estimatedWait: null,
      bookingId: "SAL003",
    },
  ],
  past: [
    {
      id: 4,
      service: "Government Office",
      location: "Municipal Office",
      date: "Dec 20, 2024",
      time: "11:00 AM",
      status: "completed",
      bookingId: "GOV004",
    },
    {
      id: 5,
      service: "Temple Visit",
      location: "Hanuman Temple",
      date: "Dec 18, 2024",
      time: "6:00 PM",
      status: "completed",
      bookingId: "TMP005",
    },
  ],
  cancelled: [
    {
      id: 6,
      service: "Salon Service",
      location: "Beauty Hub",
      date: "Dec 15, 2024",
      time: "2:00 PM",
      status: "cancelled",
      bookingId: "SAL006",
    },
  ],
}

export default function MyBookingsPage() {
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-blue-600" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: `Booking ${bookingId} has been cancelled successfully.`,
    })
  }

  const handleReschedule = (bookingId: string) => {
    toast({
      title: "Reschedule Request",
      description: `Redirecting to reschedule booking ${bookingId}...`,
    })
  }

  const BookingCard = ({ booking, showActions = true }: { booking: any; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              {getStatusIcon(booking.status)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold">{booking.service}</h3>
                {getStatusBadge(booking.status)}
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {booking.date} at {booking.time}
                  </span>
                </div>
                {booking.queuePosition && (
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>
                      Position #{booking.queuePosition} • ~{booking.estimatedWait}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">Booking ID: {booking.bookingId}</span>
              </div>
            </div>
          </div>

          {showActions && booking.status !== "completed" && booking.status !== "cancelled" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleReschedule(booking.bookingId)}>Reschedule</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCancelBooking(booking.bookingId)} className="text-red-600">
                  Cancel Booking
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard"> {/* Changed href to to */}
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage all your appointments and visits</p>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming ({bookings.upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({bookings.past.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({bookings.cancelled.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookings.upcoming.length > 0 ? (
                bookings.upcoming.map((booking) => <BookingCard key={booking.id} booking={booking} />)
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Upcoming Bookings</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any upcoming appointments or visits scheduled.
                    </p>
                    <Link to="/book-slot"> {/* Changed href to to */}
                      <Button>Book Your First Slot</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {bookings.past.length > 0 ? (
                bookings.past.map((booking) => <BookingCard key={booking.id} booking={booking} showActions={false} />)
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Past Bookings</h3>
                    <p className="text-muted-foreground">Your completed bookings will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {bookings.cancelled.length > 0 ? (
                bookings.cancelled.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Cancelled Bookings</h3>
                    <p className="text-muted-foreground">Your cancelled bookings will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
