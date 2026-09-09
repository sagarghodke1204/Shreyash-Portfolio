import type { Profile, Experience, Education, Skill, Project, Achievement, Publication } from '../types';

export const fallbackProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Shreyash Choudhari',
  title: 'Robotics / AI / Machine Learning Engineer',
  bio: 'Robotics and AI/ML engineer working on vision-language models, robot manipulation, perception, autonomous navigation, and control systems. Experienced in developing edge-deployable pipelines, legged platforms, and simulation-to-real transfer.',
  avatar_url: null,
  resume_url: '#', // Placeholder for public view
  contact_email: 'shreyash.choudhari@example.com', // Placeholder
  linkedin_url: 'https://linkedin.com',
  github_url: 'https://github.com',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const fallbackExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Kalyani Group / Bharat Forge',
    role: 'RL Engineer',
    location: 'Pune',
    start_date: 'December 2025',
    end_date: 'Present',
    is_current: true,
    highlights: [
      'VLM-based robotic perception pipeline using audio input to identify target objects, perform recognition and 3D localization, and enable robots to search across multi-floor buildings and navigate toward targets.',
      'Landmark-based navigation with zero-shot object detection and prompt-based segmentation.',
      'Work involving quadruped, legged, and humanoid platforms such as Go2 and B2-class robots.',
      'Approximately 20 cm navigation accuracy using a monocular camera.',
      '2-finger pick-and-place pipelines for humanoid robots using Vision-Language-Action models.',
      'Monocular-camera-based VLA pick-and-place for a UR5 robotic arm.'
    ],
    display_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 'exp-2',
    company: 'Simplia AI',
    role: 'AI/Robotics Engineer',
    location: 'Remote, US-based',
    start_date: 'October 2025',
    end_date: 'December 2025',
    is_current: false,
    highlights: [
      'Developed humanoid-based restaurant management systems.',
      'People tracking.',
      'Customer flow understanding.',
      'Order management.',
      'Simulation pipelines for humanoid-assisted restaurant operations.',
      'Inventory handling and workflow management.',
      'Service-robot workflow design.'
    ],
    display_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 'exp-3',
    company: 'IISc Bangalore',
    role: 'Research Associate – AI/ML & Robotics',
    location: 'Bangalore',
    start_date: 'July 2024',
    end_date: 'October 2025',
    is_current: false,
    highlights: [
      'Mission Planner: Mission planner for an aircraft carrying Electro Optical, IR and Synthetic Aperture Radar imaging sensors. Optimized imaging flight paths for multiple targets. Project submission completed and currently being patented by the senior team.',
      'End-to-End Autonomous Navigation for Vision Language Model: Developed edge-deployable models on NVIDIA Jetson AGX. Few-shot and zero-shot generalization. Test-time adaptation using VLMs. Domain generalization. Sim-to-real adaptation. VLM fine-tuning and TRL-based supervised fine-tuning.'
    ],
    display_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 'exp-4',
    company: 'Emerging Technology',
    role: 'Systems Engineer',
    location: 'Remote',
    start_date: 'February 2023',
    end_date: 'June 2024',
    is_current: false,
    highlights: [
      'ADAS: Remote control, follow-the-car, overtake scenarios. Implementation on Honda car.',
      'Python package for industrial servo motor control using Modbus RTU.',
      'Sensor and actuator integration: Encoder, Ultrasonic sensors, Acceleration/brake control systems.'
    ],
    display_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 'exp-5',
    company: 'IIT Bombay',
    role: 'Research Intern – under Prof. Arpita Sinha',
    location: 'Bombay',
    start_date: 'September 2022',
    end_date: 'January 2023',
    is_current: false,
    highlights: [
      'Trajectory planning for Level-5 autonomous car in highway scenarios.',
      'Camera-based navigation using Oak-D Pro camera.',
      'Isaac Sim simulation and CARLA verification.',
      'Implementation on a four-wheeler with multiple sensors.'
    ],
    display_order: 5,
    created_at: new Date().toISOString()
  }
];

