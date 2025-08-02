// import XLSX from 'xlsx';
// import mongoose from 'mongoose';
// import { CustomerModel } from '../models/index.js';
// import { mockStorage } from './mockStorage.js';
// import { Customer } from '@shared/types';

// export class FileUploadService {
//   // Helper to check if MongoDB is available
//   private isMongoAvailable(): boolean {
//     return mongoose.connection.readyState === 1;
//   }

//   async processExcelFile(filePath: string): Promise<{
//     success: boolean;
//     customers: Customer[];
//     errors: string[];
//   }> {
//     const result = {
//       success: false,
//       customers: [] as Customer[],
//       errors: [] as string[]
//     };

//     try {
//       // Read the Excel file
//       const workbook = XLSX.readFile(filePath);
//       const sheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[sheetName];

//       // Convert to JSON
//       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//       if (jsonData.length === 0) {
//         result.errors.push('الملف فارغ');
//         return result;
//       }

//       const customers: Customer[] = [];
//       const processedPhones = new Set<string>();

//       // Skip header row and process data
//       for (let i = 1; i < jsonData.length; i++) {
//         const row = jsonData[i] as any[];
        
//         if (!row || row.length === 0) continue;

//         const phone = this.cleanPhoneNumber(row[0]);
//         const email = row[1] ? String(row[1]).trim() : undefined;
//         const name = row[2] ? String(row[2]).trim() : undefined;

//         // Validate phone number
//         if (!phone) {
//           result.errors.push(`الصف ${i + 1}: رقم الهاتف مفقود أو غير صالح`);
//           continue;
//         }

//         // Check for duplicates in current batch
//         if (processedPhones.has(phone)) {
//           result.errors.push(`الصف ${i + 1}: رقم الهاتف ${phone} مكرر في الملف`);
//           continue;
//         }

//         processedPhones.add(phone);

//         // Validate email if provided
//         if (email && !this.isValidEmail(email)) {
//           result.errors.push(`الصف ${i + 1}: بريد إلكتروني غير صالح ${email}`);
//         }

//         customers.push({
//           phone,
//           email: email || undefined,
//           name: name || `عميل ${phone.slice(-4)}`
//         });
//       }

//       // Save customers to database or mock storage
//       let savedCustomers: Customer[] = [];

//       if (!this.isMongoAvailable()) {
//         // Use mock storage
//         try {
//           savedCustomers = mockStorage.addCustomers(customers);
//         } catch (error) {
//           result.errors.push(`خطأ في حفظ البيانات: ${error}`);
//         }
//       } else {
//         // Use MongoDB
//         for (const customerData of customers) {
//           try {
//             // Check if customer already exists
//             let customer = await CustomerModel.findOne({ phone: customerData.phone });

//             if (customer) {
//               // Update existing customer
//               customer.email = customerData.email || customer.email;
//               customer.name = customerData.name || customer.name;
//               await customer.save();
//               savedCustomers.push(customer.toObject());
//             } else {
//               // Create new customer
//               customer = await CustomerModel.create(customerData);
//               savedCustomers.push(customer.toObject());
//             }
//           } catch (error) {
//             result.errors.push(`خطأ في حفظ العميل ${customerData.phone}: ${error}`);
//           }
//         }
//       }

//       result.customers = savedCustomers;
//       result.success = savedCustomers.length > 0;

//       console.log(`✅ تم معالجة ${savedCustomers.length} عميل من الملف`);
      
//       return result;
//     } catch (error) {
//       result.errors.push(`خطأ في معالجة الملف: ${error}`);
//       return result;
//     }
//   }

//   private cleanPhoneNumber(phone: any): string | null {
//     if (!phone) return null;
    
//     let cleanPhone = String(phone).replace(/\D/g, ''); // Remove non-digits
    
//     // Handle Egyptian numbers
//     if (cleanPhone.startsWith('20')) {
//       cleanPhone = cleanPhone.substring(2);
//     }
    
//     // Add +20 prefix for Egyptian numbers
//     if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
//       cleanPhone = '20' + cleanPhone;
//     }
    
//     // Validate length
//     if (cleanPhone.length < 10 || cleanPhone.length > 15) {
//       return null;
//     }
    
//     return cleanPhone;
//   }

//   private isValidEmail(email: string): boolean {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }
// }

// export const fileUploadService = new FileUploadService();




import XLSX from 'xlsx';
import mongoose from 'mongoose';
import { CustomerModel } from '../models/index.js';
import { mockStorage } from './mockStorage.js';
import { Customer } from '../../shared/types.js';

export class FileUploadService {
  private isMongoAvailable(): boolean {
    return mongoose.connection.readyState === 1;
  }

