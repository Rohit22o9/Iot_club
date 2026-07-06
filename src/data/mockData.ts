import type { Member, Project, Achievement, Activity, Resource, Faculty, Alumni, Event, GalleryItem, HomepageContent } from '../types';

export const initialHomepageContent: HomepageContent = {
  logo: '⚡',
  clubName: 'IoT Innovation Club',
  tagline: 'Bridging the physical and digital worlds through intelligent systems.',
  typingText: ['Innovate', 'Build', 'Connect', 'Lead'],
  aboutIntro: 'The IoT Innovation Club is a premier student-led technical group dedicated to exploring the internet of things, embedded systems, robotics, and edge AI. We foster a startup-like culture where student developers, hardware hackers, and software engineers collaborate to build real-world cyber-physical systems.',
  aboutVision: 'To be a globally recognized center of student excellence in IoT education, research, and product development, bridging engineering theory with hands-on technical solutions.',
  aboutMission: 'To cultivate a hands-on learning environment through structured bootcamps, collaborative industry projects, and research contributions, preparing members for careers in deep-tech and engineering.',
  aboutObjectives: [
    'Train students in microcontroller programming, sensor networks, and edge cloud architectures.',
    'Build industry-standard hardware prototypes and research-backed applications.',
    'Participate in national and international hackathons, technical papers, and innovation challenges.',
    'Collaborate with industry leaders to work on sponsored IoT research projects.'
  ],
  address: 'IoT Innovation Center, Department of Engineering, Tech Campus, Building B - Lab 404',
  email: 'iotclub@college.edu',
  phone: '+1 (555) 019-2834',
  googleMapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.997982697843!2d73.85438131489287!3d18.52885998740523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c0883858b72d%3A0x1d5b1217aefb4b9b!2sCOEP%20Technological%20University!5e0!3m2!1sen!2sin!4v1656789012345!5m2!1sen!2sin'
};

