import { InjectModel } from '@nestjs/mongoose';
import { DATABASE_CONNECTION_NAME } from '../../utils/constants';

export function DatabaseEntity(
  entity: string,
  connectionName?: string
): (target: Record<string, any>, key: string | symbol, index?: number) => void {
  return InjectModel(entity, connectionName || DATABASE_CONNECTION_NAME);
}