  async processExcelFile(filePath: string, userId: string): Promise<{
    success: boolean;
    customers: Customer[];
    errors: string[];
  }> {
    const result = {
      success: false,
      customers: [] as Customer[],
      errors: [] as string[]
    };

    try {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

      if (worksheet.length === 0) {
        result.errors.push('الملف فارغ');
        return result;
      }

      const customers: Customer[] = [];
      const processedPhones = new Set<string>();

      for (let i = 1; i < worksheet.length; i++) {
        const row = worksheet[i] as any[];

        if (!row || row.length === 0) continue;

        const phone = this.cleanPhoneNumber(row[0]);
        const email = row[1] ? String(row[1]).trim() : undefined;
        const name = row[2] ? String(row[2]).trim() : undefined;

        if (!phone) {
          result.errors.push(`الصف ${i + 1}: رقم الهاتف مفقو�� أو غير صالح`);
          continue;
        }

        if (processedPhones.has(phone)) {
          result.errors.push(`الصف ${i + 1}: رقم الهاتف ${phone} مكرر في الملف`);
          continue;
        }

        processedPhones.add(phone);

        if (email && !this.isValidEmail(email)) {
          result.errors.push(`الصف ${i + 1}: بريد إلكتروني غير صالح ${email}`);
        }

        customers.push({
          userId,
          phone,
          email: email || undefined,
          name: name || `عميل ${phone.slice(-4)}`
        });
      }

      let savedCustomers: Customer[] = [];

      if (!this.isMongoAvailable()) {
        try {
          savedCustomers = mockStorage.addCustomers(customers);
        } catch (error) {
          result.errors.push(`خطأ في حفظ البيانات: ${error}`);
        }
      } else {
        for (const customerData of customers) {
          try {
            // First, check if customer exists for this user
            let customer = await CustomerModel.findOne({
              phone: customerData.phone,
              userId: customerData.userId
            });

            if (customer) {
              // Update existing customer
              customer.email = customerData.email || customer.email;
              customer.name = customerData.name || customer.name;
              await customer.save();
              savedCustomers.push(customer.toObject());
            } else {
              // Check if customer exists globally (from old system without userId)
              const existingGlobalCustomer = await CustomerModel.findOne({
                phone: customerData.phone
              });

              if (existingGlobalCustomer) {
                // Update the existing customer to include userId
                existingGlobalCustomer.userId = customerData.userId;
                existingGlobalCustomer.email = customerData.email || existingGlobalCustomer.email;
                existingGlobalCustomer.name = customerData.name || existingGlobalCustomer.name;
                await existingGlobalCustomer.save();
                savedCustomers.push(existingGlobalCustomer.toObject());
              } else {
                // Create new customer
                customer = await CustomerModel.create(customerData);
                savedCustomers.push(customer.toObject());
              }
            }
          } catch (error) {
            console.error(`Error saving customer ${customerData.phone}:`, error);

            // Handle specific duplicate key error
            if (error instanceof Error && error.message.includes('E11000')) {
              try {
                // Try to find and update the existing customer
                const existingCustomer = await CustomerModel.findOne({
                  phone: customerData.phone
                });

                if (existingCustomer) {
                  existingCustomer.userId = customerData.userId;
                  existingCustomer.email = customerData.email || existingCustomer.email;
                  existingCustomer.name = customerData.name || existingCustomer.name;
                  await existingCustomer.save();
                  savedCustomers.push(existingCustomer.toObject());
                  console.log(`✅ Updated existing customer: ${customerData.phone}`);
                } else {
                  result.errors.push(`خطأ في حفظ العميل ${customerData.phone}: العميل موجود بالفعل`);
                }
              } catch (updateError) {
                result.errors.push(`خطأ في تحديث العميل ${customerData.phone}: ${updateError}`);
              }
            } else {
              result.errors.push(`خطأ في حفظ العميل ${customerData.phone}: ${error}`);
            }
          }
        }
      }

      result.customers = savedCustomers;
      result.success = savedCustomers.length > 0;

      console.log(`✅ تم معالجة ${savedCustomers.length} عميل من الملف`);
      return result;
    } catch (error) {
      result.errors.push(`خطأ في معالجة الملف: ${error}`);
      return result;
    }
  }

  /**
   * تنظيف وتنسيق رقم الهاتف ليكون بصيغة دولية صحيحة (E.164)
   */
  private cleanPhoneNumber(phone: any): string | null {
    if (!phone) return null;

    let cleanPhone = String(phone).replace(/\D/g, ''); // Remove all non-digit characters

    // إذا الرقم يبدأ بـ 0 أو 01 (مصر)
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
      cleanPhone = '20' + cleanPhone; // مصر
    }

    // إذا الرقم يبدأ بـ 05 (السعودية)
    if (cleanPhone.startsWith('05') && cleanPhone.length === 10) {
      cleanPhone = '966' + cleanPhone.slice(1); // السعودية
    }

    // تأكد إن الرقم الآن يبدأ بكود دولة وصالح للطول
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      return null;
    }

    return cleanPhone;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export const fileUploadService = new FileUploadService();