export const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Aravind Nair',
    year: 'BE',
    position: 'Club President / Hardware Architect',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    skills: ['ESP32', 'Raspberry Pi', 'RTOS', 'Firmware C++', 'Altium Designer'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: 'https://aravindnair.dev',
      email: 'aravind.nair@college.edu',
      phone: '+91 9876543210'
    },
    bio: 'Passionate hardware developer focusing on edge computing and embedded systems optimization. Built multiple RTOS-based industrial IoT prototypes and won two national hackathons.',
    education: [
      'B.Tech in Electronics & Telecommunication Engineering',
      'COEP Technological University, Class of 2027 (Expected)'
    ],
    skillsTech: ['C/C++', 'Python', 'FreeRTOS', 'Embedded Linux', 'Altium PCB', 'MQTT', 'I2C/SPI/UART'],
    skillsSoft: ['Leadership', 'Project Management', 'Public Speaking', 'Technical Writing'],
    projects: [
      {
        name: 'Autonomous Edge Smart Grid',
        description: 'Microgrid monitoring system using ESP32 nodes running FreeRTOS to prevent power grid overloads through distributed load shedding.',
        url: 'https://github.com'
      },
      {
        name: 'Edge AI Smart CCTV Node',
        description: 'Raspberry Pi-based security node running lightweight MobileNet models for offline object detection and low-latency alerts.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: '1st Place - Smart India Hackathon', year: '2025', org: 'Govt. of India' },
      { title: 'Best Hardware Design Award', year: '2024', org: 'IEEE Maker Fest' }
    ],
    certifications: [
      'RTOS Architecture and Design - Coursera',
      'Advanced PCB Layout Design - Udemy Academy'
    ]
  },
  {
    id: 'm2',
    name: 'Shreya Sharma',
    year: 'BE',
    position: 'Technical Head / Edge AI Researcher',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    skills: ['TensorFlow Lite', 'MicroPython', 'Python', 'Edge AI', 'AWS IoT'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'shreya.sharma@college.edu'
    },
    bio: 'Researcher in AI on the edge (TinyML). Enjoys running deep neural networks on microcontrollers with milliwatt power budgets.',
    education: [
      'B.Tech in Computer Science Engineering',
      'COEP Technological University, Class of 2027 (Expected)'
    ],
    skillsTech: ['Python', 'C++', 'TensorFlow Lite', 'Keras', 'Edge Impulse', 'Docker', 'AWS IoT Core'],
    skillsSoft: ['Problem Solving', 'Scientific Research', 'Team Mentorship', 'Agile Methodologies'],
    projects: [
      {
        name: 'TinyML Predictive Maintenance',
        description: 'Deploying neural networks on Arduino Nano 33 BLE Sense to predict motor bearing failures using vibration analysis.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: 'Winner - National Edge AI Hackathon', year: '2025', org: 'STMicroelectronics' },
      { title: 'Published Paper on TinyML in Agriculture', year: '2024', org: 'Springer IoT Journal' }
    ],
    certifications: [
      'Introduction to TinyML - HarvardX',
      'AWS Certified Cloud Practitioner - Amazon Web Services'
    ]
  },
  {
    id: 'm3',
    name: 'Kabir Mehta',
    year: 'TE',
    position: 'IoT Security Lead',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    skills: ['Cryptographic Hardware', 'ESP-IDF', 'C', 'Penetration Testing'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      portfolio: 'https://kabirmehta.io'
    },
    bio: 'Specialist in hardware security and secure firmware. Focusing on encryption, secure boot configurations, and firmware reverse engineering.',
    education: [
      'B.Tech in Instrumentation & Control Engineering',
      'COEP Technological University, Class of 2028 (Expected)'
    ],
    skillsTech: ['ESP-IDF', 'C', 'OpenSSL', 'Hardware Cryptography', 'Wireshark', 'Bash Scripting'],
    skillsSoft: ['Critical Thinking', 'Debugging', 'Team Collaboration'],
    projects: [
      {
        name: 'Secure OTA Firmware Update System',
        description: 'End-to-end secure firmware delivery system using Elliptic Curve Cryptography (ECC) for authenticating ESP32 update binaries.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: 'Top 10 - Global DefCon Hardware Hacking Village', year: '2025', org: 'DefCon' }
    ],
    certifications: [
      'Certified Ethical Hacker (CEH) - EC-Council',
      'ESP32 Secure Firmware Engineering - ESP Academy'
    ]
  },
  {
    id: 'm4',
    name: 'Ananya Deshmukh',
    year: 'TE',
    position: 'Cloud Integration Developer',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    skills: ['Node-RED', 'React', 'Node.js', 'InfluxDB', 'Grafana', 'MQTT'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'ananya.deshmukh@college.edu'
    },
    bio: 'Full stack developer with a knack for building real-time dashboards that aggregate millions of sensor metrics.',
    education: [
      'B.Tech in Information Technology',
      'COEP Technological University, Class of 2028 (Expected)'
    ],
    skillsTech: ['JavaScript/TypeScript', 'React', 'Node.js', 'MQTT', 'InfluxDB', 'Grafana', 'Docker'],
    skillsSoft: ['UI/UX Design', 'Communication', 'Organization'],
    projects: [
      {
        name: 'Smart Campus Sensor Dashboard',
        description: 'React/InfluxDB dashboard displaying live air quality, sound levels, and room occupancies from 30+ distributed club nodes.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: 'Best UI/UX Award - Smart Cities Hackathon', year: '2024', org: 'Govt. Smart Cities Mission' }
    ],
    certifications: [
      'Modern React with Redux - Udemy',
      'Full Stack Cloud Development - IBM'
    ]
  },
  {
    id: 'm5',
    name: 'Rohan Joshi',
    year: 'SE',
    position: 'Embedded Firmware Developer',
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300',
    skills: ['Arduino', 'C++', 'Raspberry Pi Pico', 'Sensors Integration'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com'
    },
    bio: 'IoT enthusiast exploring low-power communication networks (LoRaWAN) and sensor interfaces.',
    education: [
      'B.Tech in Electronics Engineering',
      'COEP Technological University, Class of 2029 (Expected)'
    ],
    skillsTech: ['Arduino IDE', 'C++', 'Python', 'SPI/I2C Protocols', 'LoRaWAN'],
    skillsSoft: ['Quick Learner', 'Collaboration', 'Enthusiastic Programmer'],
    projects: [
      {
        name: 'LoRa Soil Moisture Node',
        description: 'Ultra-low power soil moisture node transmitting sensor readings up to 5km using a LoRa transceiver and solar battery.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: 'Winner - Freshers Technical Competition', year: '2024', org: 'COEP Tech' }
    ],
    certifications: [
      'Arduino Embedded Systems - Udemy'
    ]
  },
  {
    id: 'm6',
    name: 'Meera Kulkarni',
    year: 'SE',
    position: 'App & Dashboard Developer',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300',
    skills: ['Flutter', 'Firebase', 'IoT APIs', 'CSS Glassmorphism'],
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'meera.kulkarni@college.edu'
    },
    bio: 'Front-end mobile developer building beautiful, modern mobile applications that control smart appliances via BLE and WiFi.',
    education: [
      'B.Tech in Computer Engineering',
      'COEP Technological University, Class of 2029 (Expected)'
    ],
    skillsTech: ['Dart', 'Flutter', 'Firebase', 'REST APIs', 'Bluetooth Low Energy (BLE)', 'HTML/CSS'],
    skillsSoft: ['Aesthetic Eye', 'Active Listening', 'Agile Team Member'],
    projects: [
      {
        name: 'Smart Bulb controller app',
        description: 'Flutter mobile application using BLE protocol to connect, authenticate, and modify RGB bulb patterns in real-time.',
        url: 'https://github.com'
      }
    ],
    achievements: [
      { title: 'Runner Up - CodeForIndia Hackathon', year: '2024', org: 'Microsoft Student Partner India' }
    ],
    certifications: [
      'Complete Flutter Development Bootcamp - App Brewery'
    ]
  }
];

export const initialProjects: Project[] = [
  {
    id: 'p1',
    title: 'Autonomous Agricultural Drone Network',
    description: 'A network of multi-spectral sensor nodes and autonomous UAVs communicating via LoRaMESH to track crop health, soil moisture, and pest anomalies. Sensor data triggers drones for targeted precision pesticide application.',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=600',
    tags: ['ESP32', 'LoRa Mesh', 'Raspberry Pi 4', 'Edge AI', 'UAV Flight Controller'],
    team: ['Aravind Nair', 'Shreya Sharma', 'Rohan Joshi'],
    github: 'https://github.com',
    demo: 'https://youtube.com'
  },
  {
    id: 'p2',
    title: 'Decentralized Edge Smart Microgrid',
    description: 'An intelligent hardware grid monitoring system that dynamically switches power loads across clean energy sources. Utilizes custom PCB relays and ESP32 chips running a consensus mechanism to load shed without server dependencies.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600',
    tags: ['ESP32', 'FreeRTOS', 'Custom PCB Relays', 'Modbus', 'Grafana'],
    team: ['Aravind Nair', 'Ananya Deshmukh'],
    github: 'https://github.com',
    demo: 'https://youtube.com'
  },
  {
    id: 'p3',
    title: 'TinyML Industrial Vibration Analyzer',
    description: 'A matchbox-sized acceleration sensor node attached to mechanical induction motors. It runs on-device convolutional networks to analyze frequency vibrations and predict mechanical failure weeks before it occurs.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    tags: ['Arduino Nano 33 BLE Sense', 'TensorFlow Lite Micro', 'BLE', 'Edge Impulse'],
    team: ['Shreya Sharma', 'Rohan Joshi'],
    github: 'https://github.com',
    demo: 'https://youtube.com'
  },
  {
    id: 'p4',
    title: 'Secure OTA Cryptographic Firmware Suite',
    description: 'A bootloader framework designed for embedded devices in remote environments. Utilizes hardware encryption modules (AETHS608) to verify digital signatures on firmware binaries before flashing updates via cellular networks.',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
    tags: ['ESP-IDF', 'ATECC608 Crypto Chip', 'LTE-M Router', 'ECDSA Encryption'],
    team: ['Kabir Mehta'],
    github: 'https://github.com',
    demo: 'https://youtube.com'
  }
];

export const initialAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'National Champions - Smart India Hackathon',
    description: 'Developed an offline IoT disaster communication node that functions during infrastructure collapses. Won first prize of ₹1,00,000.',
    date: 'Dec 2025',
    award: '1st Place',
    category: 'hackathon'
  },
  {
    id: 'a2',
    title: 'Best Research Paper Award - IEEE International Conference',
    description: 'Published paper "Edge AI Enabled Sensor Cluster for Precision Agriculture" in the proceedings of IEEE IoT Journal 2024.',
    date: 'Oct 2024',
    award: 'Best Paper',
    category: 'paper'
  },
  {
    id: 'a3',
    title: 'Global Finalists - STMicroelectronics Edge AI Cup',
    description: 'Created a hand-gesture-to-speech translator using an ultra-low-power MCU and inertial sensors.',
    date: 'Apr 2025',
    award: 'Top 5 Globally',
    category: 'competition'
  },
  {
    id: 'a4',
    title: 'AWS Academy Cloud & IoT Architect Certifications',
    description: '15 active club members successfully cleared the professional certification exams funded by the institution.',
    date: 'Nov 2024',
    award: 'Institutional Grant',
    category: 'certification'
  }
];

