import { createOwner, getOwners } from "../../infrastructure/repositories/OwnerRepository";
import { Owner } from "../../domain/Owner";

export const addOwner = async (name: string): Promise<Owner> => {
    return await createOwner(name);
};

export const fetchOwners = async (): Promise<Owner[]> => {
    return await getOwners();
};

