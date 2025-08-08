import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import { ArrowRight, Clock, Users, MapPin, Shield } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/20 px-4">

      <div className="container relative z-10">
        
        <div className="w-full max-w-6xl mx-auto text-center">

          <div className="animate-fade-in-up">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Skip the Line, <span className="gradient-text">Save Your Time</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl">
              Book your service slots online in advance. Whether it's a temple visit, hospital appointment, salon
              service, or government office - DigiQueue ensures you never wait in long queues again.
            </p>
          </div>

          {/* Access Options */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
           <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
  <CardContent className="p-8 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
      <Users className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-2">I'm a User</h3>
   <p className="text-gray-800 mb-6">

      Book slots, track queues, and manage your appointments
    </p>
    <Link to="/user/login">
      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-lightblue-500 hover:to-blue-700 group" aria-label="Access User Portal">
        Access User Portal
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  </CardContent>
</Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
  <CardContent className="p-8 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
      <Shield className="h-8 w-8 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-2">I'm an Admin</h3>
    <p className="text-muted-foreground mb-6">Manage queues, slots, and monitor system analytics</p>
    <Link to="/admin/signup">
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 group"
        aria-label="Access Admin Panel"
      >
        Access Admin Panel
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Button>
    </Link>
  </CardContent>
</Card>

          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center animate-slide-in-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4 text-2xl font-bold">2+ Hours</div>
              <div className="text-sm text-muted-foreground">Average Time Saved</div>
            </div>
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4 text-2xl font-bold">10,000+</div>
              <div className="text-sm text-muted-foreground">Happy Users</div>
            </div>
            <div className="flex flex-col items-center animate-slide-in-right">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="mt-4 text-2xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
          </div>
        </div>
      </div>

      {/* PROMINENT Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
       {/* Large Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/25 via-purple-400/20 to-teal-400/30" />

        {/* Prominent Queue Lines Pattern */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-gradient-to-r from-primary/40 via-primary/60 to-transparent rounded-full animate-slide-right"
              style={{
                top: `${5 + i * 4.5}%`,
                left: "-10%",
                width: `${200 + Math.random() * 300}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: "6s",
              }}
            />
          ))}
        </div>

        

        

        {/* Large Moving Dots Pattern */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-primary/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        
      </div>
    </section>
  )
}
