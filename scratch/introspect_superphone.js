async function introspect() {
  const apiKey = '63af21a06e477c009a9de82d1575d30d3cf8c9f1a353509bfc571ab80c891718';
  const url = 'https://api.superphone.io/graphql';

  const introspectionQuery = `
    query {
      me {
        id
        email
        firstName
        lastName
      }
    }
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ query: introspectionQuery })
  });

  console.log(`Introspection Status: ${response.status}`);
  const result = await response.json();
  if (result.errors) {
    console.log("Introspection Errors:", JSON.stringify(result.errors, null, 2));
  }
  console.log(JSON.stringify(result, null, 2));
}

introspect();