export const initialActivities: Activity[] = [
  {
    id: 'act1',
    title: 'Hands-on ESP32 Boot Camp 2026',
    description: 'A 3-day deep dive into ESP32 microcontroller architecture, FreeRTOS tasks, task queues, and WiFi client/server implementations.',
    date: 'Feb 15 - 17, 2026',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'act2',
    title: 'IoT Security & Penetration Testing Seminar',
    description: 'Special guest lecture from a cyber-defense industry expert showing how to capture MQTT packets, find firmware backdoors, and reverse-engineer custom binary formats.',
    date: 'Mar 28, 2026',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'act3',
    title: 'IoT Ideation Hackfest',
    description: 'Internal hackathon challenging members to build sustainable IoT products utilizing only salvaged components and solar energy.',
    date: 'May 10, 2026',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600'
  }
];

export const initialResources: Resource[] = [
  {
    id: 'r1',
    title: 'Arduino Hardware Mapping & Sensor Interfacing Guide',
    description: 'A curated handbook detailing pull-up resistors, ADC noise-reduction, and analog sensor calibration formulas.',
    category: 'Arduino',
    link: 'https://github.com'
  },
  {
    id: 'r2',
    title: 'ESP-IDF (Native SDK) Multitasking & RTOS Boilerplate',
    description: 'Clean starter code for running ESP32 firmware on dual-core microcontrollers, handling mutex lockups and message passing.',
    category: 'ESP32',
    link: 'https://github.com'
  },
  {
    id: 'r3',
    title: 'Raspberry Pi Edge Computer Setup & Docker Deployment',
    description: 'Instructions on setting up headless Raspbian OS, configuring static IPs, and launching local MQTT + Node-RED services via Docker.',
    category: 'Raspberry Pi',
    link: 'https://github.com'
  },
  {
    id: 'r4',
    title: 'MQTT Broker Architecture Security Best Practices',
    description: 'Official club documentation mapping out secure TLS connections, username/password access controls, and topic subscription ACL guidelines.',
    category: 'Documentation',
    link: 'https://github.com'
  },
  {
    id: 'r5',
    title: 'Interactive Circuit Design Simulator - Wokwi Platform',
    description: 'Cloud environment link to build, simulate, and debug ESP32 and Arduino setups directly in the web browser.',
    category: 'Useful Links',
    link: 'https://wokwi.com'
  }
];

