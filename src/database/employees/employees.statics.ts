import { IEmployeeDocument, IEmployeeModel } from "./employees.types";

// export async function findOneOrCreate(
//   this: IEmployeeModel,
//   userId: string
// ): Promise<IEmployeeDocument> {
//   const record = await this.findOne({ userId });
//   if (record) {
//     return record;
//   } else {
//     return this.create({ userId });
//   }
// }
export async function findByAge(
  this: IEmployeeModel,
  min?: number,
  max?: number
): Promise<IEmployeeDocument[]> {
  return this.find({ age: { $gte: min || 0, $lte: max || Infinity } });
}
