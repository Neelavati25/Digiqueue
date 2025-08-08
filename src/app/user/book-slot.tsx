"use client"

import { db } from "../../firebase/firebase"; // adjust path if needed
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DashboardHeader } from "../../components/dashboard-header";
import { Clock, MapPin, ArrowLeft } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { GoogleMap, LoadScript, Autocomplete } from "@react-google-maps/api";
import { getNearbyPlaces } from "../../lib/getNearbyPlaces"; // Adjust path
import cityList from '../../lib/indianCities.json'; // Adjust path as needed
import { Calendar } from "../../components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";

const services = [
  { id: 1, name: "Temple Visit", icon: "🏛️", locations: [] },
  { id: 2, name: "Hospital Appointment", icon: "🏥", locations: [] },
  { id: 3, name: "Salon Service", icon: "💇", locations: [] },
  { id: 4, name: "Government Office", icon: "🏢", locations: [] },
];

const timeSlots = [
  { time: "9:00 AM", available: 5, total: 10 },
  { time: "10:00 AM", available: 2, total: 10 },
  { time: "11:00 AM", available: 8, total: 10 },
  { time: "12:00 PM", available: 0, total: 10 },
  { time: "1:00 PM", available: 6, total: 10 },
  { time: "2:00 PM", available: 9, total: 10 },
  { time: "3:00 PM", available: 4, total: 10 },
  { time: "4:00 PM", available: 7, total: 10 },
];

const libraries = ["places"];

