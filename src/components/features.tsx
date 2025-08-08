import { Smartphone, Bell, History, MapPin, Clock, Shield } from "lucide-react"
import '../index.css';
const features = [
  {
    icon: Smartphone,
    title: "Remote Booking",
    description:
      "Choose your location and service, view available slots, and book instantly from the comfort of your home.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Clock,
    title: "Live Queue Tracking",
    description: "Real-time token progress shows how many people are ahead of you with accurate ETA for your turn.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get alerts when your slot is approaching and notifications about any delays or changes.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: History,
    title: "Booking History",
    description: "View all your past and upcoming bookings with status updates and options to cancel or reschedule.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Multiple Locations",
    description: "Access services across temples, hospitals, salons, government offices, and more locations.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Your data is protected with enterprise-grade security and reliable booking confirmations.",
    color: "from-indigo-500 to-indigo-600",
  },
]

export function Features() {
  return (
    <section className="min-h-screen flex items-center justify-center py-20 md:py-32 bg-gradient-to-b from-background to-muted/20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            Everything you need to skip the queue
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to make your service booking experience seamless and efficient.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border bg-card/50 backdrop-blur p-8 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-6 text-xl font-semibold group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