export const fallbackEducation: Education[] = [
  {
    id: 'edu-1',
    institution: 'Pune University (VIIT)',
    degree: 'Bachelor of Engineering (B.E.)',
    field_of_study: 'Mechanical Engineering',
    start_date: null,
    end_date: null,
    grade: 'First Class with Distinction',
    details: [
      'Specialized in Robotics, Automation, and Control Systems.',
      'Final Year Project: Design and Fabrication of STEM Bot (Autonomous Mobile Robot).'
    ],
    display_order: 1,
    created_at: new Date().toISOString()
  }
];

export const fallbackSkills: Skill[] = [
  // Programming
  { id: 's-1', name: 'ROS / ROS2', category: 'Programming', display_order: 1, created_at: '' },
  { id: 's-2', name: 'Python', category: 'Programming', display_order: 2, created_at: '' },
  { id: 's-3', name: 'PyTorch', category: 'Programming', display_order: 3, created_at: '' },
  { id: 's-4', name: 'Git', category: 'Programming', display_order: 4, created_at: '' },

  // Robotics Hardware
  { id: 's-5', name: 'Arduino', category: 'Robotics Hardware', display_order: 1, created_at: '' },
  { id: 's-6', name: 'Raspberry Pi', category: 'Robotics Hardware', display_order: 2, created_at: '' },
  { id: 's-7', name: 'NVIDIA Jetson AGX', category: 'Robotics Hardware', display_order: 3, created_at: '' },
  { id: 's-8', name: 'DGX-H100', category: 'Robotics Hardware', display_order: 4, created_at: '' },
  { id: 's-9', name: 'A6000', category: 'Robotics Hardware', display_order: 5, created_at: '' },
  { id: 's-10', name: 'AGV', category: 'Robotics Hardware', display_order: 6, created_at: '' },
  { id: 's-11', name: 'Robotic Arm', category: 'Robotics Hardware', display_order: 7, created_at: '' },
  { id: 's-12', name: '2D LiDAR', category: 'Robotics Hardware', display_order: 8, created_at: '' },

  // Simulation / Robotics Libraries
  { id: 's-13', name: 'Gazebo', category: 'Simulation / Robotics Libraries', display_order: 1, created_at: '' },
  { id: 's-14', name: 'CARLA', category: 'Simulation / Robotics Libraries', display_order: 2, created_at: '' },
  { id: 's-15', name: 'RViz', category: 'Simulation / Robotics Libraries', display_order: 3, created_at: '' },
  { id: 's-16', name: 'Nav2', category: 'Simulation / Robotics Libraries', display_order: 4, created_at: '' },
  { id: 's-17', name: 'MoveIt', category: 'Simulation / Robotics Libraries', display_order: 5, created_at: '' },
  { id: 's-18', name: 'OpenCV', category: 'Simulation / Robotics Libraries', display_order: 6, created_at: '' },
  { id: 's-19', name: 'Isaac Sim', category: 'Simulation / Robotics Libraries', display_order: 7, created_at: '' },

  // Mechanical CAD
  { id: 's-20', name: 'Fusion 360', category: 'Mechanical CAD', display_order: 1, created_at: '' },
  { id: 's-21', name: 'Catia V5', category: 'Mechanical CAD', display_order: 2, created_at: '' },
  { id: 's-22', name: 'PTC Creo', category: 'Mechanical CAD', display_order: 3, created_at: '' },
  { id: 's-23', name: 'AutoCAD', category: 'Mechanical CAD', display_order: 4, created_at: '' },
  { id: 's-24', name: 'SolidWorks', category: 'Mechanical CAD', display_order: 5, created_at: '' },

  // Mechanical CAE
  { id: 's-25', name: 'Ansys Mechanical', category: 'Mechanical CAE', display_order: 1, created_at: '' },
  { id: 's-26', name: 'MATLAB', category: 'Mechanical CAE', display_order: 2, created_at: '' },
  { id: 's-27', name: 'Simulink', category: 'Mechanical CAE', display_order: 3, created_at: '' },
  { id: 's-28', name: 'Hypermesh', category: 'Mechanical CAE', display_order: 4, created_at: '' },
  { id: 's-29', name: 'Ansys Discovery', category: 'Mechanical CAE', display_order: 5, created_at: '' },

  // General / AI
  { id: 's-30', name: 'Machine Learning', category: 'General / AI', display_order: 1, created_at: '' },
  { id: 's-31', name: 'Vision Language Models', category: 'General / AI', display_order: 2, created_at: '' },
  { id: 's-32', name: 'Deep Learning', category: 'General / AI', display_order: 3, created_at: '' },
  { id: 's-33', name: 'Control Systems', category: 'General / AI', display_order: 4, created_at: '' },
  { id: 's-34', name: 'Navigation', category: 'General / AI', display_order: 5, created_at: '' },
  { id: 's-35', name: 'Kalman Filter', category: 'General / AI', display_order: 6, created_at: '' },
  { id: 's-36', name: 'AMCL', category: 'General / AI', display_order: 7, created_at: '' },
  { id: 's-37', name: 'Image Processing', category: 'General / AI', display_order: 8, created_at: '' },
  { id: 's-38', name: 'Path Planning', category: 'General / AI', display_order: 9, created_at: '' },
  { id: 's-39', name: 'Linux', category: 'General / AI', display_order: 10, created_at: '' },
  { id: 's-40', name: 'Excel', category: 'General / AI', display_order: 11, created_at: '' },
  { id: 's-41', name: 'Computer Vision', category: 'General / AI', display_order: 12, created_at: '' },
  { id: 's-42', name: 'Inverse Kinematics', category: 'General / AI', display_order: 13, created_at: '' }
];

