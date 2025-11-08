# 🎉 Add 15 Sample Users - Super Simple!

## 📋 **Copy & Paste Method** (Easiest!)

### Step 1: Open Your App

Go to http://localhost:3000

### Step 2: Open Browser Console

- **Mac:** Press `Cmd + Option + J`
- **Windows:** Press `Ctrl + Shift + J`
- **Or:** Right-click → Inspect → Console tab

### Step 3: Copy & Paste This Code

```javascript
const sampleUsers = [
    {name: 'Sarah Chen', age: 28, skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'], profilePhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face', bio: 'UI/UX Designer with 5 years of experience. Love creating beautiful and intuitive user experiences.', location: 'New York, NY', experience: '5 years', interests: ['Design Thinking', 'Product Design', 'Accessibility'], lookingFor: 'project-collaborator', availability: 'part-time'},
    {name: 'Michael Davis', age: 30, skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'], profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face', bio: 'Machine Learning Engineer specializing in NLP and computer vision.', location: 'Boston, MA', experience: '7 years', interests: ['Deep Learning', 'AI Ethics', 'Research'], lookingFor: 'hackathon-partner', availability: 'weekends'},
    {name: 'Emily Rodriguez', age: 26, skills: ['Product Strategy', 'Agile', 'SQL', 'Analytics'], profilePhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face', bio: 'Product Manager with technical background. Love building products people love.', location: 'Austin, TX', experience: '4 years', interests: ['Product Management', 'Startups'], lookingFor: 'co-founder', availability: 'flexible'},
    {name: 'David Kim', age: 27, skills: ['Kubernetes', 'CI/CD', 'Terraform', 'Python'], profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face', bio: 'DevOps Engineer passionate about automation and infrastructure.', location: 'Seattle, WA', experience: '5 years', interests: ['Infrastructure', 'Automation', 'Open Source'], lookingFor: 'project-collaborator', availability: 'part-time'},
    {name: 'Jessica Taylor', age: 24, skills: ['React Native', 'Flutter', 'iOS', 'Android'], profilePhoto: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face', bio: 'Mobile developer specializing in React Native and Flutter.', location: 'Los Angeles, CA', experience: '3 years', interests: ['Mobile Apps', 'UI Animation'], lookingFor: 'hackathon-partner', availability: 'weekends'},
    {name: 'Ryan Martinez', age: 29, skills: ['Solidity', 'Web3.js', 'Smart Contracts', 'Ethereum'], profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face', bio: 'Blockchain developer and Web3 enthusiast. Building the decentralized future.', location: 'Miami, FL', experience: '4 years', interests: ['Blockchain', 'Cryptocurrency', 'DeFi'], lookingFor: 'co-founder', availability: 'full-time'},
    {name: 'Olivia Brown', age: 31, skills: ['Python', 'R', 'SQL', 'Tableau'], profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face', bio: 'Data Scientist with expertise in predictive analytics and visualization.', location: 'Chicago, IL', experience: '8 years', interests: ['Data Visualization', 'Machine Learning'], lookingFor: 'mentor', availability: 'flexible'},
    {name: 'James Wilson', age: 33, skills: ['Penetration Testing', 'Network Security', 'Cryptography'], profilePhoto: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&h=400&fit=crop&crop=face', bio: 'Cybersecurity specialist and ethical hacker. Helping companies secure infrastructure.', location: 'Washington, DC', experience: '10 years', interests: ['Cybersecurity', 'Ethical Hacking'], lookingFor: 'project-collaborator', availability: 'part-time'},
    {name: 'Sophia Anderson', age: 26, skills: ['Unity', 'C#', 'Unreal Engine', 'Game Design'], profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face', bio: 'Game developer with passion for immersive experiences.', location: 'Portland, OR', experience: '6 years', interests: ['Game Development', 'Virtual Reality'], lookingFor: 'hackathon-partner', availability: 'weekends'},
    {name: 'Alex Thompson', age: 25, skills: ['React', 'Node.js', 'MongoDB', 'AWS'], profilePhoto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face', bio: 'Full-stack developer passionate about building scalable applications.', location: 'San Francisco, CA', experience: '4 years', interests: ['Cloud Computing', 'Microservices'], lookingFor: 'co-founder', availability: 'full-time'},
    {name: 'Priya Patel', age: 27, skills: ['Marketing', 'Content Strategy', 'SEO', 'Analytics'], profilePhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop&crop=face', bio: 'Growth marketer with data-driven approach. Love scaling startups.', location: 'Denver, CO', experience: '5 years', interests: ['Digital Marketing', 'Brand Building'], lookingFor: 'co-founder', availability: 'flexible'},
    {name: 'Marcus Johnson', age: 29, skills: ['Swift', 'SwiftUI', 'iOS Development', 'ARKit'], profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces', bio: 'iOS developer creating next-gen mobile experiences with AR.', location: 'San Diego, CA', experience: '6 years', interests: ['Augmented Reality', 'Mobile UX'], lookingFor: 'project-collaborator', availability: 'part-time'},
    {name: 'Nina Kowalski', age: 24, skills: ['Go', 'Docker', 'Microservices', 'gRPC'], profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face', bio: 'Backend engineer specializing in high-performance distributed systems.', location: 'Berlin, Germany', experience: '3 years', interests: ['System Design', 'Performance'], lookingFor: 'hackathon-partner', availability: 'weekends'},
    {name: 'Carlos Mendez', age: 32, skills: ['Vue.js', 'TypeScript', 'GraphQL', 'Firebase'], profilePhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face', bio: 'Frontend architect with passion for clean code and beautiful interfaces.', location: 'Barcelona, Spain', experience: '9 years', interests: ['Web Performance', 'Accessibility'], lookingFor: 'mentor', availability: 'flexible'},
    {name: 'Aisha Khan', age: 28, skills: ['Rust', 'WebAssembly', 'System Programming', 'Performance'], profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face', bio: 'Systems programmer building next generation of web applications.', location: 'Toronto, Canada', experience: '5 years', interests: ['Systems Programming', 'WebAssembly'], lookingFor: 'co-founder', availability: 'full-time'}
];

const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
const newUsers = sampleUsers.map((user, index) => ({id: 'sample-' + Date.now() + '-' + index, _id: 'sample-' + Date.now() + '-' + index, email: user.name.toLowerCase().replace(' ', '.') + '@example.com', ...user, createdAt: new Date()}));
const allUsers = [...existingUsers, ...newUsers];
localStorage.setItem('allUsers', JSON.stringify(allUsers));
console.log(`✅ Success! Added ${newUsers.length} sample users! Total: ${allUsers.length}. Refresh the page!`);
```

### Step 4: Press Enter

### Step 5: Refresh the Page

Press `F5` or `Cmd+R` (Mac) / `Ctrl+R` (Windows)

### Step 6: Start Swiping!

- Click "Start Swiping"
- Create your profile
- You'll now see 15 users to swipe on!

---

## 🎉 That's It!

You now have 15 diverse profiles to demo:

- UI/UX Designers
- ML Engineers
- Product Managers
- DevOps Engineers
- Mobile Developers
- Blockchain Developers
- Data Scientists
- And more!

All with real photos, bios, skills, and locations!

---

## 🔄 To Clear and Start Fresh

In browser console, paste:

```javascript
localStorage.clear();
location.reload();
```

Then add the users again!

---

**GitHub:** https://github.com/praytyushpande/crewlyx
