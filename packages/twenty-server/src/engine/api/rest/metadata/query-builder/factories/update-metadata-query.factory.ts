import { Injectable } from '@nestjs/common';

import { capitalize } from 'src/utils/capitalize';
import { fetchMetadataFields } from 'src/engine/api/rest/metadata/query-builder/utils/fetch-metadata-fields.utils';

@Injectable()
export class UpdateMetadataQueryFactory {
  create(objectNameSingular: string, objectNamePlural: string): string {
    const objectNameCapitalized = capitalize(objectNameSingular);

    const fields = fetchMetadataFields(objectNamePlural);

    return `
      mutation Update${objectNameCapitalized}($input: UpdateOne${objectNameCapitalized}Input!) {
        updateOne${objectNameCapitalized}(input: $input) {
          id
          ${fields}
        }
      }
    `;
  }
}
