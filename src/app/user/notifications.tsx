"use client"

import { useState } from "react"
import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { DashboardHeader } from "../../components/dashboard-header"
import { ArrowLeft, Bell, CheckCircle, Clock, AlertTriangle, Info, Trash2 } from "lucide-react"
import { useToast } from "../../hooks/use-toast"

const notifications = {
  unread: [
    {
      id: 1,
      type: "queue_update",
      title: "Queue Position Updated",
      message: "You're now #2 in queue for Temple Visit at Shri Ram Temple",
      time: "2 minutes ago",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      id: 2,
      type: "reminder",
      title: "Appointment Reminder",
      message: "Your hospital appointment is in 30 minutes. Please arrive 10 minutes early.",
      time: "28 minutes ago",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your salon appointment for tomorrow at 3:00 PM has been confirmed.",
      time: "1 hour ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ],
  read: [
    {
      id: 4,
      type: "queue_complete",
      title: "Service Completed",
      message: "Thank you for visiting! Please rate your experience.",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      id: 5,
      type: "system",
      title: "System Update",
      message: "DigiQueue has been updated with new features and improvements.",
      time: "1 day ago",
      icon: Info,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ],
}

const NotificationCard = ({ notification, isRead = false }: { notification: any; isRead?: boolean }) => (
  <Card
    className={`hover:shadow-md transition-shadow ${!isRead ? "border-l-4 border-l-primary" : ""} bg-white/90 backdrop-blur-sm`}
  >
    <CardContent className="p-4">
      <div className="flex items-start space-x-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${notification.bgColor}`}>
          <notification.icon className={`h-5 w-5 ${notification.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-sm">{notification.title}</h4>
            <div className="flex items-center space-x-2">
              {!isRead && (
                <Badge variant="secondary" className="text-xs">
                  New
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
          <div className="flex items-center space-x-2">
            {!isRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
                className="h-8 px-2 text-xs"
                aria-label="Mark as Read"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark as Read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(notification.id)}
              className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
              aria-label="Delete Notification"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("unread")
  const { toast } = useToast()

  const handleMarkAsRead = (id: number) => {
    toast({
      title: "Marked as Read",
      description: "Notification has been marked as read.",
    })
  }

  const handleDelete = (id: number) => {
    toast({
      title: "Notification Deleted",
      description: "The notification has been removed.",
    })
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <DashboardHeader />

      {/* PROMINENT Notifications Background */}
      <div className="absolute inset-0">
        {/* Large Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/15 via-yellow-400/10 to-red-400/15" />

        {/* Large Bell Icons */}
        <div className="absolute top-20 right-20 opacity-60 animate-bounce-slow">
          <svg width="120" height="120" viewBox="0 0 24 24" className="text-orange-500/60">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="m13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </div>

        {/* Notification Bubbles */}
        <div className="absolute top-1/4 left-16 opacity-50">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${i * 30}px`,
                top: `${i * 25}px`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400/60 to-orange-600/60 rounded-full flex items-center justify-center shadow-xl">
                <span className="text-white font-bold text-xs">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Alert Icons Floating */}
        <div className="absolute bottom-32 right-32 opacity-50 animate-float">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400/60 to-red-600/60 rounded-full flex items-center justify-center animate-pulse shadow-xl">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div
              className="w-16 h-16 bg-gradient-to-br from-green-400/60 to-green-600/60 rounded-full flex items-center justify-center animate-pulse shadow-xl"
              style={{ animationDelay: "0.5s" }}
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div
              className="w-16 h-16 bg-gradient-to-br from-blue-400/60 to-blue-600/60 rounded-full flex items-center justify-center animate-pulse shadow-xl"
              style={{ animationDelay: "1s" }}
            >
              <Info className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Notification Count */}
        <div className="absolute bottom-1/4 left-1/4 opacity-40 animate-float">
          <div className="text-8xl font-bold text-orange-500/60">{notifications.unread.length}</div>
          <div className="text-lg text-orange-500/50 text-center">New</div>
        </div>

        {/* Message Lines */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-gradient-to-r from-orange-300/60 via-orange-400/80 to-transparent rounded-full animate-slide-right shadow-lg"
              style={{
                top: `${20 + i * 8}%`,
                width: "300px",
                animationDelay: `${i * 0.5}s`,
                animationDuration: "7s",
              }}
            />
          ))}
        </div>

        {/* Floating Notification Cards */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-6 h-6 bg-gradient-to-br from-yellow-400/40 to-orange-400/40 rounded animate-float shadow-lg"
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

      <main className="container py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon" aria-label="Back to Dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Notifications</h1>
              <p className="text-muted-foreground">Stay updated with your bookings and queue status</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="unread" className="relative">
                Unread ({notifications.unread.length})
                {notifications.unread.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {notifications.unread.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read ({notifications.read.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="unread" className="space-y-4">
              {notifications.unread.length > 0 ? (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      You have {notifications.unread.length} unread notifications
                    </p>
                    <Button variant="outline" size="sm" aria-label="Mark All as Read">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark All as Read
                    </Button>
                  </div>
                  {notifications.unread.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </>
              ) : (
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Unread Notifications</h3>
                    <p className="text-muted-foreground">You're all caught up! New notifications will appear here.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="read" className="space-y-4">
              {notifications.read.length > 0 ? (
                notifications.read.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} isRead />
                ))
              ) : (
                <Card className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Read Notifications</h3>
                    <p className="text-muted-foreground">Read notifications will appear here.</p>
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
function handleMarkAsRead(id: any): void {
    throw new Error("Function not implemented.");
}

function handleDelete(id: any): void {
    throw new Error("Function not implemented.");
}

