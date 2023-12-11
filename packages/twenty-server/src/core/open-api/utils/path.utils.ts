import {
  computeDepthParameters,
  computeFilterParameters,
  computeIdPathParameter,
  computeLastCursorParameters,
  computeLimitParameters,
  computeOrderByParameters,
} from 'src/core/open-api/utils/parameters.utils';
import { capitalize } from 'src/utils/capitalize';
import { ObjectMetadataEntity } from 'src/metadata/object-metadata/object-metadata.entity';
import {
  getDeleteResponse200,
  getManyResultResponse200,
  getSingleResultResponse200,
} from 'src/core/open-api/utils/responses.utils';

export const computeManyResultPath = (item: ObjectMetadataEntity) => {
  return {
    get: {
      tags: [item.namePlural],
      summary: `Find Many ${item.namePlural}`,
      description: `**order_by**, **filter**, **limit**, **depth** or **last_cursor** can be provided to request your **${item.namePlural}**`,
      operationId: `findManyCompanies${capitalize(item.namePlural)}`,
      parameters: [
        computeOrderByParameters(item),
        computeFilterParameters(item),
        computeLimitParameters(item),
        computeDepthParameters(item),
        computeLastCursorParameters(item),
      ],
      responses: {
        '200': getManyResultResponse200(item),
        '400': { $ref: '#/components/responses/400' },
        '401': { $ref: '#/components/responses/401' },
      },
    },
  };
};

export const computeSingleResultPath = (item: ObjectMetadataEntity) => {
  return {
    get: {
      tags: [item.namePlural],
      summary: `Find One ${item.nameSingular}`,
      description: `**depth** can be provided to request your **${item.nameSingular}**`,
      operationId: `findOneCompany${capitalize(item.nameSingular)}`,
      parameters: [computeIdPathParameter(item), computeDepthParameters(item)],
      responses: {
        '200': getSingleResultResponse200(item),
        '400': { $ref: '#/components/responses/400' },
        '401': { $ref: '#/components/responses/401' },
      },
    },
    delete: {
      tags: [item.namePlural],
      summary: `Delete One ${item.nameSingular}`,
      operationId: `deleteOneCompany${capitalize(item.nameSingular)}`,
      parameters: [computeIdPathParameter(item)],
      responses: {
        '200': getDeleteResponse200(item),
        '400': { $ref: '#/components/responses/400' },
        '401': { $ref: '#/components/responses/401' },
      },
    },
  };
};
