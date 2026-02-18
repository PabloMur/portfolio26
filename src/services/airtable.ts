const BASE_ID = import.meta.env.VITE_AIRTABLE_BASEID;
const TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLEID;
const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

export interface AirtableProject {
  id: string;
  image: string;
  title: string;
  description: string;
  githubUrl: string;
  deployUrl: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
}

export async function fetchProjects(): Promise<AirtableProject[]> {
  const response = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Airtable error: ${response.status}`);
  }

  const data = await response.json();

  return data.records.map((record: AirtableRecord) => ({
    id: record.id,
    title: record.fields.title || "",
    description: record.fields.description || "",
    image: record.fields.image || "",
    githubUrl: record.fields.githubUrl || "",
    deployUrl: record.fields.deployUrl || "",
  }));
}