export const fallbackProjects: Project[] = [
  {
    id: 'multi-robot-swarm-simulation',
    title: 'Multi-Robot Swarm Simulation (Volta Swarm & DL-DCL)',
    slug: 'multi-robot-swarm-simulation',
    short_description: 'Scalable Gazebo swarm simulation of Volta AGVs implementing Artificial Potential Fields and Decentralized Localization.',
    full_description: 'Task 1 from IISc AIRL Evaluation: Created a scalable multi-robot swarm simulation in Gazebo featuring optimized Botsync Volta URDF models. Implemented custom control laws based on Decentralized Localization (DL-DCL) and Artificial Potential Field (APF) algorithms, enabling autonomous collision-free formation control and rendezvous to dynamic RViz 2D Nav Goals across multi-robot nodes.',
    date_string: 'July 2025',
    category: 'Robotics',
    technologies: ['ROS 1', 'Gazebo', 'URDF', 'RViz', 'Artificial Potential Fields', 'DL-DCL', 'Swarm Robotics', 'Python'],
    thumbnail_url: null,
    github_url: 'https://github.com/botsync/volta',
    external_url: 'https://drive.google.com/file/d/1X8N8C8ynqx2u0tQxfa1EjoVbcStLNoz7/view?usp=sharing',
    status: 'published',
    is_featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [
      {
        id: 'v-swarm-1',
        project_id: 'multi-robot-swarm-simulation',
        title: 'Swarm Simulation & Control Demo',
        url: 'https://drive.google.com/file/d/1X8N8C8ynqx2u0tQxfa1EjoVbcStLNoz7/view?usp=sharing',
        type: 'external',
        display_order: 1,
        created_at: ''
      },
      {
        id: 'v-swarm-2',
        project_id: 'multi-robot-swarm-simulation',
        title: 'Multi-Robot Formation Walkthrough',
        url: 'https://drive.google.com/file/d/1grIFe9F8QDZXSpY7eEdSezy4rzLUsIYw/view?usp=sharing',
        type: 'external',
        display_order: 2,
        created_at: ''
      }
    ],
    presentations: []
  },
  {
    id: '3d-lidar-pointnet-ros',
    title: '3D LiDAR Object Detection via PointNet ROS',
    slug: '3d-lidar-pointnet-ros',
    short_description: 'Real-time 3D point cloud object detection pipeline for autonomous target tracking using PointNet architecture.',
    full_description: 'Task 2 from IISc AIRL Evaluation: Designed an end-to-end 3D object detection system for unstructured LiDAR point cloud data. Converted KITTI/NuScenes dataset samples into ROS bag streams (`kittiabag`) and executed pre-trained PointNet inferences live over streaming ROS sensor topics to enable target tracking for mobile autonomous ground vehicles.',
    date_string: 'July 2025',
    category: 'Computer Vision',
    technologies: ['ROS', 'PointNet', '3D LiDAR', 'PointCloud2', 'KITTI Dataset', 'PyTorch', 'ROSbag'],
    thumbnail_url: null,
    github_url: null,
    external_url: 'http://drive.google.com/file/d/1iwAvw-CLSt1E7dsEV19mEyqNlrR_4acb/view',
    status: 'published',
    is_featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [
      {
        id: 'v-pointnet-1',
        project_id: '3d-lidar-pointnet-ros',
        title: 'PointNet 3D Pointcloud Detection Stream',
        url: 'http://drive.google.com/file/d/1iwAvw-CLSt1E7dsEV19mEyqNlrR_4acb/view',
        type: 'external',
        display_order: 1,
        created_at: ''
      }
    ],
    presentations: []
  },
  {
    id: 'nav2-ackermann-navigation',
    title: 'Nav2 Autonomous Navigation for Ackermann Vehicles',
    slug: 'nav2-ackermann-navigation',
    short_description: 'ROS2 Jazzy and Gazebo Harmonic navigation benchmarking for car-like Ackermann steered robots using Nav2.',
    full_description: 'Task 3 from IISc AIRL Evaluation: Developed an end-to-end autonomous navigation stack for Ackermann vehicles using ROS2 Jazzy and Gazebo Harmonic. Constructed Ackermann URDF dynamics with 3D LiDAR and IMU sensors, performed real-time SLAM mapping with `slam_toolbox`, projected 3D point clouds to 2D scans (`pointcloud-to-laserscan`), and integrated Nav2 using Smac Hybrid-A* global planner and Regulated Pure Pursuit local controller.',
    date_string: 'July 2025',
    category: 'Autonomous Navigation',
    technologies: ['ROS 2 Jazzy', 'Gazebo Harmonic', 'Nav2', 'Smac Hybrid-A*', 'Regulated Pure Pursuit', 'SLAM Toolbox', 'Ackermann Steering'],
    thumbnail_url: null,
    github_url: null,
    external_url: 'http://drive.google.com/file/d/1CSGAO-_tbbPsIgcmrvepT3TeJZAZi21t/view',
    status: 'published',
    is_featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [
      {
        id: 'v-nav2-1',
        project_id: 'nav2-ackermann-navigation',
        title: 'Nav2 Ackermann Vehicle SLAM & Goal Navigation',
        url: 'http://drive.google.com/file/d/1CSGAO-_tbbPsIgcmrvepT3TeJZAZi21t/view',
        type: 'external',
        display_order: 1,
        created_at: ''
      }
    ],
    presentations: []
  },
  {
    id: 'cosmo-logistic',
    title: 'Cosmo Logistic',
    slug: 'cosmo-logistic',
    short_description: 'Designed a collaborative warehouse system combining a robotic arm and mobile robot.',
    full_description: 'Developed an advanced warehouse automation project for the E-Yantra 2023–24 competition. The system coordinates a mobile robot base (AGV) and a robotic manipulator (arm) to execute complex material handling and sorting tasks. Utilized SLAM for mapping the warehouse environment, OpenCV for object recognition/classification, and inverse kinematics for precise robotic arm control. Navigation was handled using Nav2, and path planning was simulated and verified in Gazebo and Isaac Sim.',
    date_string: '2023 - 2024',
    category: 'Robotics',
    technologies: ['ROS 2', 'Gazebo', 'MoveIt 2', 'OpenCV', 'Git', 'RViz 2', 'Inverse Kinematics', 'Nav2', 'Isaac Sim'],
    thumbnail_url: null,
    github_url: 'https://github.com',
    external_url: null,
    status: 'published',
    is_featured: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [
      {
        id: 'v-1',
        project_id: 'cosmo-logistic',
        title: 'Cosmo Logistic Demonstration',
        url: 'https://youtu.be/Sl2FZHnXGDo',
        type: 'youtube',
        display_order: 1,
        created_at: ''
      }
    ],
    presentations: []
  },
  {
    id: 'stem-bot',
    title: 'STEM Bot',
    slug: 'stem-bot',
    short_description: 'Fabricated an affordable, modular mobile robot for educational and research prototyping.',
    full_description: 'My Final Year engineering project focused on designing, simulating, and fabricating an accessible, cost-effective mobile robot platform. STEM Bot is designed for students, hobbyists, and researchers to experiment with autonomous algorithms. The bot supports SLAM, autonomous navigation, and robotic arm manipulation. Integrated search and path planning algorithms including RRT*, A*, and Hybrid A* for motion planning inside dynamic obstacle environments.',
    date_string: '2023',
    category: 'Robotics',
    technologies: ['Arduino', 'Raspberry Pi', 'Python', 'SLAM', 'RRT*', 'A*', 'Hybrid A*', 'ROS', 'Navigation'],
    thumbnail_url: null,
    github_url: 'https://github.com',
    external_url: null,
    status: 'published',
    is_featured: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [
      {
        id: 'v-2',
        project_id: 'stem-bot',
        title: 'STEM Bot Demo',
        url: 'https://youtu.be/gzC24cW0of0',
        type: 'youtube',
        display_order: 1,
        created_at: ''
      }
    ]
  },
  {
    id: 'mecanum-chassis',
    title: 'Design and Analysis of an Omni/Mecanum Wheel Chassis in Simulink',
    slug: 'mecanum-chassis-simulink',
    short_description: 'Mathematical modeling and control system simulation of four-wheel drive holonomic chassis in Simulink.',
    full_description: 'Analyzed two configurations of four-wheel chassis (standard omnidirectional wheels and Mecanum wheels) using MATLAB/Simulink. The project involved deriving the kinematic and dynamic equations of motion, designing a PID-based speed and heading controller, and simulating various navigation paths to verify trajectory-following performance.',
    date_string: 'April 2022',
    category: 'Simulation',
    technologies: ['MATLAB', 'Simulink', 'Control Systems', 'PID Control', 'Kinematics'],
    thumbnail_url: null,
    github_url: null,
    external_url: null,
    status: 'archived',
    is_featured: false,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [],
    presentations: []
  },
  {
    id: 'line-follower',
    title: 'Advanced Line Following Bot',
    slug: 'line-following-bot',
    short_description: 'Created a high-speed PID-controlled line follower using industrial line sensors and micro-motors.',
    full_description: 'Developed a robust PID-controlled robotic platform using Arduino, a high-precision LSA08 analog line sensor array, and high-RPM N20 micro gear-motors. The bot features custom velocity profiling, path memory, and adaptive calibration. This design successfully achieved 15th rank out of 300 international teams competing in a high-speed robotics event.',
    date_string: 'June 2022 - July 2022',
    category: 'Robotics',
    technologies: ['Arduino', 'PID Control', 'Sensors', 'Electronics', 'Control Systems'],
    thumbnail_url: null,
    github_url: null,
    external_url: null,
    status: 'archived',
    is_featured: false,
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [],
    presentations: []
  },
  {
    id: 'bio-robot',
    title: 'Design, Analysis & Hardware Development of Rolling Type Miniature Bio-Robot',
    slug: 'miniature-bio-robot',
    short_description: 'Collaborative design of a remotely operated miniature medical capsule robot.',
    full_description: 'Worked in collaboration with Bhabha Atomic Research Centre (BARC) to design and model the hardware for a rolling-type miniature bio-robot. The system is designed as a remotely operated medical capsule utilizing a coreless DC motor and magnetic steering. Developed mathematical models for capsule motion within fluid channels and simulated rolling mechanics.',
    date_string: 'September 2022',
    category: 'Mechanical',
    technologies: ['SolidWorks', 'MATLAB', 'Bio-Robotics', 'CAD', 'Simulation'],
    thumbnail_url: null,
    github_url: null,
    external_url: null,
    status: 'published',
    is_featured: false,
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [],
    presentations: []
  },
  {
    id: 'foldable-helmet',
    title: 'Foldable Helmet',
    slug: 'foldable-helmet',
    short_description: 'Proposed a mechanical design for a foldable helmet that complies with safety standards.',
    full_description: 'Proposed and modeled an innovative foldable helmet structure meeting BIS (Bureau of Indian Standards) safety guidelines. Designed the mechanical locking mechanisms to ensure rigidity under impact while allowing the helmet to compact into a flat profile for easy portability. The project design was submitted and evaluated in the Dassault Systemes 3DExperience competition.',
    date_string: 'September 2022 - Present',
    category: 'Mechanical',
    technologies: ['Catia V5', 'Ansys Mechanical', 'PTC Creo', 'Product Design'],
    thumbnail_url: null,
    github_url: null,
    external_url: null,
    status: 'published',
    is_featured: false,
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [],
    presentations: []
  },
  {
    id: 'arm-simulink',
    title: 'Robotic Arm Simulation in Simulink',
    slug: 'robotic-arm-simulink',
    short_description: 'Simulated and analyzed a 6 Degrees-of-Freedom robotic manipulator in MATLAB/Simulink.',
    full_description: 'Built a complete simulation of a 6 Degrees-of-Freedom robotic arm in MATLAB and Simulink. Conducted forward and inverse kinematics calculations, modeled link inertia, and simulated actuators. Designed joint controllers and examined motion accuracy, path interpolation, and joint load analysis during coordinate trajectories.',
    date_string: 'March 2022',
    category: 'Simulation',
    technologies: ['MATLAB', 'Simulink', 'Inverse Kinematics', 'Control Systems', 'Robotic Arm'],
    thumbnail_url: null,
    github_url: null,
    external_url: null,
    status: 'published',
    is_featured: false,
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    videos: [],
    presentations: []
  }
];

