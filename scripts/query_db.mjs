import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in process.env.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDb() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  
  const { data: leads, error: leadsError } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (leadsError) {
    console.error("Error fetching leads:", leadsError);
  } else {
    console.log(`\n--- LEADS IN DATABASE (${leads.length}) ---`);
    console.log(JSON.stringify(leads, null, 2));
  }

  const { data: selections, error: selectionsError } = await supabase
    .from("selections")
    .select("*")
    .order("selected_at", { ascending: false });

  if (selectionsError) {
    console.error("Error fetching selections:", selectionsError);
  } else {
    console.log(`\n--- SELECTIONS IN DATABASE (${selections.length}) ---`);
    console.log(JSON.stringify(selections, null, 2));
  }
}

checkDb();
