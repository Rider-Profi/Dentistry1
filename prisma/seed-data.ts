// Illustrative London private-dentistry fees for the portfolio demo. See docs/demo-pricing.md.
export const servicesSeed = [
  {
    "slug": "terapiya",
    "name": "Fillings & Root Canal Treatment",
    "category": "General Dentistry",
    "icon": "Sparkles",
    "shortDescription": "Restore a damaged tooth with care that puts your comfort first.",
    "description": "From a small filling to root canal treatment, we explain your options and help you make an informed choice about caring for your natural teeth.",
    "treatmentSteps": [
      "Talk through your concerns and examine your teeth",
      "Agree your treatment plan and discuss anaesthetic",
      "Restore the tooth with a filling or root canal treatment",
      "Review your recovery and ongoing care"
    ],
    "prices": [
      {
        "name": "Tooth-coloured filling",
        "description": "Composite filling; the fee depends on the size and position of the tooth.",
        "priceFrom": 195,
        "unit": "per tooth"
      },
      {
        "name": "Root canal treatment",
        "description": "Fee depends on the tooth and complexity. A final crown, if needed, is charged separately.",
        "priceFrom": 650,
        "priceTo": 950,
        "unit": "per tooth"
      }
    ]
  },
  {
    "slug": "gigiena",
    "name": "Dental Hygiene",
    "category": "Preventive Care",
    "icon": "WandSparkles",
    "shortDescription": "A fresh start for your smile, with practical advice for everyday care.",
    "description": "A hygiene appointment helps you care for your teeth and gums. We tailor cleaning and home-care advice to your needs, including Airflow stain removal where suitable.",
    "treatmentSteps": [
      "Discuss your routine and check your gum health",
      "Remove plaque and hardened deposits",
      "Polish and remove surface stains where suitable",
      "Build a home-care routine that works for you"
    ],
    "prices": [
      {
        "name": "Hygiene appointment with Airflow",
        "description": "A 45-minute visit, including cleaning, polishing and personalised home-care advice.",
        "priceFrom": 99,
        "unit": "per visit"
      }
    ]
  },
  {
    "slug": "otbelivanie",
    "name": "Teeth Whitening",
    "category": "Cosmetic Dentistry",
    "icon": "Sun",
    "shortDescription": "Explore a brighter smile with advice on what is right for your teeth.",
    "description": "We assess your teeth and discuss your goals before recommending whitening. Your dentist will explain the likely results, possible sensitivity and how to care for your smile afterwards.",
    "treatmentSteps": [
      "Check suitability and discuss your preferred shade",
      "Agree a personalised whitening plan",
      "Carry out dentist-led whitening",
      "Review your results and aftercare"
    ],
    "prices": [
      {
        "name": "In-practice teeth whitening",
        "description": "Treatment for upper and lower teeth, subject to a suitability assessment.",
        "priceFrom": 595,
        "unit": "per course"
      }
    ]
  },
  {
    "slug": "implantaciya",
    "name": "Dental Implants",
    "category": "Restorative Dentistry",
    "icon": "CircleDot",
    "shortDescription": "Consider a long-term option for replacing a missing tooth.",
    "description": "An implant may be an option if you have a missing tooth. We assess your suitability, explain each stage and provide a written estimate before you decide.",
    "treatmentSteps": [
      "Assess your teeth and discuss any scans needed",
      "Plan and place the implant",
      "Allow time for healing and review your progress",
      "Fit the final crown and explain ongoing care"
    ],
    "prices": [
      {
        "name": "Single implant placement",
        "description": "Implant placement only. Crown charged separately; scans or bone grafting may add to the total.",
        "priceFrom": 1700,
        "unit": "per implant"
      },
      {
        "name": "Crown for a dental implant",
        "description": "Custom-made crown and abutment. Together with placement, a single implant starts from £2,695.",
        "priceFrom": 995,
        "unit": "per crown"
      }
    ]
  },
  {
    "slug": "ortodontiya",
    "name": "Braces & Clear Aligners",
    "category": "Orthodontics",
    "icon": "Smile",
    "shortDescription": "Find a teeth-straightening option that fits your goals and daily life.",
    "description": "Explore fixed braces or clear aligners with a personalised assessment. We explain the expected treatment time, review visits and retention before you start.",
    "treatmentSteps": [
      "Assess your bite and discuss your goals",
      "Compare suitable options and agree your plan",
      "Fit your braces or start your aligners",
      "Attend reviews and plan your retainers"
    ],
    "prices": [
      {
        "name": "Fixed metal braces",
        "description": "One arch, including routine adjustment visits. Retainers are quoted separately.",
        "priceFrom": 2500,
        "unit": "per arch"
      },
      {
        "name": "Clear aligner treatment",
        "description": "Upper and lower teeth, depending on complexity. Includes routine reviews; retainers quoted separately.",
        "priceFrom": 3000,
        "priceTo": 5000,
        "unit": "per course"
      }
    ]
  },
  {
    "slug": "hirurgiya",
    "name": "Tooth Removal",
    "category": "Oral Surgery",
    "icon": "ShieldPlus",
    "shortDescription": "Clear explanations and thoughtful aftercare when a tooth needs removing.",
    "description": "If a tooth needs to be removed, we talk you through the options and what to expect. We discuss anaesthetic, recovery and aftercare before treatment.",
    "treatmentSteps": [
      "Examine the tooth and discuss your options",
      "Explain the procedure and plan your comfort",
      "Remove the tooth",
      "Provide aftercare advice and arrange a review if needed"
    ],
    "prices": [
      {
        "name": "Routine tooth removal",
        "description": "A straightforward extraction under local anaesthetic.",
        "priceFrom": 195,
        "unit": "per tooth"
      },
      {
        "name": "Surgical wisdom tooth removal",
        "description": "Fee depends on the position of the tooth and complexity. Sedation, if needed, is quoted separately.",
        "priceFrom": 350,
        "priceTo": 650,
        "unit": "per tooth"
      }
    ]
  }
] as const;

