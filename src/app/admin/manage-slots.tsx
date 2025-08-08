"use client"

import { Link } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { AdminHeader } from "../../components/admin-header";
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Calendar } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { collection, onSnapshot, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // Adjust path if different
import { useEffect, useState } from "react";

const services = [
  { id: "temple", name: "Temple Services" },
  { id: "hospital", name: "Hospital Services" },
  { id: "salon", name: "Salon Services" },
  { id: "government", name: "Government Services" },
];

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

export default function ManageSlotsPage() {
  const [activeTab, setActiveTab] = useState("slots");
  const [selectedService, setSelectedService] = useState("all");
  const { toast } = useToast();
  const [groupedBookings, setGroupedBookings] = useState<{ [service: string]: any[] }>({})

useEffect(() => {
  const bookingsRef = collection(db, "bookings")
  const unsubscribe = onSnapshot(bookingsRef, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const grouped: { [service: string]: any[] } = {}
    bookings.forEach(booking => {
      const service = booking.service || "Unknown"
      if (!grouped[service]) grouped[service] = []
      grouped[service].push(booking)
    })

    setGroupedBookings(grouped)
  })

  return () => unsubscribe()
}, [])


  

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
      toast({
        title: "Booking Deleted",
        description: "The booking has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete booking.",
        variant: "destructive"
      });
    }
  };

  const handleEditSlot = async (service: string, time: string) => {
    const newCapacity = prompt("Enter new capacity for this time slot:");
    if (newCapacity) {
      // Update logic here (you may want to update the Firestore document)
      toast({
        title: "Slot Updated",
        description: "Time slot has been updated successfully.",
      });
    }
  };

  const handleClearSlot = async (service: string, time: string) => {
    const bookingsToDelete = groupedBookings[service][time]?.bookings || [];
    const deletePromises = bookingsToDelete.map(booking => deleteDoc(doc(db, "bookings", booking.id)));

    try {
      await Promise.all(deletePromises);
      toast({
        title: "Slot Cleared",
        description: "All bookings for this time slot have been cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear bookings.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (count: number, capacity: number) => {
    const percentage = (count / capacity) * 100;
    if (percentage >= 90) return <Badge className="bg-red-100 text-red-800">Full</Badge>;
    if (percentage >= 50) return <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>;
    return <Badge className="bg-green-100 text-green-800">Available</Badge>;
  };

  const filteredServices = selectedService === "all" 
    ? services 
    : services.filter(service => service.id === selectedService);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AdminHeader />

      {/* Background visual elements */ }
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-400/15 to-teal-400/20" />
      { /* Additional decorative elements would go here */ }

      <main className="container py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="icon" aria-label="Back to Dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Manage Booking Slots</h1>
              <p className="text-muted-foreground">View and manage all booking time slots</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="slots">Time Slots</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>

            {/* Time Slots Tab */}
            <TabsContent value="slots" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Time Slot Management</h2>
                  <p className="text-muted-foreground">Manage bookings by service and time slot</p>
                </div>
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-8">
                {filteredServices.map((service) => (
                  <Card key={service.id} className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>Time slots for {service.name.toLowerCase()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {timeSlots.map((time) => {
                          const slotData = groupedBookings[service.id]?.[time] || { bookings: [], count: 0 };
                          const capacity = 10; // Default capacity - should come from your data
                          
                          return (
                            <Card key={time} className="border">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-medium">{time}</h3>
                                  {getStatusBadge(slotData.count, capacity)}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex justify-between text-sm">
                                    <span>Capacity:</span>
                                    <span className="font-medium">{capacity}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span>Booked:</span>
                                    <span className="font-medium">{slotData.count}</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full"
                                      style={{ width: `${Math.min(100, (slotData.count / capacity) * 100)}%` }}
                                    />
                                  </div>
                                  <div className="flex space-x-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1"
                                      onClick={() => handleEditSlot(service.id, time)}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-red-600 hover:text-red-700"
                                      onClick={() => handleClearSlot(service.id, time)}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Clear
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex space-x-2">
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Service
                          </Button>
                          <Button variant="outline" className="flex-1 bg-transparent">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slots
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