export const initialFaculty: Faculty[] = [
  {
    id: 'f1',
    name: 'Dr. Anand Deshpande',
    role: 'Faculty Advisor & Associate Professor (Electronics Dept.)',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300',
    email: 'anand.deshpande@college.edu',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'f2',
    name: 'Prof. Vineeta Murthy',
    role: 'Mentor & Embedded Systems Lab Director',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    email: 'vineeta.murthy@college.edu',
    linkedin: 'https://linkedin.com'
  }
];

export const initialAlumni: Alumni[] = [
  {
    id: 'al1',
    name: 'Vikram Sen',
    batch: 'Batch of 2024',
    company: 'Tesla Inc.',
    position: 'Embedded Software Engineer',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'al2',
    name: 'Priyanka Ghose',
    batch: 'Batch of 2025',
    company: 'Qualcomm',
    position: 'Firmware Dev Engineer',
    linkedin: 'https://linkedin.com'
  },
  {
    id: 'al3',
    name: 'Sameer Pathak',
    batch: 'Batch of 2024',
    company: 'Bosch Engineering',
    position: 'IoT Cloud Architect',
    linkedin: 'https://linkedin.com'
  }
];

export const initialEvents: Event[] = [
  {
    id: 'e1',
    title: 'Edge AI Innovation Hackfest (ST-Micro Sponsor)',
    description: 'A 36-hour physical hackathon to design industrial and health hardware interfaces. Kit support and cash prizes will be provided.',
    date: 'Aug 22 - 24, 2026',
    time: '9:00 AM onwards',
    venue: 'Embedded Lab 102 & Innovation Hall',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=600',
    status: 'upcoming',
    registrationLink: '#/register-event'
  },
  {
    id: 'e2',
    title: 'Bootcamp: Advanced PCB Design with Altium Designer',
    description: 'Structured course covering multi-layer schematic captures, routing techniques, grounding planes, and export files for manufacturing.',
    date: 'Jul 10 - 12, 2026',
    time: '3:00 PM - 6:00 PM',
    venue: 'IoT Seminar Room',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=600',
    status: 'ongoing',
    registrationLink: '#/register-event'
  },
  {
    id: 'e3',
    title: 'Symposium: IoT Protocols and Cloud Gateways',
    description: 'Seminar detailing raw TCP vs. MQTT overheads, WebSockets, COAP applications, and security layers like TLS 1.3.',
    date: 'Jun 14, 2026',
    time: '11:00 AM - 1:30 PM',
    venue: 'Webinar Hall',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
    status: 'completed'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'g1',
    title: 'ESP32 Bootcamp Session',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    category: 'workshops'
  },
  {
    id: 'g2',
    title: 'Hardware Testing Lab Hours',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600',
    category: 'events'
  },
  {
    id: 'g3',
    title: 'Smart Grid Hackathon Presentation',
    image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=600',
    category: 'competitions'
  },
  {
    id: 'g4',
    title: 'IoT Security Lab Demonstration',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600',
    category: 'seminars'
  },
  {
    id: 'g5',
    title: 'Guest Lecture by Tesla Engineer',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600',
    category: 'guest lectures'
  },
  {
    id: 'g6',
    title: 'Makerspace Collaborative Work',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
    category: 'events'
  }
];
