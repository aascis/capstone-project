#!/usr/bin/env node

/**
 * Zammad API Test Script
 * This script tests the core Zammad API endpoints needed for Option 1 implementation
 * Run with: node test-zammad-api.js
 */

import http from 'http';

// Configuration - Update these for your environment
const ZAMMAD_BASE_URL = 'http://zammad.star.ca:8080';
const ZAMMAD_USER = 'test@capstone.ca'; // Use your test customer email
const ZAMMAD_PASS = 'Secret55'; // Use your test customer password

// Test customer email for API calls
const TEST_CUSTOMER_EMAIL = 'test@capstone.ca';

console.log('🔍 Testing Zammad API Connectivity...\n');

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Test functions
async function testConnection() {
  console.log('1️⃣ Testing basic connection to Zammad...');
  try {
    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: '/api/v1/users/me',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    if (result.status === 200) {
      console.log('✅ Connection successful!');
      console.log(`   User: ${result.data.firstname} ${result.data.lastname} (${result.data.email})`);
      return true;
    } else {
      console.log(`❌ Connection failed: ${result.status}`);
      console.log(`   Response: ${JSON.stringify(result.data)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    return false;
  }
}

async function testListTickets() {
  console.log('\n2️⃣ Testing ticket listing...');
  try {
    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: '/api/v1/tickets',
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    if (result.status === 200) {
      console.log(`✅ Retrieved ${result.data.length} tickets`);
      if (result.data.length > 0) {
        const ticket = result.data[0];
        console.log(`   Sample ticket: #${ticket.number} - ${ticket.title}`);
        console.log(`   Status: ${ticket.state} | Priority: ${ticket.priority || 'N/A'}`);
        return { success: true, ticketId: ticket.id };
      }
      return { success: true, ticketId: null };
    } else {
      console.log(`❌ Failed to list tickets: ${result.status}`);
      console.log(`   Response: ${JSON.stringify(result.data)}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Ticket listing error: ${error.message}`);
    return { success: false };
  }
}

async function testTicketDetails(ticketId) {
  if (!ticketId) {
    console.log('\n3️⃣ Skipping ticket details test (no tickets available)');
    return { success: true };
  }

  console.log(`\n3️⃣ Testing ticket details for ticket ${ticketId}...`);
  try {
    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: `/api/v1/tickets/${ticketId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    if (result.status === 200) {
      console.log('✅ Ticket details retrieved successfully');
      console.log(`   Title: ${result.data.title}`);
      console.log(`   State: ${result.data.state}`);
      console.log(`   Created: ${result.data.created_at}`);
      return { success: true };
    } else {
      console.log(`❌ Failed to get ticket details: ${result.status}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Ticket details error: ${error.message}`);
    return { success: false };
  }
}

async function testTicketArticles(ticketId) {
  if (!ticketId) {
    console.log('\n4️⃣ Skipping ticket articles test (no tickets available)');
    return { success: true };
  }

  console.log(`\n4️⃣ Testing ticket articles for ticket ${ticketId}...`);
  try {
    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: `/api/v1/ticket_articles/by_ticket/${ticketId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options);
    
    if (result.status === 200) {
      console.log(`✅ Retrieved ${result.data.length} articles`);
      if (result.data.length > 0) {
        const article = result.data[0];
        console.log(`   Sample article from: ${article.from || article.created_by}`);
        console.log(`   Type: ${article.type} | Internal: ${article.internal}`);
      }
      return { success: true };
    } else {
      console.log(`❌ Failed to get ticket articles: ${result.status}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Ticket articles error: ${error.message}`);
    return { success: false };
  }
}

async function testCreateTicket() {
  console.log('\n5️⃣ Testing ticket creation...');
  try {
    const ticketData = {
      title: `API Test Ticket - ${new Date().toISOString()}`,
      customer: TEST_CUSTOMER_EMAIL,
      article: {
        subject: 'API Test Ticket',
        body: 'This is a test ticket created via API to verify connectivity.',
        type: 'note',
        internal: false
      }
    };

    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: '/api/v1/tickets',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, JSON.stringify(ticketData));
    
    if (result.status === 201) {
      console.log('✅ Ticket created successfully!');
      console.log(`   Ticket ID: ${result.data.id}`);
      console.log(`   Number: #${result.data.number}`);
      return { success: true, ticketId: result.data.id };
    } else {
      console.log(`❌ Failed to create ticket: ${result.status}`);
      console.log(`   Response: ${JSON.stringify(result.data)}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Ticket creation error: ${error.message}`);
    return { success: false };
  }
}

async function testCreateArticle(ticketId) {
  if (!ticketId) {
    console.log('\n6️⃣ Skipping article creation test (no ticket available)');
    return { success: true };
  }

  console.log(`\n6️⃣ Testing article creation for ticket ${ticketId}...`);
  try {
    const articleData = {
      ticket_id: ticketId,
      body: 'This is a test reply added via API.',
      type: 'note',
      internal: false,
      sender: 'Customer'
    };

    const options = {
      hostname: 'zammad.star.ca',
      port: 8080,
      path: '/api/v1/ticket_articles',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${ZAMMAD_USER}:${ZAMMAD_PASS}`).toString('base64'),
        'Content-Type': 'application/json'
      }
    };

    const result = await makeRequest(options, JSON.stringify(articleData));
    
    if (result.status === 201) {
      console.log('✅ Article created successfully!');
      console.log(`   Article ID: ${result.data.id}`);
      return { success: true };
    } else {
      console.log(`❌ Failed to create article: ${result.status}`);
      console.log(`   Response: ${JSON.stringify(result.data)}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Article creation error: ${error.message}`);
    return { success: false };
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Zammad API Tests\n');
  console.log(`Target: ${ZAMMAD_BASE_URL}`);
  console.log(`User: ${ZAMMAD_USER}\n`);

  const results = [];
  
  // Test 1: Basic connection
  const connectionResult = await testConnection();
  results.push({ test: 'Connection', success: connectionResult });
  
  if (!connectionResult) {
    console.log('\n❌ Connection failed - stopping tests');
    return;
  }

  // Test 2: List tickets
  const listResult = await testListTickets();
  results.push({ test: 'List Tickets', success: listResult.success });
  
  // Test 3: Get ticket details
  const detailsResult = await testTicketDetails(listResult.ticketId);
  results.push({ test: 'Ticket Details', success: detailsResult.success });
  
  // Test 4: Get ticket articles
  const articlesResult = await testTicketArticles(listResult.ticketId);
  results.push({ test: 'Ticket Articles', success: articlesResult.success });
  
  // Test 5: Create ticket
  const createResult = await testCreateTicket();
  results.push({ test: 'Create Ticket', success: createResult.success });
  
  // Test 6: Create article
  const newArticleResult = await testCreateArticle(createResult.ticketId);
  results.push({ test: 'Create Article', success: newArticleResult.success });

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.test}`);
  });

  const successCount = results.filter(r => r.success).length;
  console.log(`\n🎯 ${successCount}/${results.length} tests passed`);
  
  if (successCount === results.length) {
    console.log('\n🎉 ALL TESTS PASSED! Option 1 implementation will work perfectly.');
    console.log('\nReady to implement:');
    console.log('• Enhanced ticket listing with search/filter');
    console.log('• Ticket detail modal with conversation history');
    console.log('• Reply functionality within your dashboard');
    console.log('• Real-time ticket updates');
  } else {
    console.log('\n⚠️  Some tests failed. Check Zammad configuration and credentials.');
  }
}

// Run the tests
runTests().catch(console.error);