export default function BookSlotPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  const [mapRef, setMapRef] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: New Delhi
  const navigate = useNavigate();
  const { toast } = useToast();
  const [autocompleteRef, setAutocompleteRef] = useState<google.maps.places.Autocomplete | null>(null);

  const auth = getAuth();

  const handleBooking = async () => {
    if (!selectedService || !selectedCity || !selectedLocation || !selectedDate || !selectedTime) {
      toast({ title: "Please complete all fields." });
      return;
    }

    try {
      setIsLoading(true);

      const user = auth.currentUser ;
      const userId = user?.uid || "guest";
      const email = user?.email || "guest@example.com";

      await addDoc(collection(db, "bookings"), {
        userId,
        email,
        service:selectedServiceData?.name ,
        city: selectedCity,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime,
        status: "pending",
        createdAt: Timestamp.now(),
      });

      await addDoc(collection(db, "recentActivity"), {
        userId,
        email,
        action: "Booking Confirmed",
        service: selectedServiceData?.name,
        time: new Date().toISOString(),
        createdAt: Timestamp.now(),
        location: selectedLocation,
        icon: "CheckCircle",
        color: "text-green-600",
      });

      toast({ title: "Booking Confirmed!" });

      // ✅ Redirect after booking
      navigate("/user/dashboard");

    } catch (error) {
      console.error("Booking error:", error);
      toast({ title: "Booking failed. Try again later." });
    } finally {
      setIsLoading(false);
      // Reset the form
      setStep(1);
      setSelectedService("");
      setSelectedCity("");
      setSelectedLocation("");
      setSelectedDate("");
      setSelectedTime("");
    }
  };

  const handleSearch = async () => {
    if (mapRef && selectedCity && selectedService) {
      try {
        const results = await getNearbyPlaces(mapRef, mapCenter, selectedService.toLowerCase().replace(" ", "_"));
        setPlaces(results);
        // Update locations for the selected service
        const serviceIndex = services.findIndex(s => s.id.toString() === selectedService);
        if (serviceIndex !== -1) {
          services[serviceIndex].locations = results.map(place => place.name);
        }
      } catch (error) {
        console.error("Error fetching nearby places:", error);
        toast({
          title: "Error",
          description: "Could not fetch nearby places. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const selectedCityData = cityList.find(c => c.name === city);
    if (selectedCityData) {
      setMapCenter({ lat: selectedCityData.lat, lng: selectedCityData.lng });
      handleSearch(); // Fetch nearby places for the selected city and service
    }
  };

  const getAvailabilityColor = (available, total) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-orange-600";
    return "text-red-600";
  };

  const selectedServiceData = services.find((s) => s.id.toString() === selectedService);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container py-8 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          {/* Background animations here */}
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Book a Slot</h1>
              <p className="text-muted-foreground">Choose your service and preferred time</p>
            </div>
          </div>
           {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                    step >= stepNumber ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > stepNumber ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                </div>
                {stepNumber < 4 && <div className={`h-0.5 w-12 ${step > stepNumber ? "bg-violet-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Select Service"}
                {step === 2 && "Choose Location"}
                {step === 3 && "Pick Date & Time"}
                {step === 4 && "Confirm Booking"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "What service do you need?"}
                {step === 2 && "Where would you like to go?"}
                {step === 3 && "When would you like to visit?"}
                {step === 4 && "Review your booking details"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Select Service */}
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedService === service.id.toString() ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => setSelectedService(service.id.toString())}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {service.locations.length} locations available
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 2: Choose Location */}
              {step === 2 && selectedServiceData && (
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Select City</Label>

                  <Select
                    value={selectedCity}
                    onValueChange={(value) => {
                      handleCityChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                      <SelectValue placeholder="Choose a city" />
                    </SelectTrigger>

                    <SelectContent className="max-h-64 overflow-y-auto bg-white border rounded-md shadow-md z-50">
                      {cityList
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((city) => (
                          <SelectItem
                            key={city.name}
                            value={city.name}
                            className="px-4 py-2 text-sm text-gray-800 hover:bg-primary/10 hover:text-primary cursor-pointer"
                          >
                            <span className="block">{city.name}</span>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Label className="text-base font-semibold">Search & Select Location</Label>

                  <LoadScript
                    googleMapsApiKey="AIzaSyCxzHa-x_4y00mtJPLPeBR6ezp5BC0YMf0" // Replace with your Google Maps API key
                    libraries={libraries}
                  >
                    <Autocomplete
                      onLoad={(ref) => setAutocompleteRef(ref)}
                      onPlaceChanged={() => {
                        if (autocompleteRef) {
                          const place = autocompleteRef.getPlace();
                          if (place.geometry && place.geometry.location) {
                            const lat = place.geometry.location.lat();
                            const lng = place.geometry.location.lng();
                            setMapCenter({ lat, lng });
                            setSelectedLocation(place.formatted_address || place.name || "");
                            mapRef?.panTo({ lat, lng });
                          }
                        }
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search for a location..."
                        className="w-full border rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                      />
                    </Autocomplete>

                    <GoogleMap
                      mapContainerStyle={{ width: "100%", height: "400px" }}
                      center={mapCenter}
                      zoom={14}
                      onLoad={(map) => setMapRef(map)}
                    />
                  </LoadScript>
                </div>
              )}

              {/* Step 3: Pick Date & Time */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold">Select Date</Label>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {selectedDate ? (
                            new Date(selectedDate).toLocaleDateString()
                          ) : (
                            <span className="text-muted-foreground">Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate ? new Date(selectedDate) : undefined}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date.toISOString().split("T")[0]);
                            }
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {selectedDate && (
                    <div className="space-y-2">
                      <Label className="text-base font-semibold">Available Time Slots</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {timeSlots.map((slot) => (
                          <div
                            key={slot.time}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              slot.available === 0
                                ? "opacity-50 cursor-not-allowed bg-muted"
                                : selectedTime === slot.time
                                ? "border-primary bg-primary/5"
                                : "hover:shadow-md"
                            }`}
                            onClick={() => slot.available > 0 && setSelectedTime(slot.time)}
                          >
                            <div className="text-center">
                              <div className="font-medium">{slot.time}</div>
                              <div
                                className={`text-xs ${getAvailabilityColor(slot.available, slot.total)}`}
                              >
                                {slot.available > 0 ? `${slot.available} slots left` : "Full"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirm Booking */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <span className="font-medium">{selectedLocation}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">City:</span>
                      <span className="font-medium">{selectedCity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <span className="font-medium">{selectedDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Time:</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">What happens next?</h4>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1">
                          <li>• You'll receive a confirmation with your queue number</li>
                          <li>• Get real-time updates on your queue position</li>
                          <li>• Receive notifications when it's almost your turn</li>
                          <li>• Arrive at your scheduled time to skip the line</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>
                  Previous
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={
                      (step === 1 && !selectedService) ||
                      (step === 2 && !selectedCity) || // Check for selected city
                      (step === 2 && !selectedLocation) ||
                      (step === 3 && (!selectedDate || !selectedTime))
                    }
                  >
                    Next
                  </Button>
                ) : (
                  <Button onClick={handleBooking} disabled={isLoading}>
                    {isLoading ? "Booking..." : "Confirm Booking"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
