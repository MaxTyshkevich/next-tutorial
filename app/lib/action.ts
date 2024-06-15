'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { z } from 'zod';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (formData: FormData) => {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  try {
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId},${amountInCents},${status},${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoices',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export const updateInvoice = async (id: string, formData: FormData) => {
  const { amount, customerId, status } = UpdateInvoice.parse(
    Object.fromEntries(formData.entries()),
  );

  const amountInCents = amount * 100;
  try {
    await sql`
    UPDATE invoives
    SET customerId=${customerId}, status=${status}, amount=${amountInCents}
    WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
};

export const deleteInvoices = async (id: string) => {
  throw new Error('Failed to Delete Invoice');
  /* try {
   
    await sql`
    DELETE FROM invoices
    WHERE id=${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice',
    };
  }

  revalidatePath('/dashboard/invoices'); */
};
