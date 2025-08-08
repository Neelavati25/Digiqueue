import { Search, Calendar, Clock, CheckCircle } from "lucide-react"
import '../index.css';

const steps = [
  {
    icon: Search,
    title: "Choose Service",
    description: "Select your desired service and location from our extensive network.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    title: "Pick Time Slot",
    description: "View available time slots and choose the one that fits your schedule.",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Clock,
    title: "Track Progress",
    description: "Monitor your queue position in real-time and get notified when it's your turn.",
    color: "from-orange-500 to-orange-600",
  },
  {
    icon: CheckCircle,
    title: "Arrive & Serve",
    description: "Arrive at your scheduled time and get served without waiting in line.",
    color: "from-purple-500 to-purple-600",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gradient-to-br from-muted/30 via-background to-primary/5 py-20 md:py-32">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl gradient-text">
            How DigiQueue Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in just four simple steps and never wait in line again.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 justify-items-center">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center group max-w-xs">
                {/* Icon */}
                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Step number */}
                <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {index + 1}
                </div>

                {/* Title & Description */}
                <h3 className="mt-6 text-xl font-semibold group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>

                {/* Optional connector line */}
                {index < steps.length - 1 && (
                  <>
                    <div className="absolute top-8 left-1/2 hidden h-0.5 w-full bg-gradient-to-r from-primary/50 to-purple-500/50 lg:block transform translate-x-8" />
                    <div className="absolute top-7 right-0 hidden lg:block">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
