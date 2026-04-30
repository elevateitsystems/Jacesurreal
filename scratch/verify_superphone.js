// Load environment variables manually for the test script
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}

const SUPERPHONE_API_URL = "https://api.superphone.io/graphql";

async function superphoneRequest(query, variables = {}) {
  const apiKey = "63af21a06e477c009a9de82d1575d30d3cf8c9f1a353509bfc571ab80c891718";

  if (!apiKey) {
    throw new Error("SUPPLER_PHONE_APIKEY is not defined");
  }

  const response = await fetch(SUPERPHONE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  console.log(`Response Status: ${response.status}`);
  const result = await response.json();
  if (result.errors) {
    console.log("Errors returned:", JSON.stringify(result.errors, null, 2));
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

async function runTests() {
  console.log("🚀 Starting SuperPhone API Verification...");

  try {
    // 0. Test Identity
    console.log("\n0. Testing IDENTITY (me)...");
    const meQuery = `
      query {
        me {
          id
          email
          firstName
          lastName
        }
      }
    `;
    const meData = await superphoneRequest(meQuery);
    console.log(`✅ Success! Authenticated as: ${meData.me.firstName} ${meData.me.lastName} (${meData.me.email})`);

    // 1. Test Fetch
    console.log("\n1. Testing FETCH (getContacts)...");
    const fetchQuery = `
      query getContacts($first: Int) {
        contacts(first: $first) {
          total
          nodes { id firstName lastName email mobile }
        }
      }
    `;
    const listData = await superphoneRequest(fetchQuery, { first: 5 });
    console.log(`✅ Success! Found ${listData.contacts.total} total contacts.`);
    if (listData.contacts.nodes.length > 0) {
        console.log(`First contact: ${listData.contacts.nodes[0].firstName} ${listData.contacts.nodes[0].lastName || ''}`);
    }

    // 2. Test Create
    console.log("\n2. Testing POST (createContact)...");
    const createMutation = `
      mutation createContact($input: ContactCreateInput!) {
        createContact(input: $input) {
          contact { id firstName lastName email }
          contactUserErrors { field message }
        }
      }
    `;
    const testEmail = `test_${Date.now()}@example.com`;
    const createData = await superphoneRequest(createMutation, {
      input: {
        firstName: "Test",
        lastName: "User",
        email: testEmail,
        tags: ["API Test"]
      }
    });

    if (createData.createContact.contactUserErrors.length > 0) {
      throw new Error(createData.createContact.contactUserErrors[0].message);
    }

    const newContactId = createData.createContact.contact.id;
    console.log(`✅ Success! Created contact with ID: ${newContactId}`);

    // 3. Test Patch
    console.log("\n3. Testing PATCH (updateContact)...");
    const updateMutation = `
      mutation updateContact($input: ContactUpdateInput!) {
        updateContact(input: $input) {
          contact { id firstName lastName }
          contactUserErrors { field message }
        }
      }
    `;
    const updateData = await superphoneRequest(updateMutation, {
      input: {
        id: newContactId,
        firstName: "Updated"
      }
    });

    if (updateData.updateContact.contactUserErrors.length > 0) {
      throw new Error(updateData.updateContact.contactUserErrors[0].message);
    }
    console.log(`✅ Success! Updated firstName to: ${updateData.updateContact.contact.firstName}`);

    // 4. Test Delete
    console.log("\n4. Testing DELETE (removeContact)...");
    const removeMutation = `
      mutation removeContact($input: ContactRemoveInput!) {
        removeContact(input: $input) {
          removedContactId
          contactUserErrors { field message }
        }
      }
    `;
    const removeData = await superphoneRequest(removeMutation, {
      input: { id: newContactId }
    });

    if (removeData.removeContact.contactUserErrors.length > 0) {
      throw new Error(removeData.removeContact.contactUserErrors[0].message);
    }
    console.log(`✅ Success! Removed contact ID: ${removeData.removeContact.removedContactId}`);

    console.log("\n✨ All SuperPhone API tests passed successfully!");

  } catch (error) {
    console.error("\n❌ Test Failed:", error.message);
    process.exit(1);
  }
}

runTests();