export const fallbackAchievements: Achievement[] = [
  {
    id: 'a-1',
    title: 'Top 15 International Team - Robotics Competition',
    description: 'Ranked in the top 15 out of 300+ international teams in a high-speed line following robot competition.',
    date_string: 'July 2022',
    link_url: null,
    display_order: 1,
    created_at: ''
  },
  {
    id: 'a-2',
    title: 'E-Yantra Competition Finalist',
    description: 'Finalist in E-Yantra 2023-24 (Cosmo Logistic Project) demonstrating collaborative AGV-Manipulator simulation and SLAM navigation.',
    date_string: 'March 2024',
    link_url: null,
    display_order: 2,
    created_at: ''
  },
  {
    id: 'a-3',
    title: 'Patent Filed (Senior Team)',
    description: 'Co-contributor to a Mission Planner optimization patent for multi-sensor Electro Optical/IR/SAR imaging flight paths during research at IISc Bangalore.',
    date_string: '2025',
    link_url: null,
    display_order: 3,
    created_at: ''
  }
];

export const fallbackPublications: Publication[] = [
  {
    id: 'pub-1',
    title: 'Mission Planner Flight-Path Optimization for Multi-Sensor Airborne Surveillance',
    type: 'patent',
    authors: 'Shreyash Choudhari, AIRL Research Team',
    publisher_journal: 'Indian Patent Office / IISc Bangalore',
    year: 2025,
    abstract: 'Patented flight path optimization algorithm for aircraft carrying Electro-Optical, Infrared (IR), and Synthetic Aperture Radar (SAR) imaging sensors to optimize multi-target coverage trajectories.',
    url: 'https://drive.google.com/file/d/1wu5mEWe1Jl5IT-A1hjCjp_3CdgZFX1y6/view',
    doi_patent_number: 'PAT-2025-IISC-091',
    pdf_url: null,
    display_order: 1,
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'pub-2',
    title: 'Decentralized Localization and Formation Control for Autonomous Swarms (DL-DCL)',
    type: 'paper',
    authors: 'Shreyash Choudhari, Prof. Arpita Sinha et al.',
    publisher_journal: 'AAAI Conference on Artificial Intelligence / Robotics Proceedings',
    year: 2025,
    abstract: 'Presents a decentralized localization control framework (DL-DCL) paired with Artificial Potential Field dynamics to enforce scalable formation geometry and collision-free target navigation for ground robot swarms.',
    url: 'https://ojs.aaai.org/index.php/AAAI/article/view/25761',
    doi_patent_number: 'DOI: 10.1609/aaai.v37i10.25761',
    pdf_url: null,
    display_order: 2,
    status: 'published',
    created_at: new Date().toISOString()
  },
  {
    id: 'pub-3',
    title: 'Permutation-Invariant 3D LiDAR Object Detection via Streaming PointNet on ROS',
    type: 'preprint',
    authors: 'Shreyash Choudhari',
    publisher_journal: 'arXiv Preprints / Robotics Perception',
    year: 2025,
    abstract: 'Demonstrates real-time 3D object detection on unstructured sensor point clouds using ROS-integrated PointNet architecture and KITTI dataset bag conversions.',
    url: 'https://drive.google.com/file/d/1iwAvw-CLSt1E7dsEV19mEyqNlrR_4acb/view',
    doi_patent_number: 'arXiv:2507.10892',
    pdf_url: null,
    display_order: 3,
    status: 'published',
    created_at: new Date().toISOString()
  }
];
