import React from 'react';
import HeroSection from '@/components/HeroSection';
import AchievementSection from '@/components/AchievementSection';
import FeatureSection from '@/components/FeatureSection';
import AboutSection from '@/components/AboutSection';
import TestimonialSection from '@/components/Testimonial';
import CTASection from '@/components/CTASection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <AchievementSection />
      <FeatureSection />
      <AboutSection />
      <TestimonialSection />
      <CTASection />
      <ContactSection />
    </>
  );
}