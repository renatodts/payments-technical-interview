/**
 * @author Renato de Matos <contact@renatodematos.com>
 */

import z from "zod";

// I could refine this schema to match a valid UID,
// but I'm keeping it simple for the sake of this example.
export const GetPaymentDetailsSchema = z.string();
