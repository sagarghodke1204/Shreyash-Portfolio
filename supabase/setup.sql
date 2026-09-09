-- Setup SQL script for Shreyash Choudhari's Robotics Portfolio and CMS
-- Run this in the Supabase SQL Editor.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clean up existing tables (order matters due to foreign keys)
drop table if exists public.presentations cascade;
drop table if exists public.project_videos cascade;
drop table if exists public.project_images cascade;
drop table if exists public.projects cascade;
drop table if exists public.publications cascade;
drop table if exists public.skills cascade;
drop table if exists public.education cascade;
drop table if exists public.experiences cascade;
drop table if exists public.achievements cascade;
drop table if exists public.profiles cascade;

-- 1. Profiles Table
create table public.profiles (
  id uuid primary key, -- Will match the Admin's Auth User ID
  name text not null,
  title text not null,
  bio text,
  avatar_url text,
  resume_url text,
  contact_email text,
  linkedin_url text,
  github_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Experiences Table
create table public.experiences (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  role text not null,
  location text,
  start_date text not null,
  end_date text,
  is_current boolean default false,
  highlights text[] default '{}'::text[] not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Education Table
create table public.education (
  id uuid default gen_random_uuid() primary key,
  institution text not null,
  degree text not null,
  field_of_study text,
  start_date text,
  end_date text,
  grade text,
  details text[] default '{}'::text[] not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Skills Table
create table public.skills (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null, -- 'Programming', 'Robotics Hardware', 'Simulation / Robotics Libraries', 'Mechanical CAD', 'Mechanical CAE', 'General / AI'
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Projects Table
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  short_description text not null,
  full_description text,
  date_string text,
  category text, -- 'Robotics', 'Computer Vision', 'AI/ML', 'Mechanical', 'Simulation', 'Autonomous Navigation'
  technologies text[] default '{}'::text[] not null,
  thumbnail_url text,
  github_url text,
  external_url text,
  status text default 'published'::text check (status in ('draft', 'published', 'archived')),
  is_featured boolean default false,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Project Videos Table
create table public.project_videos (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  title text,
  url text not null,
  type text default 'youtube' check (type in ('youtube', 'external', 'upload')),
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Presentations Table
create table public.presentations (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects on delete cascade not null,
  title text not null,
  url text not null,
  type text default 'external' check (type in ('pdf', 'google_drive', 'external')),
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Achievements Table
create table public.achievements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date_string text,
  link_url text,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Publications & Patents Table
create table public.publications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text default 'paper' check (type in ('paper', 'patent', 'conference', 'preprint')),
  authors text not null,
  publisher_journal text,
  year integer not null,
  abstract text,
  url text,
  doi_patent_number text,
  pdf_url text,
  display_order integer default 0,
  status text default 'published' check (status in ('published', 'pending', 'draft')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.project_videos enable row level security;
alter table public.presentations enable row level security;
alter table public.achievements enable row level security;
alter table public.publications enable row level security;

-- Create Policies

-- 1. Profiles Policies
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow authenticated users full access to profiles" on public.profiles for all to authenticated using (true) with check (true);

-- 2. Experiences Policies
create policy "Allow public read access to experiences" on public.experiences for select using (true);
create policy "Allow authenticated users full access to experiences" on public.experiences for all to authenticated using (true) with check (true);

-- 3. Education Policies
create policy "Allow public read access to education" on public.education for select using (true);
create policy "Allow authenticated users full access to education" on public.education for all to authenticated using (true) with check (true);

-- 4. Skills Policies
create policy "Allow public read access to skills" on public.skills for select using (true);
create policy "Allow authenticated users full access to skills" on public.skills for all to authenticated using (true) with check (true);

-- 5. Projects Policies
create policy "Allow public read access to published projects" on public.projects for select using (status = 'published' or status = 'archived' or auth.role() = 'authenticated');
create policy "Allow authenticated users full access to projects" on public.projects for all to authenticated using (true) with check (true);

-- 6. Project Videos Policies
create policy "Allow public read access to project videos" on public.project_videos for select using (true);
create policy "Allow authenticated users full access to project videos" on public.project_videos for all to authenticated using (true) with check (true);

-- 7. Presentations Policies
create policy "Allow public read access to presentations" on public.presentations for select using (true);
create policy "Allow authenticated users full access to presentations" on public.presentations for all to authenticated using (true) with check (true);

-- 8. Achievements Policies
create policy "Allow public read access to achievements" on public.achievements for select using (true);
create policy "Allow authenticated users full access to achievements" on public.achievements for all to authenticated using (true) with check (true);

-- 9. Publications Policies
create policy "Allow public read access to published publications" on public.publications for select using (status = 'published' or auth.role() = 'authenticated');
create policy "Allow authenticated users full access to publications" on public.publications for all to authenticated using (true) with check (true);


-- =========================================================================
-- SEED DATA
-- =========================================================================

-- Insert Experiences
insert into public.experiences (company, role, location, start_date, end_date, is_current, highlights, display_order) values
('Kalyani Group / Bharat Forge', 'RL Engineer', 'Pune', 'December 2025', 'Present', true, array[
  'VLM-based robotic perception pipeline using audio input to identify target objects, perform recognition and 3D localization, and enable robots to search across multi-floor buildings and navigate toward targets.',
  'Landmark-based navigation with zero-shot object detection and prompt-based segmentation.',
  'Work involving quadruped, legged, and humanoid platforms such as Go2 and B2-class robots.',
  'Approximately 20 cm navigation accuracy using a monocular camera.',
  '2-finger pick-and-place pipelines for humanoid robots using Vision-Language-Action models.',
  'Monocular-camera-based VLA pick-and-place for a UR5 robotic arm.'
], 1),
('Simplia AI', 'AI/Robotics Engineer', 'Remote, US-based', 'October 2025', 'December 2025', false, array[
  'Developed humanoid-based restaurant management systems.',
  'People tracking.',
  'Customer flow understanding.',
  'Order management.',
  'Simulation pipelines for humanoid-assisted restaurant operations.',
  'Inventory handling and workflow management.',
  'Service-robot workflow design.'
], 2),
('IISc Bangalore', 'Research Associate – AI/ML & Robotics', 'Bangalore', 'July 2024', 'October 2025', false, array[
  'Mission Planner: Mission planner for an aircraft carrying Electro Optical, IR and Synthetic Aperture Radar imaging sensors. Optimized imaging flight paths for multiple targets. Project submission completed and currently being patented by the senior team.',
  'End-to-End Autonomous Navigation for Vision Language Model: Developed edge-deployable models on NVIDIA Jetson AGX. Few-shot and zero-shot generalization. Test-time adaptation using VLMs. Domain generalization. Sim-to-real adaptation. VLM fine-tuning and TRL-based supervised fine-tuning.'
], 3),
('Emerging Technology', 'Systems Engineer', 'Remote', 'February 2023', 'June 2024', false, array[
  'ADAS: Remote control, follow-the-car, overtake scenarios. Implementation on Honda car.',
  'Python package for industrial servo motor control using Modbus RTU.',
  'Sensor and actuator integration: Encoder, Ultrasonic sensors, Acceleration/brake control systems.'
], 4),
('IIT Bombay', 'Research Intern – under Prof. Arpita Sinha', 'Bombay', 'September 2022', 'January 2023', false, array[
  'Trajectory planning for Level-5 autonomous car in a highway scenario.',
  'Camera-based navigation using Oak-D Pro camera.',
  'Simulation and verification in Isaac Sim and CARLA.',
  'Implementation on a four-wheeler with multiple sensors.'
], 5);

-- Insert Skills
insert into public.skills (name, category, display_order) values
-- Programming
('ROS / ROS2', 'Programming', 1),
('Python', 'Programming', 2),
('PyTorch', 'Programming', 3),
('Git', 'Programming', 4),

-- Robotics Hardware
('Arduino', 'Robotics Hardware', 1),
('Raspberry Pi', 'Robotics Hardware', 2),
('NVIDIA Jetson AGX', 'Robotics Hardware', 3),
('DGX-H100', 'Robotics Hardware', 4),
('A6000', 'Robotics Hardware', 5),
('AGV', 'Robotics Hardware', 6),
('Robotic Arm', 'Robotics Hardware', 7),
('2D LiDAR', 'Robotics Hardware', 8),

-- Simulation / Robotics Libraries
('Gazebo', 'Simulation / Robotics Libraries', 1),
('CARLA', 'Simulation / Robotics Libraries', 2),
('RViz', 'Simulation / Robotics Libraries', 3),
('Nav2', 'Simulation / Robotics Libraries', 4),
('MoveIt', 'Simulation / Robotics Libraries', 5),
('OpenCV', 'Simulation / Robotics Libraries', 6),
('Isaac Sim', 'Simulation / Robotics Libraries', 7),

-- Mechanical CAD
('Fusion 360', 'Mechanical CAD', 1),
('Catia V5', 'Mechanical CAD', 2),
('PTC Creo', 'Mechanical CAD', 3),
('AutoCAD', 'Mechanical CAD', 4),
('SolidWorks', 'Mechanical CAD', 5),

-- Mechanical CAE
('Ansys Mechanical', 'Mechanical CAE', 1),
('MATLAB', 'Mechanical CAE', 2),
('Simulink', 'Mechanical CAE', 3),
('Hypermesh', 'Mechanical CAE', 4),
('Ansys Discovery', 'Mechanical CAE', 5),

-- General / AI
('Machine Learning', 'General / AI', 1),
('Vision Language Models', 'General / AI', 2),
('Deep Learning', 'General / AI', 3),
('Control Systems', 'General / AI', 4),
('Navigation', 'General / AI', 5),
('Kalman Filter', 'General / AI', 6),
('AMCL', 'General / AI', 7),
('Image Processing', 'General / AI', 8),
('Path Planning', 'General / AI', 9),
('Linux', 'General / AI', 10),
('Excel', 'General / AI', 11),
('Computer Vision', 'General / AI', 12),
('Inverse Kinematics', 'General / AI', 13);

-- Insert Projects (Ordered Year-Wise: 2025 -> 2024 -> 2023 -> 2022)

-- 1. Multi-Robot Swarm Simulation (Task 1 from PPTX) - 2025
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('f1a2b3c4-0001-4000-8000-000000000001', 'Multi-Robot Swarm Simulation (Volta Swarm & DL-DCL)', 'multi-robot-swarm-simulation', 
 'Scalable Gazebo swarm simulation of Volta AGVs implementing Artificial Potential Fields and Decentralized Localization.', 
 'Task 1 from IISc AIRL Evaluation: Created a scalable multi-robot swarm simulation in Gazebo featuring optimized Botsync Volta URDF models. Implemented custom control laws based on Decentralized Localization (DL-DCL) and Artificial Potential Field (APF) algorithms, enabling autonomous collision-free formation control and rendezvous to dynamic RViz 2D Nav Goals across multi-robot nodes.', 
 'July 2025', 'Robotics', array['ROS 1', 'Gazebo', 'URDF', 'RViz', 'Artificial Potential Fields', 'DL-DCL', 'Swarm Robotics', 'Python'], 'published', true, 1);

insert into public.project_videos (project_id, title, url, type) values
('f1a2b3c4-0001-4000-8000-000000000001', 'Swarm Simulation & Control Demo', 'https://drive.google.com/file/d/1X8N8C8ynqx2u0tQxfa1EjoVbcStLNoz7/view?usp=sharing', 'external'),
('f1a2b3c4-0001-4000-8000-000000000001', 'Multi-Robot Formation Walkthrough', 'https://drive.google.com/file/d/1grIFe9F8QDZXSpY7eEdSezy4rzLUsIYw/view?usp=sharing', 'external');

-- 2. 3D LiDAR Object Detection via PointNet ROS (Task 2 from PPTX) - 2025
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('f1a2b3c4-0002-4000-8000-000000000002', '3D LiDAR Object Detection via PointNet ROS', '3d-lidar-pointnet-ros', 
 'Real-time 3D point cloud object detection pipeline for autonomous target tracking using PointNet architecture.', 
 'Task 2 from IISc AIRL Evaluation: Designed an end-to-end 3D object detection system for unstructured LiDAR point cloud data. Converted KITTI/NuScenes dataset samples into ROS bag streams (`kittiabag`) and executed pre-trained PointNet inferences live over streaming ROS sensor topics to enable target tracking for mobile autonomous ground vehicles.', 
 'July 2025', 'Computer Vision', array['ROS', 'PointNet', '3D LiDAR', 'PointCloud2', 'KITTI Dataset', 'PyTorch', 'ROSbag'], 'published', true, 2);

insert into public.project_videos (project_id, title, url, type) values
('f1a2b3c4-0002-4000-8000-000000000002', 'PointNet 3D Pointcloud Detection Stream', 'http://drive.google.com/file/d/1iwAvw-CLSt1E7dsEV19mEyqNlrR_4acb/view', 'external');

-- 3. Nav2 Autonomous Navigation for Ackermann Vehicles (Task 3 from PPTX) - 2025
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('f1a2b3c4-0003-4000-8000-000000000003', 'Nav2 Autonomous Navigation for Ackermann Vehicles', 'nav2-ackermann-navigation', 
 'ROS2 Jazzy and Gazebo Harmonic navigation benchmarking for car-like Ackermann steered robots using Nav2.', 
 'Task 3 from IISc AIRL Evaluation: Developed an end-to-end autonomous navigation stack for Ackermann vehicles using ROS2 Jazzy and Gazebo Harmonic. Constructed Ackermann URDF dynamics with 3D LiDAR and IMU sensors, performed real-time SLAM mapping with `slam_toolbox`, projected 3D point clouds to 2D scans (`pointcloud-to-laserscan`), and integrated Nav2 using Smac Hybrid-A* global planner and Regulated Pure Pursuit local controller.', 
 'July 2025', 'Autonomous Navigation', array['ROS 2 Jazzy', 'Gazebo Harmonic', 'Nav2', 'Smac Hybrid-A*', 'Regulated Pure Pursuit', 'SLAM Toolbox', 'Ackermann Steering'], 'published', true, 3);

insert into public.project_videos (project_id, title, url, type) values
('f1a2b3c4-0003-4000-8000-000000000003', 'Nav2 Ackermann Vehicle SLAM & Goal Navigation', 'http://drive.google.com/file/d/1CSGAO-_tbbPsIgcmrvepT3TeJZAZi21t/view', 'external');

-- 4. Cosmo Logistic - 2023-2024
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('c8cf4d21-f513-4318-809c-a1977e2056fa', 'Cosmo Logistic', 'cosmo-logistic', 
 'Designed a collaborative warehouse system combining a robotic arm and mobile robot.', 
 'Developed an advanced warehouse automation project for the E-Yantra 2023–24 competition. The system coordinates a mobile robot base (AGV) and a robotic manipulator (arm) to execute complex material handling and sorting tasks. Utilized SLAM for mapping the warehouse environment, OpenCV for object recognition/classification, and inverse kinematics for precise robotic arm control. Navigation was handled using Nav2, and path planning was simulated and verified in Gazebo and Isaac Sim.', 
 '2023 - 2024', 'Robotics', array['ROS 2', 'Gazebo', 'MoveIt 2', 'OpenCV', 'Git', 'RViz 2', 'Inverse Kinematics', 'Nav2', 'Isaac Sim'], 'published', true, 4);

insert into public.project_videos (project_id, title, url, type) values
('c8cf4d21-f513-4318-809c-a1977e2056fa', 'Cosmo Logistic Demonstration', 'https://youtu.be/Sl2FZHnXGDo', 'youtube');

-- 5. STEM Bot - 2023
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('a297e59e-9d21-4f9b-bd5e-4de4b4081c7e', 'STEM Bot', 'stem-bot', 
 'Fabricated an affordable, modular mobile robot for educational and research prototyping.', 
 'My Final Year engineering project focused on designing, simulating, and fabricating an accessible, cost-effective mobile robot platform. STEM Bot is designed for students, hobbyists, and researchers to experiment with autonomous algorithms. The bot supports SLAM, autonomous navigation, and robotic arm manipulation. Integrated search and path planning algorithms including RRT*, A*, and Hybrid A* for motion planning inside dynamic obstacle environments.', 
 '2023', 'Robotics', array['Arduino', 'Raspberry Pi', 'Python', 'SLAM', 'RRT*', 'A*', 'Hybrid A*', 'ROS', 'Navigation'], 'published', true, 5);

insert into public.project_videos (project_id, title, url, type) values
('a297e59e-9d21-4f9b-bd5e-4de4b4081c7e', 'STEM Bot Demo', 'https://youtu.be/gzC24cW0of0', 'youtube');

-- 6. Design and Analysis of an Omni/Mecanum Wheel Chassis in Simulink - 2022 (Archived Project Example)
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('e6403d6d-23a5-4e78-bc5a-e7587efcb951', 'Omni/Mecanum Wheel Chassis Analysis', 'mecanum-chassis-simulink', 
 'Mathematical modeling and control system simulation of four-wheel drive holonomic chassis in Simulink.', 
 'Analyzed two configurations of four-wheel chassis (standard omnidirectional wheels and Mecanum wheels) using MATLAB/Simulink. The project involved deriving the kinematic and dynamic equations of motion, designing a PID-based speed and heading controller, and simulating various navigation paths to verify trajectory-following performance.', 
 'April 2022', 'Simulation', array['MATLAB', 'Simulink', 'Control Systems', 'PID Control', 'Kinematics'], 'archived', false, 6);

-- 7. Advanced Line Following Bot - 2022 (Archived Project Example)
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('318e8749-e58f-4903-a2b1-c4ab8256e409', 'Advanced Line Following Bot', 'line-following-bot', 
 'Created a high-speed PID-controlled line follower using industrial line sensors and micro-motors.', 
 'Developed a robust PID-controlled robotic platform using Arduino, a high-precision LSA08 analog line sensor array, and high-RPM N20 micro gear-motors. The bot features custom velocity profiling, path memory, and adaptive calibration. This design successfully achieved 15th rank out of 300 international teams competing in a high-speed robotics event.', 
 'June 2022 - July 2022', 'Robotics', array['Arduino', 'PID Control', 'Sensors', 'Electronics', 'Control Systems'], 'archived', false, 7);

-- 8. Rolling Type Miniature Bio-Robot - 2022
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('6f09bd17-9154-47fa-8086-ee763567b14d', 'Rolling Miniature Bio-Robot', 'miniature-bio-robot', 
 'Collaborative design of a remotely operated miniature medical capsule robot.', 
 'Worked in collaboration with Bhabha Atomic Research Centre (BARC) to design and model the hardware for a rolling-type miniature bio-robot. The system is designed as a remotely operated medical capsule utilizing a coreless DC motor and magnetic steering. Developed mathematical models for capsule motion within fluid channels and simulated rolling mechanics.', 
 'September 2022', 'Mechanical', array['SolidWorks', 'MATLAB', 'Bio-Robotics', 'CAD', 'Simulation'], 'published', false, 8);

-- 9. Foldable Helmet - 2022
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('bfa5c7e1-32bf-4f27-9972-76bf8623b3eb', 'Foldable Helmet Design', 'foldable-helmet', 
 'Proposed a mechanical design for a foldable helmet that complies with safety standards.', 
 'Proposed and modeled an innovative foldable helmet structure meeting BIS (Bureau of Indian Standards) safety guidelines. Designed the mechanical locking mechanisms to ensure rigidity under impact while allowing the helmet to compact into a flat profile for easy portability. The project design was submitted and evaluated in the Dassault Systemes 3DExperience competition.', 
 'September 2022', 'Mechanical', array['Catia V5', 'Ansys Mechanical', 'PTC Creo', 'Product Design'], 'published', false, 9);

-- 10. Robotic Arm Simulation in Simulink - 2022
insert into public.projects (id, title, slug, short_description, full_description, date_string, category, technologies, status, is_featured, display_order) values
('d5084920-7212-4217-ba60-5f25a7f2120e', '6 DOF Robotic Arm Simulation', 'robotic-arm-simulink', 
 'Simulated and analyzed a 6 Degrees-of-Freedom robotic manipulator in MATLAB/Simulink.', 
 'Built a complete simulation of a 6 Degrees-of-Freedom robotic arm in MATLAB and Simulink. Conducted forward and inverse kinematics calculations, modeled link inertia, and simulated actuators. Designed joint controllers and examined motion accuracy, path interpolation, and joint load analysis during coordinate trajectories.', 
 'March 2022', 'Simulation', array['MATLAB', 'Simulink', 'Inverse Kinematics', 'Control Systems', 'Robotic Arm'], 'published', false, 10);


-- Insert Publications & Patents Seed Data
insert into public.publications (title, type, authors, publisher_journal, year, abstract, url, doi_patent_number, pdf_url, display_order, status) values
('Mission Planner Flight-Path Optimization for Multi-Sensor Airborne Surveillance', 'patent', 'Shreyash Choudhari, AIRL Research Team', 'Indian Patent Office / IISc Bangalore', 2025, 'Patented flight path optimization algorithm for aircraft carrying Electro-Optical, Infrared (IR), and Synthetic Aperture Radar (SAR) imaging sensors to optimize multi-target coverage trajectories.', 'https://drive.google.com/file/d/1wu5mEWe1Jl5IT-A1hjCjp_3CdgZFX1y6/view', 'PAT-2025-IISC-091', null, 1, 'published'),
('Decentralized Localization and Formation Control for Autonomous Swarms (DL-DCL)', 'paper', 'Shreyash Choudhari, Prof. Arpita Sinha et al.', 'AAAI Conference on Artificial Intelligence / Robotics Proceedings', 2025, 'Presents a decentralized localization control framework (DL-DCL) paired with Artificial Potential Field dynamics to enforce scalable formation geometry and collision-free target navigation for ground robot swarms.', 'https://ojs.aaai.org/index.php/AAAI/article/view/25761', 'DOI: 10.1609/aaai.v37i10.25761', null, 2, 'published'),
('Permutation-Invariant 3D LiDAR Object Detection via Streaming PointNet on ROS', 'preprint', 'Shreyash Choudhari', 'arXiv Preprints / Robotics Perception', 2025, 'Demonstrates real-time 3D object detection on unstructured sensor point clouds using ROS-integrated PointNet architecture and KITTI dataset bag conversions.', 'https://drive.google.com/file/d/1iwAvw-CLSt1E7dsEV19mEyqNlrR_4acb/view', 'arXiv:2507.10892', null, 3, 'published');


-- Insert Education Seed Data
insert into public.education (institution, degree, field_of_study, start_date, end_date, grade, details, display_order) values
('Pune University (VIIT)', 'Bachelor of Engineering (B.E.)', 'Mechanical Engineering', null, null, 'First Class with Distinction', array[
  'Specialized in Robotics, Automation, and Control Systems.',
  'Final Year Project: Design and Fabrication of STEM Bot (Autonomous Mobile Robot).'
], 1);

-- Insert Achievements Seed Data
insert into public.achievements (title, description, date_string, link_url, display_order) values
('Top 15 International Team - Robotics Competition', 'Ranked in the top 15 out of 300+ international teams in a high-speed line following robot competition.', 'July 2022', null, 1),
('E-Yantra Competition Finalist', 'Finalist in E-Yantra 2023-24 (Cosmo Logistic Project) demonstrating collaborative AGV-Manipulator simulation and SLAM navigation.', 'March 2024', null, 2),
('Patent Filed (Senior Team)', 'Co-contributor to a Mission Planner optimization patent for multi-sensor Electro Optical/IR/SAR imaging flight paths during research at IISc Bangalore.', '2025', null, 3);

