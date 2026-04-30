const SUPERPHONE_API_URL = "https://api.superphone.io/graphql";

export interface SuperPhoneContact {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
  vip?: boolean;
  photo?: string;
  totalSpent?: number;
}

export interface SuperPhoneUserError {
  field: string[];
  message: string;
}

async function superphoneRequest<T>(query: string, variables: any = {}): Promise<T> {
  const apiKey = process.env.SUPPER_PHONE_APIKEY;

  if (!apiKey) {
    throw new Error("SUPPER_PHONE_APIKEY is not defined in environment variables");
  }

  const response = await fetch(SUPERPHONE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (result.errors) {
    console.error("SuperPhone GraphQL Errors:", result.errors);
    throw new Error(result.errors[0].message || "SuperPhone API request failed");
  }

  return result.data;
}

// --- Queries ---

const GET_CONTACTS_QUERY = `
  query getContacts($first: Int, $after: String) {
    contacts(first: $first, after: $after) {
      total
      nodes {
        id
        firstName
        lastName
        email
        mobile
        vip
        photo
        totalSpent
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const GET_CONTACT_QUERY = `
  query getContact($id: ID!) {
    contact(id: $id) {
      id
      firstName
      lastName
      email
      mobile
      vip
      photo
      totalSpent
    }
  }
`;

// --- Mutations ---

const CREATE_CONTACT_MUTATION = `
  mutation createContact($input: ContactCreateInput!) {
    createContact(input: $input) {
      contact {
        id
        firstName
        lastName
        email
        mobile
      }
      contactUserErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_CONTACT_MUTATION = `
  mutation updateContact($input: ContactUpdateInput!) {
    updateContact(input: $input) {
      contact {
        id
        firstName
        lastName
        email
        mobile
      }
      contactUserErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_CONTACT_MUTATION = `
  mutation removeContact($input: ContactRemoveInput!) {
    removeContact(input: $input) {
      removedContactId
      contactUserErrors {
        field
        message
      }
    }
  }
`;

// --- Exported Functions ---

export async function getContacts(first: number = 10, after?: string) {
  return superphoneRequest<{
    contacts: {
      total: number;
      nodes: SuperPhoneContact[];
      pageInfo: { hasNextPage: boolean; endCursor: string };
    };
  }>(GET_CONTACTS_QUERY, { first, after });
}

export async function getContact(id: string) {
  return superphoneRequest<{ contact: SuperPhoneContact }>(GET_CONTACT_QUERY, { id });
}

export async function createContact(input: {
  firstName: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}) {
  return superphoneRequest<{
    createContact: {
      contact: SuperPhoneContact;
      contactUserErrors: SuperPhoneUserError[];
    };
  }>(CREATE_CONTACT_MUTATION, { input });
}

export async function updateContact(input: {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}) {
  return superphoneRequest<{
    updateContact: {
      contact: SuperPhoneContact;
      contactUserErrors: SuperPhoneUserError[];
    };
  }>(UPDATE_CONTACT_MUTATION, { input });
}

export async function removeContact(id: string) {
  return superphoneRequest<{
    removeContact: {
      removedContactId: string;
      contactUserErrors: SuperPhoneUserError[];
    };
  }>(REMOVE_CONTACT_MUTATION, { input: { id } });
}
