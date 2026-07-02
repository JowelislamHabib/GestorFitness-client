"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-red-600 font-extrabold uppercase tracking-[0.2em] text-xs mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 uppercase">
            Let's Talk Fitness
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium">
            Have questions about our classes, trainers, or memberships? We're here to help you on your fitness journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Contact Information */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="border bg-card hover:border-red-500/50 transition-colors duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Our Location</h3>
                    <p className="text-muted-foreground text-sm">123 Fitness Avenue,<br />Gym District, NY 10001</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border bg-card hover:border-red-500/50 transition-colors duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                    <p className="text-muted-foreground text-sm">+1 (555) 123-4567<br />+1 (555) 987-6543</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border bg-card hover:border-red-500/50 transition-colors duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                    <p className="text-muted-foreground text-sm">support@gestorfitness.com<br />trainers@gestorfitness.com</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="border bg-card hover:border-red-500/50 transition-colors duration-300">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Working Hours</h3>
                    <p className="text-muted-foreground text-sm">Mon - Fri: 6:00 AM - 10:00 PM<br />Sat - Sun: 8:00 AM - 8:00 PM</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border shadow-sm bg-card">
              <CardContent className="p-8 md:p-10">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-foreground font-semibold">First Name</Label>
                      <Input id="firstName" placeholder="John" className="bg-background h-12 focus-visible:ring-red-600 focus-visible:border-red-600" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-semibold">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" className="bg-background h-12 focus-visible:ring-red-600 focus-visible:border-red-600" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground font-semibold">Email Address</Label>
                    <Input id="email" type="email" placeholder="john.doe@example.com" className="bg-background h-12 focus-visible:ring-red-600 focus-visible:border-red-600" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-foreground font-semibold">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" className="bg-background h-12 focus-visible:ring-red-600 focus-visible:border-red-600" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-foreground font-semibold">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..." 
                      className="min-h-[150px] bg-background resize-none focus-visible:ring-red-600 focus-visible:border-red-600"
                    />
                  </div>

                  <Button type="submit" className="w-full md:w-auto h-12 px-8 bg-red-600 hover:bg-red-700 text-white font-bold tracking-wide uppercase text-sm transition-transform hover:scale-[1.02] active:scale-95">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
