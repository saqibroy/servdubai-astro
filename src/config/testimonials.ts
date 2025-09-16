export const testimonials = {
  reviews: [
    {
      id: 1,
      name: "Ahmed Al-Rashid",
      position: "Project Manager",
      company: "Dubai Properties Group",
      image: {
        initials: "AA",
        gradientFrom: "primary-500",
        gradientTo: "secondary-500"
      },
      rating: 5,
      text: "ServDubai completed the finishing work for our entire 40-floor Marina Heights Tower. Their kitchen and bathroom installations were flawless, and they delivered on time for our handover deadline. The quality exceeded our expectations and helped us achieve premium unit sales.",
      project: {
        name: "Marina Heights Tower",
        scope: "120 units",
        value: "AED 1.2M",
        duration: "6 weeks completion"
      }
    },
    {
      id: 2,
      name: "Michael Kowalski",
      position: "Construction Director",
      company: "Emaar Construction",
      image: {
        initials: "MK",
        gradientFrom: "secondary-500",
        gradientTo: "accent-500"
      },
      rating: 5,
      text: "We've partnered with ServDubai on multiple projects across Downtown Dubai. Their marble and tile installation work is exceptional, and they understand the tight deadlines we face in construction. They're now our go-to finishing specialists for all premium developments.",
      project: {
        name: "Downtown Square Project",
        scope: "85 units",
        value: "AED 850K",
        duration: "4 weeks completion"
      }
    },
    {
      id: 3,
      name: "Fatima Al-Suwaidi",
      position: "Building Owner",
      company: "Business Bay Towers",
      image: {
        initials: "FS",
        gradientFrom: "accent-500",
        gradientTo: "primary-500"
      },
      rating: 5,
      text: "I needed custom woodwork and AC installations for my new commercial building. ServDubai's team delivered exceptional craftsmanship and completed the project ahead of schedule. The quality helped me achieve 95% occupancy within the first month of opening.",
      project: {
        name: "Business Bay Commercial Tower",
        scope: "Commercial Building",
        value: "AED 650K",
        duration: "3 weeks completion"
      }
    },
    {
      id: 4,
      name: "Rajesh Jain",
      position: "Property Manager",
      company: "DAMAC Properties",
      image: {
        initials: "RJ",
        gradientFrom: "green-500",
        gradientTo: "primary-500"
      },
      rating: 5,
      text: "ServDubai has been our trusted partner for finishing work across multiple DAMAC towers. Their painting and flooring teams are exceptional, and they understand the importance of meeting handover deadlines. We've worked together on over 200 units this year alone.",
      project: {
        name: "DAMAC Hills Towers",
        scope: "200+ units",
        value: "AED 2.1M",
        duration: "8 weeks completion"
      }
    },
    {
      id: 5,
      name: "James Morrison",
      position: "Site Contractor",
      company: "Al Futtaim Construction",
      image: {
        initials: "JM",
        gradientFrom: "red-500",
        gradientTo: "orange-500"
      },
      rating: 5,
      text: "When we needed urgent finishing work for a delayed project in Dubai South, ServDubai mobilized their entire team within 24 hours. They worked around the clock to complete kitchen and bathroom installations, helping us avoid penalty costs. True professionals!",
      project: {
        name: "Dubai South Residential Complex",
        scope: "Residential Complex",
        value: "AED 950K",
        duration: "2 weeks rush completion"
      }
    },
    {
      id: 6,
      name: "Lisa Thompson",
      position: "Apartment Owner",
      company: "Palm Jumeirah",
      image: {
        initials: "LT",
        gradientFrom: "purple-500",
        gradientTo: "pink-500"
      },
      rating: 5,
      text: "I bought a shell apartment in a new Palm Jumeirah tower and needed complete finishing work. ServDubai transformed it into a luxury home with custom woodwork, premium marble flooring, and a stunning kitchen. The value increase exceeded my investment by 40%!",
      project: {
        name: "Palm Jumeirah Apartment",
        scope: "Complete Apartment",
        value: "AED 180K",
        duration: "5 weeks completion"
      }
    }
  ],
  beforeAfterGallery: [
    {
      id: 1,
      type: "Kitchen Finishing",
      title: "Complete Kitchen Installation",
      location: "Dubai Marina • New tower development",
      image: {
        url: "/gallery/transformations/kitchen-before-after.jpg",
        dimensions: "1200x800px",
        fallbackGradient: {
          from: "gray-200",
          to: "gray-300"
        }
      },
      description: "Before and after photos of complete kitchen installation work showing cabinet installation, countertop fitting, and appliance connections in Dubai Marina tower development"
    },
    {
      id: 2,
      type: "Flooring",
      title: "Premium Marble Installation",
      location: "Business Bay • Commercial building",
      image: {
        url: "/gallery/transformations/marble-before-after.jpg",
        dimensions: "1200x800px",
        fallbackGradient: {
          from: "blue-200",
          to: "blue-300"
        }
      },
      description: "Before and after photos of premium marble flooring installation work showing expert stone laying and polishing in Business Bay commercial building"
    },
    {
      id: 3,
      type: "Bathroom",
      title: "Luxury Bathroom Finishing",
      location: "Downtown Dubai • Residential tower",
      image: {
        url: "/gallery/transformations/bathroom-before-after.jpg",
        dimensions: "1200x800px",
        fallbackGradient: {
          from: "green-200",
          to: "green-300"
        }
      },
      description: "Before and after photos of luxury bathroom finishing work showing fixture installation, tile work, and plumbing connections in Downtown Dubai residential tower"
    }
  ],
  stats: {
    buildingsCompleted: "500+",
    onTimeDelivery: "98%",
    projectSupport: "24/7",
    warranty: "12"
  }
}
