import { getMedications } from "../../infrastructure/repositories/MedicationRepository";

export const fetchMedications = async () => {
    return await getMedications();
};