// Fictional profiles and patient stories for the portfolio demonstration.
export const doctorsSeed = [
  {
    "slug": "emily-smith",
    "name": "Dr Emily Smith",
    "position": "Lead Dentist · General Dentistry",
    "specialties": [
      "General Dentistry",
      "Cosmetic Dentistry"
    ],
    "experience": 14,
    "photoUrl": "/avatars/emily-smith.svg",
    "description": "Emily brings a calm, unhurried approach to every conversation. In this fictional profile, she helps patients understand their options for restoring teeth and caring for their smiles, with particular attention to those who feel nervous about visiting the dentist.",
    "education": [
      "Illustrative background in general and restorative dentistry",
      "A patient-centred approach to treatment planning"
    ],
    "certificates": [
      "Example development focus: caring for nervous patients",
      "Example development focus: tooth-coloured restorations"
    ],
    "serviceSlugs": [
      "terapiya",
      "gigiena",
      "otbelivanie"
    ]
  },
  {
    "slug": "james-wilson",
    "name": "Dr James Wilson",
    "position": "Dentist · Oral Surgery & Implants",
    "specialties": [
      "Dental Implants",
      "Oral Surgery"
    ],
    "experience": 12,
    "photoUrl": "/avatars/james-wilson.svg",
    "description": "James values clear explanations and time for questions. This fictional profile illustrates a dentist who guides patients through tooth replacement and removal, from the first discussion to practical advice for recovery.",
    "education": [
      "Illustrative background in oral surgery and implant dentistry",
      "A considered approach to planning and aftercare"
    ],
    "certificates": [
      "Example development focus: implant treatment planning",
      "Example development focus: supporting recovery after surgery"
    ],
    "serviceSlugs": [
      "implantaciya",
      "hirurgiya"
    ]
  },
  {
    "slug": "olivia-brown",
    "name": "Dr Olivia Brown",
    "position": "Dentist · Teeth Straightening",
    "specialties": [
      "Orthodontics",
      "Clear Aligners"
    ],
    "experience": 10,
    "photoUrl": "/avatars/olivia-brown.svg",
    "description": "Olivia enjoys helping people feel informed about their next step. In this fictional profile, she talks through braces and clear aligners in plain English, with a focus on realistic expectations and a treatment routine that fits everyday life.",
    "education": [
      "Illustrative background in orthodontic care",
      "A collaborative approach to treatment goals"
    ],
    "certificates": [
      "Example development focus: clear aligner planning",
      "Example development focus: retention and long-term care"
    ],
    "serviceSlugs": [
      "ortodontiya"
    ]
  }
] as const;

export const reviewsSeed = [
  {
    "author": "Charlotte M.",
    "rating": 5,
    "service": "Tooth-coloured filling",
    "doctor": "Dr Emily Smith",
    "text": "I was rather nervous about having a filling, but Emily explained everything and gave me time to settle. I did not feel any pain during the treatment, and the whole visit felt calm and unhurried."
  },
  {
    "author": "Daniel W.",
    "rating": 5,
    "service": "Dental implants",
    "doctor": "Dr James Wilson",
    "text": "A very thoughtful service from the first conversation. James talked me through the stages and costs without any pressure, and the reception team were helpful when I needed to rearrange a visit."
  },
  {
    "author": "Sophie R.",
    "rating": 5,
    "service": "Clear aligners",
    "doctor": "Dr Olivia Brown",
    "text": "The studio felt spotless and welcoming. Olivia listened carefully to what I wanted to achieve and explained the aligner plan in a way that was easy to follow. I appreciated having plenty of time for questions."
  },
  {
    "author": "Oliver T.",
    "rating": 5,
    "service": "Dental hygiene",
    "text": "A friendly welcome and a gentle, thorough clean. I felt comfortable throughout, and the advice afterwards was practical rather than overwhelming. A lovely example of attentive service."
  }
] as const;
