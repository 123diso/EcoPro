import { supabase } from "../supabaseClient";

export interface ReportData {
  product_id: string;
  user_id?: string; 
  title: string;
  description?: string;
}

export async function createReport(data: ReportData) {
  try {
    // Validación básica
    if (!data.product_id || !data.title) {
      throw new Error("Faltan campos obligatorios para crear el reporte.");
    }

    const { error } = await supabase.from("reports").insert([
      {
        product_id: String(data.product_id),
        user_id: data.user_id ? String(data.user_id) : "anon", // evita error si no hay sesión
        title: data.title.trim(),
        description: data.description?.trim() ?? "",
        status: "pendiente",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error al insertar reporte:", error);
      throw new Error("No se pudo crear el reporte en la base de datos.");
    }

    return true;
  } catch (err) {
    console.error("Error en createReport:", err);
    throw err;
  }
}

export async function getReports() {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener reportes:", error);
    throw new Error("No se pudieron cargar los reportes.");
  }

  return data;
}
