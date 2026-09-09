import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables must be defined.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAdmin() {
  const email = process.argv[2] || 'admin@portfolio.com';
  const password = process.argv[3] || 'admin12345';

  console.log(`[SEEDING] Creating Admin User...`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  try {
    // 1. Create Auth User
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (userError) {
      if (userError.message.includes('already exists') || userError.message.includes('already registered')) {
        console.log(`[SEEDING] Admin user already exists. Fetching existing user...`);
        // User already exists, try to locate their ID
        const { data: usersList, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = usersList.users.find(u => u.email === email);
        if (!existingUser) {
          throw new Error('User conflict detected but user could not be retrieved.');
        }
        await seedProfile(existingUser.id);
      } else {
        throw userError;
      }
    } else {
      console.log(`[SEEDING] Admin User created successfully with UUID: ${userData.user.id}`);
      await seedProfile(userData.user.id);
    }
  } catch (err) {
    console.error(`[SEEDING ERROR] Failed to seed admin user:`, err.message);
  }
}

async function seedProfile(userId) {
  console.log(`[SEEDING] Upserting profile record for UUID: ${userId}...`);
  const profilePayload = {
    id: userId,
    name: 'Shreyash Choudhari',
    title: 'Robotics / AI / Machine Learning Engineer',
    bio: 'Robotics engineer specializing in autonomous navigation, Vision-Language-Action models, and reinforcement learning.',
    contact_email: 'shreyash.choudhari@example.com',
    linkedin_url: 'https://linkedin.com/in/shreyash-choudhari',
    github_url: 'https://github.com/shreyash-choudhari',
    resume_url: null,
    avatar_url: null
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(profilePayload)
    .select();

  if (error) {
    throw error;
  }

  console.log(`[SEEDING] Profile upserted successfully:`, data);
  console.log(`\n======================================================`);
  console.log(`SUCCESS: Admin portal is ready.`);
  console.log(`Login URL: http://localhost:5174/#/admin/login`);
  console.log(`Username: ${process.argv[2] || 'admin@portfolio.com'}`);
  console.log(`Password: ${process.argv[3] || 'admin12345'}`);
  console.log(`======================================================`);
}

seedAdmin();
