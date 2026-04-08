const BASE_ID = import.meta.env.VITE_AIRTABLE_BASEID;
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLEID;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`;
const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

export interface AirtableProject {
  id: string;
  image: string;
  title: string;
  description: string;
  descriptionEn: string;
  githubUrl: string;
  deployUrl: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

function mapRecord(record: AirtableRecord): AirtableProject {
  const imageField = record.fields.image;
  let image = "";
  if (Array.isArray(imageField) && imageField.length > 0) {
    // Attachment field: [{url: "...", ...}]
    image = imageField[0].url || "";
  } else if (typeof imageField === "string") {
    // Plain text/URL field
    image = imageField;
  }

  return {
    id: record.id,
    title: record.fields.title || "",
    description: record.fields.description || "",
    descriptionEn: record.fields.descriptionEn || "",
    image,
    githubUrl: record.fields.githubUrl || "",
    deployUrl: record.fields.deployUrl || "",
  };
}

export async function fetchProjects(): Promise<AirtableProject[]> {
  const response = await fetch(BASE_URL, { headers: HEADERS });
  if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
  const data = await response.json();
  return data.records.map(mapRecord);
}

export async function createProject(
  fields: Omit<AirtableProject, "id">
): Promise<AirtableProject> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ fields }),
  });
  if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
  const data = await response.json();
  return mapRecord(data);
}

export async function updateProject(
  id: string,
  fields: Partial<Omit<AirtableProject, "id">>
): Promise<AirtableProject> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: HEADERS,
    body: JSON.stringify({ fields }),
  });
  if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
  const data = await response.json();
  return mapRecord(data);
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: HEADERS,
  });
  if (!response.ok) throw new Error(`Airtable error: ${response.status}`);
}
