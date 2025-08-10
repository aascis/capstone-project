// Simple test of authentication logic
const users = [
  { username: "rtamma", password: "Secret55", fullName: "RT Amma" },
  { username: "skota", password: "Secret55", fullName: "S Kota" },
  { username: "rianma", password: "Secret55", fullName: "Rianna Ma" },
  { username: "admin", password: "password123", fullName: "Admin User" }
];

function testAuth(username, password) {
  console.log(`Testing: ${username} / ${password}`);
  const user = users.find(u => 
    u.username.toLowerCase() === username.toLowerCase() && 
    u.password === password
  );
  
  if (user) {
    console.log(`✅ SUCCESS: Found user ${user.fullName}`);
    return { success: true, user };
  } else {
    console.log(`❌ FAILED: No match found`);
    console.log(`Available users: ${users.map(u => u.username).join(', ')}`);
    return { success: false };
  }
}

// Test your credentials
testAuth('rtamma', 'Secret55');
testAuth('skota', 'Secret55');
testAuth('admin', 'password123');
