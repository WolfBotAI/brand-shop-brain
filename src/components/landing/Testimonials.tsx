import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Brand-Shop.AI transformed how we manage our client stores. What used to take hours now happens automatically. The AI support alone saved us two full-time positions.",
    author: "Michael Chen",
    role: "Operations Director",
    company: "Premier Apparel Distributors",
    rating: 5,
  },
  {
    quote: "The AI Vision feature is incredible. We were spending 20+ hours a week manually entering POs. Now it's done in seconds with 99% accuracy.",
    author: "Sarah Johnson",
    role: "Founder & CEO",
    company: "Johnson Decorating Co.",
    rating: 5,
  },
  {
    quote: "Our clients love that they can build their own stores with AI guidance. Customer satisfaction is up 40% and our support tickets dropped by 60%.",
    author: "David Martinez",
    role: "VP of Sales",
    company: "Midwest Printing Solutions",
    rating: 5,
  },
  {
    quote: "The order routing system is a game-changer. We work with 12 decorators across 5 states, and now everything flows automatically based on our rules.",
    author: "Jennifer Williams",
    role: "Supply Chain Manager",
    company: "National Apparel Group",
    rating: 5,
  },
  {
    quote: "Finally, a platform that understands distributor needs. The acquisition engine helped us find 200 new B2B clients in our first quarter.",
    author: "Robert Thompson",
    role: "Marketing Director",
    company: "Thompson Promo Products",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-foreground mb-6">
            Trusted by Leading Distributors
          </h2>
          <p className="text-xl text-secondary-foreground/70">
            See what our customers have to say about transforming their business with Brand-Shop.AI
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                  <div className="h-full">
                    <div className="rounded-2xl p-8 h-full bg-secondary-foreground/5 border border-secondary-foreground/10">
                      {/* Quote Icon */}
                      <Quote className="w-10 h-10 text-primary mb-4" />

                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                        ))}
                      </div>

                      {/* Quote */}
                      <p className="text-secondary-foreground/90 text-lg mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-foreground">
                            {testimonial.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-secondary-foreground">
                            {testimonial.author}
                          </h4>
                          <p className="text-sm text-secondary-foreground/60">
                            {testimonial.role}
                          </p>
                          <p className="text-sm text-primary font-medium">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20" />
              <CarouselNext className="static translate-y-0 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/20" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </section>
  );
};
